/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Config } from '../config/config.js';
import type { ToolInvocation, ToolResult, ToolCallConfirmationDetails } from './tools.js';
import { BaseDeclarativeTool, BaseToolInvocation } from './tools.js';
import type { ShellExecutionConfig } from '../services/shellExecutionService.js';
import type { AnsiOutput } from '../utils/terminalSerializer.js';
export declare const OUTPUT_UPDATE_INTERVAL_MS = 1000;
export interface ShellToolParams {
    command: string;
    description?: string;
    directory?: string;
}
export declare class ShellToolInvocation extends BaseToolInvocation<ShellToolParams, ToolResult> {
    private readonly config;
    private readonly allowlist;
    constructor(config: Config, params: ShellToolParams, allowlist: Set<string>);
    getDescription(): string;
    shouldConfirmExecute(_abortSignal: AbortSignal): Promise<ToolCallConfirmationDetails | false>;
    execute(signal: AbortSignal, updateOutput?: (output: string | AnsiOutput) => void, shellExecutionConfig?: ShellExecutionConfig, setPidCallback?: (pid: number) => void): Promise<ToolResult>;
}
export declare class ShellTool extends BaseDeclarativeTool<ShellToolParams, ToolResult> {
    private readonly config;
    static Name: string;
    private allowlist;
    constructor(config: Config);
    protected validateToolParamValues(params: ShellToolParams): string | null;
    protected createInvocation(params: ShellToolParams): ToolInvocation<ShellToolParams, ToolResult>;
}
