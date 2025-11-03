/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import type { LoadedSettings } from '../../config/settings.js';
import { type Config } from '@google/gemini-cli-core';
import { AuthState } from '../types.js';
interface AuthDialogProps {
    config: Config;
    settings: LoadedSettings;
    setAuthState: (state: AuthState) => void;
    authError: string | null;
    onAuthError: (error: string) => void;
}
export declare function AuthDialog({ config, settings, setAuthState, authError, onAuthError, }: AuthDialogProps): React.JSX.Element;
export {};
