/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type FunctionCall } from '@google/genai';
import { PolicyDecision, type PolicyEngineConfig, type PolicyRule } from './types.js';
export declare class PolicyEngine {
    private rules;
    private readonly defaultDecision;
    private readonly nonInteractive;
    constructor(config?: PolicyEngineConfig);
    /**
     * Check if a tool call is allowed based on the configured policies.
     */
    check(toolCall: FunctionCall): PolicyDecision;
    /**
     * Add a new rule to the policy engine.
     */
    addRule(rule: PolicyRule): void;
    /**
     * Remove rules for a specific tool.
     */
    removeRulesForTool(toolName: string): void;
    /**
     * Get all current rules.
     */
    getRules(): readonly PolicyRule[];
    private applyNonInteractiveMode;
}
