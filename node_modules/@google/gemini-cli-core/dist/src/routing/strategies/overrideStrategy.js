/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { DEFAULT_GEMINI_MODEL_AUTO } from '../../config/models.js';
/**
 * Handles cases where the user explicitly specifies a model (override).
 */
export class OverrideStrategy {
    name = 'override';
    async route(_context, config, _baseLlmClient) {
        const overrideModel = config.getModel();
        // If the model is 'auto' we should pass to the next strategy.
        if (overrideModel === DEFAULT_GEMINI_MODEL_AUTO)
            return null;
        // Return the overridden model name.
        return {
            model: overrideModel,
            metadata: {
                source: this.name,
                latencyMs: 0,
                reasoning: `Routing bypassed by forced model directive. Using: ${overrideModel}`,
            },
        };
    }
}
//# sourceMappingURL=overrideStrategy.js.map