/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type MCPServerConfig, type ExtensionInstallMetadata } from '@google/gemini-cli-core';
export declare function createExtension({ extensionsDir, name, version, addContextFile, contextFileName, mcpServers, installMetadata, }?: {
    extensionsDir?: string | undefined;
    name?: string | undefined;
    version?: string | undefined;
    addContextFile?: boolean | undefined;
    contextFileName?: string | undefined;
    mcpServers?: Record<string, MCPServerConfig> | undefined;
    installMetadata?: ExtensionInstallMetadata | undefined;
}): string;
