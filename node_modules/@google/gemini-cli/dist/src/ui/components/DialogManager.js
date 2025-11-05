import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Box, Text } from 'ink';
import { IdeIntegrationNudge } from '../IdeIntegrationNudge.js';
import { LoopDetectionConfirmation } from './LoopDetectionConfirmation.js';
import { FolderTrustDialog } from './FolderTrustDialog.js';
import { ShellConfirmationDialog } from './ShellConfirmationDialog.js';
import { ConsentPrompt } from './ConsentPrompt.js';
import { ThemeDialog } from './ThemeDialog.js';
import { SettingsDialog } from './SettingsDialog.js';
import { AuthInProgress } from '../auth/AuthInProgress.js';
import { AuthDialog } from '../auth/AuthDialog.js';
import { EditorSettingsDialog } from './EditorSettingsDialog.js';
import { PrivacyNotice } from '../privacy/PrivacyNotice.js';
import { WorkspaceMigrationDialog } from './WorkspaceMigrationDialog.js';
import { ProQuotaDialog } from './ProQuotaDialog.js';
import { PermissionsModifyTrustDialog } from './PermissionsModifyTrustDialog.js';
import { ModelDialog } from './ModelDialog.js';
import { theme } from '../semantic-colors.js';
import { useUIState } from '../contexts/UIStateContext.js';
import { useUIActions } from '../contexts/UIActionsContext.js';
import { useConfig } from '../contexts/ConfigContext.js';
import { useSettings } from '../contexts/SettingsContext.js';
import process from 'node:process';
import {} from '../hooks/useHistoryManager.js';
import { IdeTrustChangeDialog } from './IdeTrustChangeDialog.js';
// Props for DialogManager
export const DialogManager = ({ addItem, terminalWidth, }) => {
    const config = useConfig();
    const settings = useSettings();
    const uiState = useUIState();
    const uiActions = useUIActions();
    const { constrainHeight, terminalHeight, staticExtraHeight, mainAreaWidth } = uiState;
    if (uiState.showIdeRestartPrompt) {
        return _jsx(IdeTrustChangeDialog, { reason: uiState.ideTrustRestartReason });
    }
    if (uiState.showWorkspaceMigrationDialog) {
        return (_jsx(WorkspaceMigrationDialog, { workspaceExtensions: uiState.workspaceExtensions, onOpen: uiActions.onWorkspaceMigrationDialogOpen, onClose: uiActions.onWorkspaceMigrationDialogClose }));
    }
    if (uiState.proQuotaRequest) {
        return (_jsx(ProQuotaDialog, { failedModel: uiState.proQuotaRequest.failedModel, fallbackModel: uiState.proQuotaRequest.fallbackModel, onChoice: uiActions.handleProQuotaChoice }));
    }
    if (uiState.shouldShowIdePrompt) {
        return (_jsx(IdeIntegrationNudge, { ide: uiState.currentIDE, onComplete: uiActions.handleIdePromptComplete }));
    }
    if (uiState.isFolderTrustDialogOpen) {
        return (_jsx(FolderTrustDialog, { onSelect: uiActions.handleFolderTrustSelect, isRestarting: uiState.isRestarting }));
    }
    if (uiState.shellConfirmationRequest) {
        return (_jsx(ShellConfirmationDialog, { request: uiState.shellConfirmationRequest }));
    }
    if (uiState.loopDetectionConfirmationRequest) {
        return (_jsx(LoopDetectionConfirmation, { onComplete: uiState.loopDetectionConfirmationRequest.onComplete }));
    }
    if (uiState.confirmationRequest) {
        return (_jsx(ConsentPrompt, { prompt: uiState.confirmationRequest.prompt, onConfirm: uiState.confirmationRequest.onConfirm, terminalWidth: terminalWidth }));
    }
    if (uiState.confirmUpdateExtensionRequests.length > 0) {
        const request = uiState.confirmUpdateExtensionRequests[0];
        return (_jsx(ConsentPrompt, { prompt: request.prompt, onConfirm: request.onConfirm, terminalWidth: terminalWidth }));
    }
    if (uiState.isThemeDialogOpen) {
        return (_jsxs(Box, { flexDirection: "column", children: [uiState.themeError && (_jsx(Box, { marginBottom: 1, children: _jsx(Text, { color: theme.status.error, children: uiState.themeError }) })), _jsx(ThemeDialog, { onSelect: uiActions.handleThemeSelect, onHighlight: uiActions.handleThemeHighlight, settings: settings, availableTerminalHeight: constrainHeight ? terminalHeight - staticExtraHeight : undefined, terminalWidth: mainAreaWidth })] }));
    }
    if (uiState.isSettingsDialogOpen) {
        return (_jsx(Box, { flexDirection: "column", children: _jsx(SettingsDialog, { settings: settings, onSelect: () => uiActions.closeSettingsDialog(), onRestartRequest: () => process.exit(0), availableTerminalHeight: terminalHeight - staticExtraHeight }) }));
    }
    if (uiState.isModelDialogOpen) {
        return _jsx(ModelDialog, { onClose: uiActions.closeModelDialog });
    }
    if (uiState.isAuthenticating) {
        return (_jsx(AuthInProgress, { onTimeout: () => {
                uiActions.onAuthError('Authentication cancelled.');
            } }));
    }
    if (uiState.isAuthDialogOpen) {
        return (_jsx(Box, { flexDirection: "column", children: _jsx(AuthDialog, { config: config, settings: settings, setAuthState: uiActions.setAuthState, authError: uiState.authError, onAuthError: uiActions.onAuthError }) }));
    }
    if (uiState.isEditorDialogOpen) {
        return (_jsxs(Box, { flexDirection: "column", children: [uiState.editorError && (_jsx(Box, { marginBottom: 1, children: _jsx(Text, { color: theme.status.error, children: uiState.editorError }) })), _jsx(EditorSettingsDialog, { onSelect: uiActions.handleEditorSelect, settings: settings, onExit: uiActions.exitEditorDialog })] }));
    }
    if (uiState.showPrivacyNotice) {
        return (_jsx(PrivacyNotice, { onExit: () => uiActions.exitPrivacyNotice(), config: config }));
    }
    if (uiState.isPermissionsDialogOpen) {
        return (_jsx(PermissionsModifyTrustDialog, { onExit: uiActions.closePermissionsDialog, addItem: addItem }));
    }
    return null;
};
//# sourceMappingURL=DialogManager.js.map