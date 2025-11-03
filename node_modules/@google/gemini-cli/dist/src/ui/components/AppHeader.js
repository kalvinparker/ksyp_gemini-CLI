import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Box } from 'ink';
import { Header } from './Header.js';
import { Tips } from './Tips.js';
import { useSettings } from '../contexts/SettingsContext.js';
import { useConfig } from '../contexts/ConfigContext.js';
import { useUIState } from '../contexts/UIStateContext.js';
export const AppHeader = ({ version }) => {
    const settings = useSettings();
    const config = useConfig();
    const { nightly } = useUIState();
    return (_jsxs(Box, { flexDirection: "column", children: [!(settings.merged.ui?.hideBanner || config.getScreenReader()) && (_jsx(Header, { version: version, nightly: nightly })), !(settings.merged.ui?.hideTips || config.getScreenReader()) && (_jsx(Tips, { config: config }))] }));
};
//# sourceMappingURL=AppHeader.js.map