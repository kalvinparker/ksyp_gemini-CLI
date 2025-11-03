/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { render } from 'ink-testing-library';
import type React from 'react';
import { LoadedSettings } from '../config/settings.js';
export declare const renderWithProviders: (component: React.ReactElement, { shellFocus, settings }?: {
    shellFocus?: boolean | undefined;
    settings?: LoadedSettings | undefined;
}) => ReturnType<typeof render>;
