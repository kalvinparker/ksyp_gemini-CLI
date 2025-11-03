/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {} from '@google/genai';
import { PolicyDecision, } from './types.js';
import { stableStringify } from './stable-stringify.js';
function ruleMatches(rule, toolCall, stringifiedArgs) {
    // Check tool name if specified
    if (rule.toolName) {
        // Support wildcard patterns: "serverName__*" matches "serverName__anyTool"
        if (rule.toolName.endsWith('__*')) {
            const prefix = rule.toolName.slice(0, -3); // Remove "__*"
            if (!toolCall.name || !toolCall.name.startsWith(prefix + '__')) {
                return false;
            }
        }
        else if (toolCall.name !== rule.toolName) {
            return false;
        }
    }
    // Check args pattern if specified
    if (rule.argsPattern) {
        // If rule has an args pattern but tool has no args, no match
        if (!toolCall.args) {
            return false;
        }
        // Use stable JSON stringification with sorted keys to ensure consistent matching
        if (stringifiedArgs === undefined ||
            !rule.argsPattern.test(stringifiedArgs)) {
            return false;
        }
    }
    return true;
}
export class PolicyEngine {
    rules;
    defaultDecision;
    nonInteractive;
    constructor(config = {}) {
        this.rules = (config.rules ?? []).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        this.defaultDecision = config.defaultDecision ?? PolicyDecision.ASK_USER;
        this.nonInteractive = config.nonInteractive ?? false;
    }
    /**
     * Check if a tool call is allowed based on the configured policies.
     */
    check(toolCall) {
        let stringifiedArgs;
        // Compute stringified args once before the loop
        if (toolCall.args && this.rules.some((rule) => rule.argsPattern)) {
            stringifiedArgs = stableStringify(toolCall.args);
        }
        // Find the first matching rule (already sorted by priority)
        for (const rule of this.rules) {
            if (ruleMatches(rule, toolCall, stringifiedArgs)) {
                return this.applyNonInteractiveMode(rule.decision);
            }
        }
        // No matching rule found, use default decision
        return this.applyNonInteractiveMode(this.defaultDecision);
    }
    /**
     * Add a new rule to the policy engine.
     */
    addRule(rule) {
        this.rules.push(rule);
        // Re-sort rules by priority
        this.rules.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    }
    /**
     * Remove rules for a specific tool.
     */
    removeRulesForTool(toolName) {
        this.rules = this.rules.filter((rule) => rule.toolName !== toolName);
    }
    /**
     * Get all current rules.
     */
    getRules() {
        return this.rules;
    }
    applyNonInteractiveMode(decision) {
        // In non-interactive mode, ASK_USER becomes DENY
        if (this.nonInteractive && decision === PolicyDecision.ASK_USER) {
            return PolicyDecision.DENY;
        }
        return decision;
    }
}
//# sourceMappingURL=policy-engine.js.map