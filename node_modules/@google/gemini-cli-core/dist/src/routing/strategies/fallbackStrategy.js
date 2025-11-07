/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { getEffectiveModel } from '../../config/models.js';
export class FallbackStrategy {
    name = 'fallback';
    async route(_context, config, _baseLlmClient) {
        const isInFallbackMode = config.isInFallbackMode();
        if (!isInFallbackMode) {
            return null;
        }
        const effectiveModel = getEffectiveModel(isInFallbackMode, config.getModel());
        return {
            model: effectiveModel,
            metadata: {
                source: this.name,
                latencyMs: 0,
                reasoning: `In fallback mode. Using: ${effectiveModel}`,
            },
        };
    }
}
//# sourceMappingURL=fallbackStrategy.js.map