/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export interface GeminiIgnoreFilter {
    isIgnored(filePath: string): boolean;
    getPatterns(): string[];
}
export declare class GeminiIgnoreParser implements GeminiIgnoreFilter {
    private projectRoot;
    private patterns;
    private ig;
    constructor(projectRoot: string);
    private loadPatterns;
    isIgnored(filePath: string): boolean;
    getPatterns(): string[];
}
