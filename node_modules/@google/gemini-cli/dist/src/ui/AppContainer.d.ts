/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Config } from '@google/gemini-cli-core';
import { type LoadedSettings } from '../config/settings.js';
import { type InitializationResult } from '../core/initializer.js';
interface AppContainerProps {
    config: Config;
    settings: LoadedSettings;
    startupWarnings?: string[];
    version: string;
    initializationResult: InitializationResult;
}
export declare const AppContainer: (props: AppContainerProps) => import("react/jsx-runtime").JSX.Element;
export {};
