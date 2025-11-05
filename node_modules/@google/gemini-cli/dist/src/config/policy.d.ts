/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type PolicyEngineConfig, ApprovalMode } from '@google/gemini-cli-core';
import type { Settings } from './settings.js';
export declare function createPolicyEngineConfig(settings: Settings, approvalMode: ApprovalMode): PolicyEngineConfig;
