/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { GeminiCLIExtension } from '@google/gemini-cli-core';
import { ExtensionUpdateState } from '../state/extensions.js';
import type { UseHistoryManagerReturn } from './useHistoryManager.js';
import { type ConfirmationRequest } from '../types.js';
type ConfirmationRequestWrapper = {
    prompt: React.ReactNode;
    onConfirm: (confirmed: boolean) => void;
};
export declare const useExtensionUpdates: (extensions: GeminiCLIExtension[], addItem: UseHistoryManagerReturn["addItem"], cwd: string) => {
    extensionsUpdateState: Map<string, ExtensionUpdateState>;
    extensionsUpdateStateInternal: Map<string, import("../state/extensions.js").ExtensionUpdateStatus>;
    dispatchExtensionStateUpdate: import("react").ActionDispatch<[action: import("../state/extensions.js").ExtensionUpdateAction]>;
    confirmUpdateExtensionRequests: ConfirmationRequestWrapper[];
    addConfirmUpdateExtensionRequest: (original: ConfirmationRequest) => void;
};
export {};
