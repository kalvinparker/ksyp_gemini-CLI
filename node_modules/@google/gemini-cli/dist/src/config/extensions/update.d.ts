/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ExtensionUpdateAction, ExtensionUpdateState, type ExtensionUpdateStatus } from '../../ui/state/extensions.js';
import type { GeminiCLIExtension } from '@google/gemini-cli-core';
export interface ExtensionUpdateInfo {
    name: string;
    originalVersion: string;
    updatedVersion: string;
}
export declare function updateExtension(extension: GeminiCLIExtension, cwd: string | undefined, requestConsent: (consent: string) => Promise<boolean>, currentState: ExtensionUpdateState, dispatchExtensionStateUpdate: (action: ExtensionUpdateAction) => void): Promise<ExtensionUpdateInfo | undefined>;
export declare function updateAllUpdatableExtensions(cwd: string | undefined, requestConsent: (consent: string) => Promise<boolean>, extensions: GeminiCLIExtension[], extensionsState: Map<string, ExtensionUpdateStatus>, dispatch: (action: ExtensionUpdateAction) => void): Promise<ExtensionUpdateInfo[]>;
export interface ExtensionUpdateCheckResult {
    state: ExtensionUpdateState;
    error?: string;
}
export declare function checkForAllExtensionUpdates(extensions: GeminiCLIExtension[], dispatch: (action: ExtensionUpdateAction) => void): Promise<void>;
