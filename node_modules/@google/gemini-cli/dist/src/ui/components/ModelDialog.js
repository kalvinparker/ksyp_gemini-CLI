import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useContext, useMemo } from 'react';
import { Box, Text } from 'ink';
import { DEFAULT_GEMINI_FLASH_LITE_MODEL, DEFAULT_GEMINI_FLASH_MODEL, DEFAULT_GEMINI_MODEL, DEFAULT_GEMINI_MODEL_AUTO, ModelSlashCommandEvent, logModelSlashCommand, } from '@google/gemini-cli-core';
import { useKeypress } from '../hooks/useKeypress.js';
import { theme } from '../semantic-colors.js';
import { DescriptiveRadioButtonSelect } from './shared/DescriptiveRadioButtonSelect.js';
import { ConfigContext } from '../contexts/ConfigContext.js';
const MODEL_OPTIONS = [
    {
        value: DEFAULT_GEMINI_MODEL_AUTO,
        title: 'Auto (recommended)',
        description: 'Let the system choose the best model for your task',
        key: DEFAULT_GEMINI_MODEL_AUTO,
    },
    {
        value: DEFAULT_GEMINI_MODEL,
        title: 'Pro',
        description: 'For complex tasks that require deep reasoning and creativity',
        key: DEFAULT_GEMINI_MODEL,
    },
    {
        value: DEFAULT_GEMINI_FLASH_MODEL,
        title: 'Flash',
        description: 'For tasks that need a balance of speed and reasoning',
        key: DEFAULT_GEMINI_FLASH_MODEL,
    },
    {
        value: DEFAULT_GEMINI_FLASH_LITE_MODEL,
        title: 'Flash-Lite',
        description: 'For simple tasks that need to be done quickly',
        key: DEFAULT_GEMINI_FLASH_LITE_MODEL,
    },
];
export function ModelDialog({ onClose }) {
    const config = useContext(ConfigContext);
    // Determine the Preferred Model (read once when the dialog opens).
    const preferredModel = config?.getModel() || DEFAULT_GEMINI_MODEL_AUTO;
    useKeypress((key) => {
        if (key.name === 'escape') {
            onClose();
        }
    }, { isActive: true });
    // Calculate the initial index based on the preferred model.
    const initialIndex = useMemo(() => MODEL_OPTIONS.findIndex((option) => option.value === preferredModel), [preferredModel]);
    // Handle selection internally (Autonomous Dialog).
    const handleSelect = useCallback((model) => {
        if (config) {
            config.setModel(model);
            const event = new ModelSlashCommandEvent(model);
            logModelSlashCommand(config, event);
        }
        onClose();
    }, [config, onClose]);
    return (_jsxs(Box, { borderStyle: "round", borderColor: theme.border.default, flexDirection: "column", padding: 1, width: "100%", children: [_jsx(Text, { bold: true, children: "Select Model" }), _jsx(Box, { marginTop: 1, children: _jsx(DescriptiveRadioButtonSelect, { items: MODEL_OPTIONS, onSelect: handleSelect, initialIndex: initialIndex, showNumbers: true }) }), _jsx(Box, { flexDirection: "column", children: _jsx(Text, { color: theme.text.secondary, children: '> To use a specific Gemini model, use the --model flag.' }) }), _jsx(Box, { marginTop: 1, flexDirection: "column", children: _jsx(Text, { color: theme.text.secondary, children: "(Press Esc to close)" }) })] }));
}
//# sourceMappingURL=ModelDialog.js.map