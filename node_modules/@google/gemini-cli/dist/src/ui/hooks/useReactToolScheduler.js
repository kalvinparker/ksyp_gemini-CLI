/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CoreToolScheduler } from '@google/gemini-cli-core';
import { useCallback, useState, useMemo } from 'react';
import { ToolCallStatus } from '../types.js';
export function useReactToolScheduler(onComplete, config, getPreferredEditor, onEditorClose) {
    const [toolCallsForDisplay, setToolCallsForDisplay] = useState([]);
    const outputUpdateHandler = useCallback((toolCallId, outputChunk) => {
        setToolCallsForDisplay((prevCalls) => prevCalls.map((tc) => {
            if (tc.request.callId === toolCallId && tc.status === 'executing') {
                const executingTc = tc;
                return { ...executingTc, liveOutput: outputChunk };
            }
            return tc;
        }));
    }, []);
    const allToolCallsCompleteHandler = useCallback(async (completedToolCalls) => {
        await onComplete(completedToolCalls);
    }, [onComplete]);
    const toolCallsUpdateHandler = useCallback((updatedCoreToolCalls) => {
        setToolCallsForDisplay((prevTrackedCalls) => updatedCoreToolCalls.map((coreTc) => {
            const existingTrackedCall = prevTrackedCalls.find((ptc) => ptc.request.callId === coreTc.request.callId);
            // Start with the new core state, then layer on the existing UI state
            // to ensure UI-only properties like pid are preserved.
            const responseSubmittedToGemini = existingTrackedCall?.responseSubmittedToGemini ?? false;
            if (coreTc.status === 'executing') {
                return {
                    ...coreTc,
                    responseSubmittedToGemini,
                    liveOutput: existingTrackedCall
                        ?.liveOutput,
                    pid: coreTc.pid,
                };
            }
            // For other statuses, explicitly set liveOutput and pid to undefined
            // to ensure they are not carried over from a previous executing state.
            return {
                ...coreTc,
                responseSubmittedToGemini,
                liveOutput: undefined,
                pid: undefined,
            };
        }));
    }, [setToolCallsForDisplay]);
    const scheduler = useMemo(() => new CoreToolScheduler({
        outputUpdateHandler,
        onAllToolCallsComplete: allToolCallsCompleteHandler,
        onToolCallsUpdate: toolCallsUpdateHandler,
        getPreferredEditor,
        config,
        onEditorClose,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }), [
        config,
        outputUpdateHandler,
        allToolCallsCompleteHandler,
        toolCallsUpdateHandler,
        getPreferredEditor,
        onEditorClose,
    ]);
    const schedule = useCallback((request, signal) => {
        void scheduler.schedule(request, signal);
    }, [scheduler]);
    const markToolsAsSubmitted = useCallback((callIdsToMark) => {
        setToolCallsForDisplay((prevCalls) => prevCalls.map((tc) => callIdsToMark.includes(tc.request.callId)
            ? { ...tc, responseSubmittedToGemini: true }
            : tc));
    }, []);
    return [toolCallsForDisplay, schedule, markToolsAsSubmitted];
}
/**
 * Maps a CoreToolScheduler status to the UI's ToolCallStatus enum.
 */
function mapCoreStatusToDisplayStatus(coreStatus) {
    switch (coreStatus) {
        case 'validating':
            return ToolCallStatus.Executing;
        case 'awaiting_approval':
            return ToolCallStatus.Confirming;
        case 'executing':
            return ToolCallStatus.Executing;
        case 'success':
            return ToolCallStatus.Success;
        case 'cancelled':
            return ToolCallStatus.Canceled;
        case 'error':
            return ToolCallStatus.Error;
        case 'scheduled':
            return ToolCallStatus.Pending;
        default: {
            const exhaustiveCheck = coreStatus;
            console.warn(`Unknown core status encountered: ${exhaustiveCheck}`);
            return ToolCallStatus.Error;
        }
    }
}
/**
 * Transforms `TrackedToolCall` objects into `HistoryItemToolGroup` objects for UI display.
 */
export function mapToDisplay(toolOrTools) {
    const toolCalls = Array.isArray(toolOrTools) ? toolOrTools : [toolOrTools];
    const toolDisplays = toolCalls.map((trackedCall) => {
        let displayName;
        let description;
        let renderOutputAsMarkdown = false;
        if (trackedCall.status === 'error') {
            displayName =
                trackedCall.tool === undefined
                    ? trackedCall.request.name
                    : trackedCall.tool.displayName;
            description = JSON.stringify(trackedCall.request.args);
        }
        else {
            displayName = trackedCall.tool.displayName;
            description = trackedCall.invocation.getDescription();
            renderOutputAsMarkdown = trackedCall.tool.isOutputMarkdown;
        }
        const baseDisplayProperties = {
            callId: trackedCall.request.callId,
            name: displayName,
            description,
            renderOutputAsMarkdown,
        };
        switch (trackedCall.status) {
            case 'success':
                return {
                    ...baseDisplayProperties,
                    status: mapCoreStatusToDisplayStatus(trackedCall.status),
                    resultDisplay: trackedCall.response.resultDisplay,
                    confirmationDetails: undefined,
                    outputFile: trackedCall.response.outputFile,
                };
            case 'error':
                return {
                    ...baseDisplayProperties,
                    status: mapCoreStatusToDisplayStatus(trackedCall.status),
                    resultDisplay: trackedCall.response.resultDisplay,
                    confirmationDetails: undefined,
                };
            case 'cancelled':
                return {
                    ...baseDisplayProperties,
                    status: mapCoreStatusToDisplayStatus(trackedCall.status),
                    resultDisplay: trackedCall.response.resultDisplay,
                    confirmationDetails: undefined,
                };
            case 'awaiting_approval':
                return {
                    ...baseDisplayProperties,
                    status: mapCoreStatusToDisplayStatus(trackedCall.status),
                    resultDisplay: undefined,
                    confirmationDetails: trackedCall.confirmationDetails,
                };
            case 'executing':
                return {
                    ...baseDisplayProperties,
                    status: mapCoreStatusToDisplayStatus(trackedCall.status),
                    resultDisplay: trackedCall.liveOutput ?? undefined,
                    confirmationDetails: undefined,
                    ptyId: trackedCall.pid,
                };
            case 'validating': // Fallthrough
            case 'scheduled':
                return {
                    ...baseDisplayProperties,
                    status: mapCoreStatusToDisplayStatus(trackedCall.status),
                    resultDisplay: undefined,
                    confirmationDetails: undefined,
                };
            default: {
                const exhaustiveCheck = trackedCall;
                return {
                    callId: exhaustiveCheck.request.callId,
                    name: 'Unknown Tool',
                    description: 'Encountered an unknown tool call state.',
                    status: ToolCallStatus.Error,
                    resultDisplay: 'Unknown tool call state',
                    confirmationDetails: undefined,
                    renderOutputAsMarkdown: false,
                };
            }
        }
    });
    return {
        type: 'tool_group',
        tools: toolDisplays,
    };
}
//# sourceMappingURL=useReactToolScheduler.js.map