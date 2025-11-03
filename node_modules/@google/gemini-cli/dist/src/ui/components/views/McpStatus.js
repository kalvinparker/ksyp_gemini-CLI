import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MCPServerStatus } from '@google/gemini-cli-core';
import { Box, Text } from 'ink';
import { theme } from '../../semantic-colors.js';
export const McpStatus = ({ servers, tools, prompts, blockedServers, serverStatus, authStatus, discoveryInProgress, connectingServers, showDescriptions, showSchema, showTips, }) => {
    const serverNames = Object.keys(servers);
    if (serverNames.length === 0 && blockedServers.length === 0) {
        return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Text, { children: "No MCP servers configured." }), _jsxs(Text, { children: ["Please view MCP documentation in your browser:", ' ', _jsx(Text, { color: theme.text.link, children: "https://goo.gle/gemini-cli-docs-mcp" }), ' ', "or use the cli /docs command"] })] }));
    }
    return (_jsxs(Box, { flexDirection: "column", children: [discoveryInProgress && (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsxs(Text, { color: theme.status.warning, children: ["\u23F3 MCP servers are starting up (", connectingServers.length, ' ', "initializing)..."] }), _jsx(Text, { color: theme.text.primary, children: "Note: First startup may take longer. Tool availability will update automatically." })] })), _jsx(Text, { bold: true, children: "Configured MCP servers:" }), _jsx(Box, { height: 1 }), serverNames.map((serverName) => {
                const server = servers[serverName];
                const serverTools = tools.filter((tool) => tool.serverName === serverName);
                const serverPrompts = prompts.filter((prompt) => prompt.serverName === serverName);
                const originalStatus = serverStatus(serverName);
                const hasCachedItems = serverTools.length > 0 || serverPrompts.length > 0;
                const status = originalStatus === MCPServerStatus.DISCONNECTED && hasCachedItems
                    ? MCPServerStatus.CONNECTED
                    : originalStatus;
                let statusIndicator = '';
                let statusText = '';
                let statusColor = theme.text.primary;
                switch (status) {
                    case MCPServerStatus.CONNECTED:
                        statusIndicator = '🟢';
                        statusText = 'Ready';
                        statusColor = theme.status.success;
                        break;
                    case MCPServerStatus.CONNECTING:
                        statusIndicator = '🔄';
                        statusText = 'Starting... (first startup may take longer)';
                        statusColor = theme.status.warning;
                        break;
                    case MCPServerStatus.DISCONNECTED:
                    default:
                        statusIndicator = '🔴';
                        statusText = 'Disconnected';
                        statusColor = theme.status.error;
                        break;
                }
                let serverDisplayName = serverName;
                if (server.extensionName) {
                    serverDisplayName += ` (from ${server.extensionName})`;
                }
                const toolCount = serverTools.length;
                const promptCount = serverPrompts.length;
                const parts = [];
                if (toolCount > 0) {
                    parts.push(`${toolCount} ${toolCount === 1 ? 'tool' : 'tools'}`);
                }
                if (promptCount > 0) {
                    parts.push(`${promptCount} ${promptCount === 1 ? 'prompt' : 'prompts'}`);
                }
                const serverAuthStatus = authStatus[serverName];
                let authStatusNode = null;
                if (serverAuthStatus === 'authenticated') {
                    authStatusNode = _jsx(Text, { children: " (OAuth)" });
                }
                else if (serverAuthStatus === 'expired') {
                    authStatusNode = (_jsx(Text, { color: theme.status.error, children: " (OAuth expired)" }));
                }
                else if (serverAuthStatus === 'unauthenticated') {
                    authStatusNode = (_jsx(Text, { color: theme.status.warning, children: " (OAuth not authenticated)" }));
                }
                return (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsxs(Box, { children: [_jsxs(Text, { color: statusColor, children: [statusIndicator, " "] }), _jsx(Text, { bold: true, children: serverDisplayName }), _jsxs(Text, { children: [' - ', statusText, status === MCPServerStatus.CONNECTED &&
                                            parts.length > 0 &&
                                            ` (${parts.join(', ')})`] }), authStatusNode] }), status === MCPServerStatus.CONNECTING && (_jsx(Text, { children: " (tools and prompts will appear when ready)" })), status === MCPServerStatus.DISCONNECTED && toolCount > 0 && (_jsxs(Text, { children: [" (", toolCount, " tools cached)"] })), showDescriptions && server?.description && (_jsx(Text, { color: theme.text.secondary, children: server.description.trim() })), serverTools.length > 0 && (_jsxs(Box, { flexDirection: "column", marginLeft: 2, children: [_jsx(Text, { color: theme.text.primary, children: "Tools:" }), serverTools.map((tool) => {
                                    const schemaContent = showSchema &&
                                        tool.schema &&
                                        (tool.schema.parametersJsonSchema || tool.schema.parameters)
                                        ? JSON.stringify(tool.schema.parametersJsonSchema ??
                                            tool.schema.parameters, null, 2)
                                        : null;
                                    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { children: ["- ", _jsx(Text, { color: theme.text.primary, children: tool.name })] }), showDescriptions && tool.description && (_jsx(Box, { marginLeft: 2, children: _jsx(Text, { color: theme.text.secondary, children: tool.description.trim() }) })), schemaContent && (_jsxs(Box, { flexDirection: "column", marginLeft: 4, children: [_jsx(Text, { color: theme.text.secondary, children: "Parameters:" }), _jsx(Text, { color: theme.text.secondary, children: schemaContent })] }))] }, tool.name));
                                })] })), serverPrompts.length > 0 && (_jsxs(Box, { flexDirection: "column", marginLeft: 2, children: [_jsx(Text, { color: theme.text.primary, children: "Prompts:" }), serverPrompts.map((prompt) => (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { children: ["- ", _jsx(Text, { color: theme.text.primary, children: prompt.name })] }), showDescriptions && prompt.description && (_jsx(Box, { marginLeft: 2, children: _jsx(Text, { color: theme.text.primary, children: prompt.description.trim() }) }))] }, prompt.name)))] }))] }, serverName));
            }), blockedServers.map((server) => (_jsxs(Box, { marginBottom: 1, children: [_jsx(Text, { color: theme.status.error, children: "\uD83D\uDD34 " }), _jsxs(Text, { bold: true, children: [server.name, server.extensionName ? ` (from ${server.extensionName})` : ''] }), _jsx(Text, { children: " - Blocked" })] }, server.name))), showTips && (_jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Text, { color: theme.text.accent, children: "\uD83D\uDCA1 Tips:" }), _jsxs(Text, { children: ['  ', "- Use ", _jsx(Text, { color: theme.text.accent, children: "/mcp desc" }), " to show server and tool descriptions"] }), _jsxs(Text, { children: ['  ', "- Use ", _jsx(Text, { color: theme.text.accent, children: "/mcp schema" }), " to show tool parameter schemas"] }), _jsxs(Text, { children: ['  ', "- Use ", _jsx(Text, { color: theme.text.accent, children: "/mcp nodesc" }), " to hide descriptions"] }), _jsxs(Text, { children: ['  ', "- Use", ' ', _jsx(Text, { color: theme.text.accent, children: "/mcp auth <server-name>" }), ' ', "to authenticate with OAuth-enabled servers"] }), _jsxs(Text, { children: ['  ', "- Press ", _jsx(Text, { color: theme.text.accent, children: "Ctrl+T" }), " to toggle tool descriptions on/off"] })] }))] }));
};
//# sourceMappingURL=McpStatus.js.map