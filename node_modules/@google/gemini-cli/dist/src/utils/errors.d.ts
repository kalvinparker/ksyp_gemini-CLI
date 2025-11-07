/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Config } from '@google/gemini-cli-core';
export declare function getErrorMessage(error: unknown): string;
/**
 * Handles errors consistently for both JSON and text output formats.
 * In JSON mode, outputs formatted JSON error and exits.
 * In text mode, outputs error message and re-throws.
 */
export declare function handleError(error: unknown, config: Config, customErrorCode?: string | number): never;
/**
 * Handles tool execution errors specifically.
 * In JSON mode, outputs formatted JSON error and exits.
 * In text mode, outputs error message to stderr only.
 */
export declare function handleToolError(toolName: string, toolError: Error, config: Config, errorCode?: string | number, resultDisplay?: string): void;
/**
 * Handles cancellation/abort signals consistently.
 */
export declare function handleCancellationError(config: Config): never;
/**
 * Handles max session turns exceeded consistently.
 */
export declare function handleMaxTurnsExceededError(config: Config): never;
