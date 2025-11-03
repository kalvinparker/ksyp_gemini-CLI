import { jsx as _jsx } from "react/jsx-runtime";
import { Text } from 'ink';
const DEFAULT_HEIGHT = 24;
export const AnsiOutputText = ({ data, availableTerminalHeight, }) => {
    const lastLines = data.slice(-(availableTerminalHeight && availableTerminalHeight > 0
        ? availableTerminalHeight
        : DEFAULT_HEIGHT));
    return lastLines.map((line, lineIndex) => (_jsx(Text, { children: line.length > 0
            ? line.map((token, tokenIndex) => (_jsx(Text, { color: token.inverse ? token.bg : token.fg, backgroundColor: token.inverse ? token.fg : token.bg, dimColor: token.dim, bold: token.bold, italic: token.italic, underline: token.underline, children: token.text }, tokenIndex)))
            : null }, lineIndex)));
};
//# sourceMappingURL=AnsiOutput.js.map