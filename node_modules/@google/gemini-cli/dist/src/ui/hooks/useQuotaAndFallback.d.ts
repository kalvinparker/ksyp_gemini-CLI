/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Config, UserTierId } from '@google/gemini-cli-core';
import { type UseHistoryManagerReturn } from './useHistoryManager.js';
import { AuthState } from '../types.js';
import { type ProQuotaDialogRequest } from '../contexts/UIStateContext.js';
interface UseQuotaAndFallbackArgs {
    config: Config;
    historyManager: UseHistoryManagerReturn;
    userTier: UserTierId | undefined;
    setAuthState: (state: AuthState) => void;
    setModelSwitchedFromQuotaError: (value: boolean) => void;
}
export declare function useQuotaAndFallback({ config, historyManager, userTier, setAuthState, setModelSwitchedFromQuotaError, }: UseQuotaAndFallbackArgs): {
    proQuotaRequest: ProQuotaDialogRequest | null;
    handleProQuotaChoice: (choice: "auth" | "continue") => void;
};
export {};
