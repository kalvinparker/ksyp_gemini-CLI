/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import type { TextBuffer } from './shared/text-buffer.js';
import type { Key } from '../hooks/useKeypress.js';
import type { CommandContext, SlashCommand } from '../commands/types.js';
import type { Config } from '@google/gemini-cli-core';
import { ApprovalMode } from '@google/gemini-cli-core';
export interface InputPromptProps {
    buffer: TextBuffer;
    onSubmit: (value: string) => void;
    userMessages: readonly string[];
    onClearScreen: () => void;
    config: Config;
    slashCommands: readonly SlashCommand[];
    commandContext: CommandContext;
    placeholder?: string;
    focus?: boolean;
    inputWidth: number;
    suggestionsWidth: number;
    shellModeActive: boolean;
    setShellModeActive: (value: boolean) => void;
    approvalMode: ApprovalMode;
    onEscapePromptChange?: (showPrompt: boolean) => void;
    vimHandleInput?: (key: Key) => boolean;
    isEmbeddedShellFocused?: boolean;
}
export declare const calculatePromptWidths: (terminalWidth: number) => {
    readonly inputWidth: number;
    readonly containerWidth: number;
    readonly suggestionsWidth: number;
    readonly frameOverhead: number;
};
export declare const InputPrompt: React.FC<InputPromptProps>;
