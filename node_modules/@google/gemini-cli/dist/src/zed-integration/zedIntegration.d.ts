/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Config } from '@google/gemini-cli-core';
import type { LoadedSettings } from '../config/settings.js';
import { type Extension } from '../config/extension.js';
import type { CliArgs } from '../config/config.js';
/**
 * Resolves the model to use based on the current configuration.
 *
 * If the model is set to "auto", it will use the flash model if in fallback
 * mode, otherwise it will use the default model.
 */
export declare function resolveModel(model: string, isInFallbackMode: boolean): string;
export declare function runZedIntegration(config: Config, settings: LoadedSettings, extensions: Extension[], argv: CliArgs): Promise<void>;
