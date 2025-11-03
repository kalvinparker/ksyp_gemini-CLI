import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { RadioButtonSelect } from './shared/RadioButtonSelect.js';
import { theme } from '../semantic-colors.js';
export function ProQuotaDialog({ failedModel, fallbackModel, onChoice, }) {
    const items = [
        {
            label: 'Change auth (executes the /auth command)',
            value: 'auth',
            key: 'auth',
        },
        {
            label: `Continue with ${fallbackModel}`,
            value: 'continue',
            key: 'continue',
        },
    ];
    const handleSelect = (choice) => {
        onChoice(choice);
    };
    return (_jsxs(Box, { borderStyle: "round", flexDirection: "column", paddingX: 1, children: [_jsxs(Text, { bold: true, color: theme.status.warning, children: ["Pro quota limit reached for ", failedModel, "."] }), _jsx(Box, { marginTop: 1, children: _jsx(RadioButtonSelect, { items: items, initialIndex: 1, onSelect: handleSelect }) })] }));
}
//# sourceMappingURL=ProQuotaDialog.js.map