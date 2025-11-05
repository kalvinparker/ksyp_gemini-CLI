/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export type HighlightToken = {
    text: string;
    type: 'default' | 'command' | 'file';
};
export declare function parseInputForHighlighting(text: string, index: number): readonly HighlightToken[];
export declare function buildSegmentsForVisualSlice(tokens: readonly HighlightToken[], sliceStart: number, sliceEnd: number): readonly HighlightToken[];
