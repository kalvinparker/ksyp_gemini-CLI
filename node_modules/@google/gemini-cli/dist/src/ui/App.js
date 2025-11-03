import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { useIsScreenReaderEnabled } from 'ink';
import { useTerminalSize } from './hooks/useTerminalSize.js';
import { lerp } from '../utils/math.js';
import { useUIState } from './contexts/UIStateContext.js';
import { StreamingContext } from './contexts/StreamingContext.js';
import { QuittingDisplay } from './components/QuittingDisplay.js';
import { ScreenReaderAppLayout } from './layouts/ScreenReaderAppLayout.js';
import { DefaultAppLayout } from './layouts/DefaultAppLayout.js';
const getContainerWidth = (terminalWidth) => {
    if (terminalWidth <= 80) {
        return '98%';
    }
    if (terminalWidth >= 132) {
        return '90%';
    }
    // Linearly interpolate between 80 columns (98%) and 132 columns (90%).
    const t = (terminalWidth - 80) / (132 - 80);
    const percentage = lerp(98, 90, t);
    return `${Math.round(percentage)}%`;
};
export const App = () => {
    const uiState = useUIState();
    const isScreenReaderEnabled = useIsScreenReaderEnabled();
    const { columns } = useTerminalSize();
    const containerWidth = getContainerWidth(columns);
    if (uiState.quittingMessages) {
        return _jsx(QuittingDisplay, {});
    }
    return (_jsx(StreamingContext.Provider, { value: uiState.streamingState, children: isScreenReaderEnabled ? (_jsx(ScreenReaderAppLayout, {})) : (_jsx(DefaultAppLayout, { width: containerWidth })) }));
};
//# sourceMappingURL=App.js.map