/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { useCallback, useMemo, useEffect, useState } from 'react';
import {} from '@google/genai';
import process from 'node:process';
import { GitService, Logger, logSlashCommand, makeSlashCommandEvent, SlashCommandStatus, ToolConfirmationOutcome, Storage, IdeClient, } from '@google/gemini-cli-core';
import { useSessionStats } from '../contexts/SessionContext.js';
import { MessageType } from '../types.js';
import {} from '../commands/types.js';
import { CommandService } from '../../services/CommandService.js';
import { BuiltinCommandLoader } from '../../services/BuiltinCommandLoader.js';
import { FileCommandLoader } from '../../services/FileCommandLoader.js';
import { McpPromptLoader } from '../../services/McpPromptLoader.js';
import { parseSlashCommand } from '../../utils/commands.js';
import {} from '../state/extensions.js';
/**
 * Hook to define and process slash commands (e.g., /help, /clear).
 */
export const useSlashCommandProcessor = (config, settings, addItem, clearItems, loadHistory, refreshStatic, toggleVimEnabled, setIsProcessing, setGeminiMdFileCount, actions, extensionsUpdateState, isConfigInitialized) => {
    const session = useSessionStats();
    const [commands, setCommands] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const reloadCommands = useCallback(() => {
        setReloadTrigger((v) => v + 1);
    }, []);
    const [shellConfirmationRequest, setShellConfirmationRequest] = useState(null);
    const [confirmationRequest, setConfirmationRequest] = useState(null);
    const [sessionShellAllowlist, setSessionShellAllowlist] = useState(new Set());
    const gitService = useMemo(() => {
        if (!config?.getProjectRoot()) {
            return;
        }
        return new GitService(config.getProjectRoot(), config.storage);
    }, [config]);
    const logger = useMemo(() => {
        const l = new Logger(config?.getSessionId() || '', config?.storage ?? new Storage(process.cwd()));
        // The logger's initialize is async, but we can create the instance
        // synchronously. Commands that use it will await its initialization.
        return l;
    }, [config]);
    const [pendingItem, setPendingItem] = useState(null);
    const pendingHistoryItems = useMemo(() => {
        const items = [];
        if (pendingItem != null) {
            items.push(pendingItem);
        }
        return items;
    }, [pendingItem]);
    const addMessage = useCallback((message) => {
        // Convert Message to HistoryItemWithoutId
        let historyItemContent;
        if (message.type === MessageType.ABOUT) {
            historyItemContent = {
                type: 'about',
                cliVersion: message.cliVersion,
                osVersion: message.osVersion,
                sandboxEnv: message.sandboxEnv,
                modelVersion: message.modelVersion,
                selectedAuthType: message.selectedAuthType,
                gcpProject: message.gcpProject,
                ideClient: message.ideClient,
            };
        }
        else if (message.type === MessageType.HELP) {
            historyItemContent = {
                type: 'help',
                timestamp: message.timestamp,
            };
        }
        else if (message.type === MessageType.STATS) {
            historyItemContent = {
                type: 'stats',
                duration: message.duration,
            };
        }
        else if (message.type === MessageType.MODEL_STATS) {
            historyItemContent = {
                type: 'model_stats',
            };
        }
        else if (message.type === MessageType.TOOL_STATS) {
            historyItemContent = {
                type: 'tool_stats',
            };
        }
        else if (message.type === MessageType.QUIT) {
            historyItemContent = {
                type: 'quit',
                duration: message.duration,
            };
        }
        else if (message.type === MessageType.COMPRESSION) {
            historyItemContent = {
                type: 'compression',
                compression: message.compression,
            };
        }
        else {
            historyItemContent = {
                type: message.type,
                text: message.content,
            };
        }
        addItem(historyItemContent, message.timestamp.getTime());
    }, [addItem]);
    const commandContext = useMemo(() => ({
        services: {
            config,
            settings,
            git: gitService,
            logger,
        },
        ui: {
            addItem,
            clear: () => {
                clearItems();
                console.clear();
                refreshStatic();
            },
            loadHistory,
            setDebugMessage: actions.setDebugMessage,
            pendingItem,
            setPendingItem,
            toggleCorgiMode: actions.toggleCorgiMode,
            toggleVimEnabled,
            setGeminiMdFileCount,
            reloadCommands,
            extensionsUpdateState,
            dispatchExtensionStateUpdate: actions.dispatchExtensionStateUpdate,
            addConfirmUpdateExtensionRequest: actions.addConfirmUpdateExtensionRequest,
        },
        session: {
            stats: session.stats,
            sessionShellAllowlist,
        },
    }), [
        config,
        settings,
        gitService,
        logger,
        loadHistory,
        addItem,
        clearItems,
        refreshStatic,
        session.stats,
        actions,
        pendingItem,
        setPendingItem,
        toggleVimEnabled,
        sessionShellAllowlist,
        setGeminiMdFileCount,
        reloadCommands,
        extensionsUpdateState,
    ]);
    useEffect(() => {
        if (!config) {
            return;
        }
        const listener = () => {
            reloadCommands();
        };
        (async () => {
            const ideClient = await IdeClient.getInstance();
            ideClient.addStatusChangeListener(listener);
        })();
        return () => {
            (async () => {
                const ideClient = await IdeClient.getInstance();
                ideClient.removeStatusChangeListener(listener);
            })();
        };
    }, [config, reloadCommands]);
    useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
            const loaders = [
                new McpPromptLoader(config),
                new BuiltinCommandLoader(config),
                new FileCommandLoader(config),
            ];
            const commandService = await CommandService.create(loaders, controller.signal);
            setCommands(commandService.getCommands());
        };
        load();
        return () => {
            controller.abort();
        };
    }, [config, reloadTrigger, isConfigInitialized]);
    const handleSlashCommand = useCallback(async (rawQuery, oneTimeShellAllowlist, overwriteConfirmed) => {
        if (typeof rawQuery !== 'string') {
            return false;
        }
        const trimmed = rawQuery.trim();
        if (!trimmed.startsWith('/') && !trimmed.startsWith('?')) {
            return false;
        }
        setIsProcessing(true);
        const userMessageTimestamp = Date.now();
        addItem({ type: MessageType.USER, text: trimmed }, userMessageTimestamp);
        let hasError = false;
        const { commandToExecute, args, canonicalPath: resolvedCommandPath, } = parseSlashCommand(trimmed, commands);
        const subcommand = resolvedCommandPath.length > 1
            ? resolvedCommandPath.slice(1).join(' ')
            : undefined;
        try {
            if (commandToExecute) {
                if (commandToExecute.action) {
                    const fullCommandContext = {
                        ...commandContext,
                        invocation: {
                            raw: trimmed,
                            name: commandToExecute.name,
                            args,
                        },
                        overwriteConfirmed,
                    };
                    // If a one-time list is provided for a "Proceed" action, temporarily
                    // augment the session allowlist for this single execution.
                    if (oneTimeShellAllowlist && oneTimeShellAllowlist.size > 0) {
                        fullCommandContext.session = {
                            ...fullCommandContext.session,
                            sessionShellAllowlist: new Set([
                                ...fullCommandContext.session.sessionShellAllowlist,
                                ...oneTimeShellAllowlist,
                            ]),
                        };
                    }
                    const result = await commandToExecute.action(fullCommandContext, args);
                    if (result) {
                        switch (result.type) {
                            case 'tool':
                                return {
                                    type: 'schedule_tool',
                                    toolName: result.toolName,
                                    toolArgs: result.toolArgs,
                                };
                            case 'message':
                                addItem({
                                    type: result.messageType === 'error'
                                        ? MessageType.ERROR
                                        : MessageType.INFO,
                                    text: result.content,
                                }, Date.now());
                                return { type: 'handled' };
                            case 'dialog':
                                switch (result.dialog) {
                                    case 'auth':
                                        actions.openAuthDialog();
                                        return { type: 'handled' };
                                    case 'theme':
                                        actions.openThemeDialog();
                                        return { type: 'handled' };
                                    case 'editor':
                                        actions.openEditorDialog();
                                        return { type: 'handled' };
                                    case 'privacy':
                                        actions.openPrivacyNotice();
                                        return { type: 'handled' };
                                    case 'settings':
                                        actions.openSettingsDialog();
                                        return { type: 'handled' };
                                    case 'model':
                                        actions.openModelDialog();
                                        return { type: 'handled' };
                                    case 'permissions':
                                        actions.openPermissionsDialog();
                                        return { type: 'handled' };
                                    case 'help':
                                        return { type: 'handled' };
                                    default: {
                                        const unhandled = result.dialog;
                                        throw new Error(`Unhandled slash command result: ${unhandled}`);
                                    }
                                }
                            case 'load_history': {
                                config?.getGeminiClient()?.setHistory(result.clientHistory);
                                config?.getGeminiClient()?.stripThoughtsFromHistory();
                                fullCommandContext.ui.clear();
                                result.history.forEach((item, index) => {
                                    fullCommandContext.ui.addItem(item, index);
                                });
                                return { type: 'handled' };
                            }
                            case 'quit':
                                actions.quit(result.messages);
                                return { type: 'handled' };
                            case 'submit_prompt':
                                return {
                                    type: 'submit_prompt',
                                    content: result.content,
                                };
                            case 'confirm_shell_commands': {
                                const { outcome, approvedCommands } = await new Promise((resolve) => {
                                    setShellConfirmationRequest({
                                        commands: result.commandsToConfirm,
                                        onConfirm: (resolvedOutcome, resolvedApprovedCommands) => {
                                            setShellConfirmationRequest(null); // Close the dialog
                                            resolve({
                                                outcome: resolvedOutcome,
                                                approvedCommands: resolvedApprovedCommands,
                                            });
                                        },
                                    });
                                });
                                if (outcome === ToolConfirmationOutcome.Cancel ||
                                    !approvedCommands ||
                                    approvedCommands.length === 0) {
                                    return { type: 'handled' };
                                }
                                if (outcome === ToolConfirmationOutcome.ProceedAlways) {
                                    setSessionShellAllowlist((prev) => new Set([...prev, ...approvedCommands]));
                                }
                                return await handleSlashCommand(result.originalInvocation.raw, 
                                // Pass the approved commands as a one-time grant for this execution.
                                new Set(approvedCommands));
                            }
                            case 'confirm_action': {
                                const { confirmed } = await new Promise((resolve) => {
                                    setConfirmationRequest({
                                        prompt: result.prompt,
                                        onConfirm: (resolvedConfirmed) => {
                                            setConfirmationRequest(null);
                                            resolve({ confirmed: resolvedConfirmed });
                                        },
                                    });
                                });
                                if (!confirmed) {
                                    addItem({
                                        type: MessageType.INFO,
                                        text: 'Operation cancelled.',
                                    }, Date.now());
                                    return { type: 'handled' };
                                }
                                return await handleSlashCommand(result.originalInvocation.raw, undefined, true);
                            }
                            default: {
                                const unhandled = result;
                                throw new Error(`Unhandled slash command result: ${unhandled}`);
                            }
                        }
                    }
                    return { type: 'handled' };
                }
                else if (commandToExecute.subCommands) {
                    const helpText = `Command '/${commandToExecute.name}' requires a subcommand. Available:\n${commandToExecute.subCommands
                        .map((sc) => `  - ${sc.name}: ${sc.description || ''}`)
                        .join('\n')}`;
                    addMessage({
                        type: MessageType.INFO,
                        content: helpText,
                        timestamp: new Date(),
                    });
                    return { type: 'handled' };
                }
            }
            addMessage({
                type: MessageType.ERROR,
                content: `Unknown command: ${trimmed}`,
                timestamp: new Date(),
            });
            return { type: 'handled' };
        }
        catch (e) {
            hasError = true;
            if (config) {
                const event = makeSlashCommandEvent({
                    command: resolvedCommandPath[0],
                    subcommand,
                    status: SlashCommandStatus.ERROR,
                });
                logSlashCommand(config, event);
            }
            addItem({
                type: MessageType.ERROR,
                text: e instanceof Error ? e.message : String(e),
            }, Date.now());
            return { type: 'handled' };
        }
        finally {
            if (config && resolvedCommandPath[0] && !hasError) {
                const event = makeSlashCommandEvent({
                    command: resolvedCommandPath[0],
                    subcommand,
                    status: SlashCommandStatus.SUCCESS,
                });
                logSlashCommand(config, event);
            }
            setIsProcessing(false);
        }
    }, [
        config,
        addItem,
        actions,
        commands,
        commandContext,
        addMessage,
        setShellConfirmationRequest,
        setSessionShellAllowlist,
        setIsProcessing,
        setConfirmationRequest,
    ]);
    return {
        handleSlashCommand,
        slashCommands: commands,
        pendingHistoryItems,
        commandContext,
        shellConfirmationRequest,
        confirmationRequest,
    };
};
//# sourceMappingURL=slashCommandProcessor.js.map