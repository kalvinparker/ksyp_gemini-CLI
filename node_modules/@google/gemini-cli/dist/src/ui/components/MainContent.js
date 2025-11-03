import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Box, Static } from 'ink';
import { HistoryItemDisplay } from './HistoryItemDisplay.js';
import { ShowMoreLines } from './ShowMoreLines.js';
import { OverflowProvider } from '../contexts/OverflowContext.js';
import { useUIState } from '../contexts/UIStateContext.js';
import { useAppContext } from '../contexts/AppContext.js';
import { AppHeader } from './AppHeader.js';
// Limit Gemini messages to a very high number of lines to mitigate performance
// issues in the worst case if we somehow get an enormous response from Gemini.
// This threshold is arbitrary but should be high enough to never impact normal
// usage.
const MAX_GEMINI_MESSAGE_LINES = 65536;
export const MainContent = () => {
    const { version } = useAppContext();
    const uiState = useUIState();
    const { pendingHistoryItems, mainAreaWidth, staticAreaMaxItemHeight, availableTerminalHeight, } = uiState;
    return (_jsxs(_Fragment, { children: [_jsx(Static, { items: [
                    _jsx(AppHeader, { version: version }, "app-header"),
                    ...uiState.history.map((h) => (_jsx(HistoryItemDisplay, { terminalWidth: mainAreaWidth, availableTerminalHeight: staticAreaMaxItemHeight, availableTerminalHeightGemini: MAX_GEMINI_MESSAGE_LINES, item: h, isPending: false, commands: uiState.slashCommands }, h.id))),
                ], children: (item) => item }, uiState.historyRemountKey), _jsx(OverflowProvider, { children: _jsxs(Box, { flexDirection: "column", children: [pendingHistoryItems.map((item, i) => (_jsx(HistoryItemDisplay, { availableTerminalHeight: uiState.constrainHeight ? availableTerminalHeight : undefined, terminalWidth: mainAreaWidth, item: { ...item, id: 0 }, isPending: true, isFocused: !uiState.isEditorDialogOpen, activeShellPtyId: uiState.activePtyId, embeddedShellFocused: uiState.embeddedShellFocused }, i))), _jsx(ShowMoreLines, { constrainHeight: uiState.constrainHeight })] }) })] }));
};
//# sourceMappingURL=MainContent.js.map