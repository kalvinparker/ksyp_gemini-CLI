import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from 'react';
import { appEvents } from './../../utils/events.js';
import { Box, Text } from 'ink';
import { useConfig } from '../contexts/ConfigContext.js';
import { MCPServerStatus } from '@google/gemini-cli-core';
import { GeminiSpinner } from './GeminiRespondingSpinner.js';
import { theme } from '../semantic-colors.js';
export const ConfigInitDisplay = () => {
    const config = useConfig();
    const [message, setMessage] = useState('Initializing...');
    useEffect(() => {
        const onChange = (clients) => {
            if (!clients || clients.size === 0) {
                setMessage(`Initializing...`);
                return;
            }
            let connected = 0;
            for (const client of clients.values()) {
                if (client.getStatus() === MCPServerStatus.CONNECTED) {
                    connected++;
                }
            }
            setMessage(`Connecting to MCP servers... (${connected}/${clients.size})`);
        };
        appEvents.on('mcp-client-update', onChange);
        return () => {
            appEvents.off('mcp-client-update', onChange);
        };
    }, [config]);
    return (_jsx(Box, { marginTop: 1, children: _jsxs(Text, { children: [_jsx(GeminiSpinner, {}), " ", _jsx(Text, { color: theme.text.primary, children: message })] }) }));
};
//# sourceMappingURL=ConfigInitDisplay.js.map