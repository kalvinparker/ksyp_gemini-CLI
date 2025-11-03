/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import type { IndividualToolCallDisplay } from '../../types.js';
import type { Config } from '@google/gemini-cli-core';
export type TextEmphasis = 'high' | 'medium' | 'low';
export interface ToolMessageProps extends IndividualToolCallDisplay {
    availableTerminalHeight?: number;
    terminalWidth: number;
    emphasis?: TextEmphasis;
    renderOutputAsMarkdown?: boolean;
    activeShellPtyId?: number | null;
    embeddedShellFocused?: boolean;
    config?: Config;
}
export declare const ToolMessage: React.FC<ToolMessageProps>;
