/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { SlashCommand } from './types.js';
import type { Content } from '@google/genai';
export declare function serializeHistoryToMarkdown(history: Content[]): string;
export declare const chatCommand: SlashCommand;
