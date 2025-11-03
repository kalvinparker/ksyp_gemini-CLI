/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Config } from '@google/gemini-cli-core';
import type { LoadedSettings } from './config/settings.js';
export declare function runNonInteractive(config: Config, settings: LoadedSettings, input: string, prompt_id: string): Promise<void>;
