import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { MaxSizedBox } from './shared/MaxSizedBox.js';
export const DetailedMessagesDisplay = ({ messages, maxHeight, width }) => {
    if (messages.length === 0) {
        return null; // Don't render anything if there are no messages
    }
    const borderAndPadding = 4;
    return (_jsxs(Box, { flexDirection: "column", marginTop: 1, borderStyle: "round", borderColor: theme.border.default, paddingX: 1, width: width, children: [_jsx(Box, { marginBottom: 1, children: _jsxs(Text, { bold: true, color: theme.text.primary, children: ["Debug Console", ' ', _jsx(Text, { color: theme.text.secondary, children: "(ctrl+o to close)" })] }) }), _jsx(MaxSizedBox, { maxHeight: maxHeight, maxWidth: width - borderAndPadding, children: messages.map((msg, index) => {
                    let textColor = theme.text.primary;
                    let icon = '\u2139'; // Information source (ℹ)
                    switch (msg.type) {
                        case 'warn':
                            textColor = theme.status.warning;
                            icon = '\u26A0'; // Warning sign (⚠)
                            break;
                        case 'error':
                            textColor = theme.status.error;
                            icon = '\u2716'; // Heavy multiplication x (✖)
                            break;
                        case 'debug':
                            textColor = theme.text.secondary; // Or theme.text.secondary
                            icon = '\u{1F50D}'; // Left-pointing magnifying glass (🔍)
                            break;
                        case 'log':
                        default:
                            // Default textColor and icon are already set
                            break;
                    }
                    return (_jsxs(Box, { flexDirection: "row", children: [_jsxs(Text, { color: textColor, children: [icon, " "] }), _jsxs(Text, { color: textColor, wrap: "wrap", children: [msg.content, msg.count && msg.count > 1 && (_jsxs(Text, { color: theme.text.secondary, children: [" (x", msg.count, ")"] }))] })] }, index));
                }) })] }));
};
//# sourceMappingURL=DetailedMessagesDisplay.js.map