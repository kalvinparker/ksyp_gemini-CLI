import { jsxs as _jsxs, Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { renderWithProviders } from '../../test-utils/render.js';
import { describe, it, expect, vi, beforeEach, afterEach, } from 'vitest';
import { AuthDialog } from './AuthDialog.js';
import { AuthType } from '@google/gemini-cli-core';
import { SettingScope } from '../../config/settings.js';
import { AuthState } from '../types.js';
import { RadioButtonSelect } from '../components/shared/RadioButtonSelect.js';
import { useKeypress } from '../hooks/useKeypress.js';
import { validateAuthMethodWithSettings } from './useAuth.js';
import { runExitCleanup } from '../../utils/cleanup.js';
import { clearCachedCredentialFile } from '@google/gemini-cli-core';
import { Text } from 'ink';
// Mocks
vi.mock('@google/gemini-cli-core', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        clearCachedCredentialFile: vi.fn(),
    };
});
vi.mock('../../utils/cleanup.js', () => ({
    runExitCleanup: vi.fn(),
}));
vi.mock('./useAuth.js', () => ({
    validateAuthMethodWithSettings: vi.fn(),
}));
vi.mock('../hooks/useKeypress.js', () => ({
    useKeypress: vi.fn(),
}));
vi.mock('../components/shared/RadioButtonSelect.js', () => ({
    RadioButtonSelect: vi.fn(({ items, initialIndex }) => (_jsx(_Fragment, { children: items.map((item, index) => (_jsxs(Text, { children: [index === initialIndex ? '(selected)' : '(not selected)', ' ', item.label] }, item.value))) }))),
}));
const mockedUseKeypress = useKeypress;
const mockedRadioButtonSelect = RadioButtonSelect;
const mockedValidateAuthMethod = validateAuthMethodWithSettings;
const mockedRunExitCleanup = runExitCleanup;
const mockedClearCachedCredentialFile = clearCachedCredentialFile;
describe('AuthDialog', () => {
    let props;
    const originalEnv = { ...process.env };
    beforeEach(() => {
        vi.resetAllMocks();
        process.env = {};
        props = {
            config: {
                isBrowserLaunchSuppressed: vi.fn().mockReturnValue(false),
            },
            settings: {
                merged: {
                    security: {
                        auth: {},
                    },
                },
                setValue: vi.fn(),
            },
            setAuthState: vi.fn(),
            authError: null,
            onAuthError: vi.fn(),
        };
    });
    afterEach(() => {
        process.env = originalEnv;
    });
    it('shows Cloud Shell option when in Cloud Shell environment', () => {
        process.env['CLOUD_SHELL'] = 'true';
        renderWithProviders(_jsx(AuthDialog, { ...props }));
        const items = mockedRadioButtonSelect.mock.calls[0][0].items;
        expect(items).toContainEqual({
            label: 'Use Cloud Shell user credentials',
            value: AuthType.CLOUD_SHELL,
            key: AuthType.CLOUD_SHELL,
        });
    });
    it('filters auth types when enforcedType is set', () => {
        props.settings.merged.security.auth.enforcedType = AuthType.USE_GEMINI;
        renderWithProviders(_jsx(AuthDialog, { ...props }));
        const items = mockedRadioButtonSelect.mock.calls[0][0].items;
        expect(items).toHaveLength(1);
        expect(items[0].value).toBe(AuthType.USE_GEMINI);
    });
    it('sets initial index to 0 when enforcedType is set', () => {
        props.settings.merged.security.auth.enforcedType = AuthType.USE_GEMINI;
        renderWithProviders(_jsx(AuthDialog, { ...props }));
        const { initialIndex } = mockedRadioButtonSelect.mock.calls[0][0];
        expect(initialIndex).toBe(0);
    });
    it('selects initial auth type from settings', () => {
        props.settings.merged.security.auth.selectedType = AuthType.USE_VERTEX_AI;
        renderWithProviders(_jsx(AuthDialog, { ...props }));
        const { items, initialIndex } = mockedRadioButtonSelect.mock.calls[0][0];
        expect(items[initialIndex].value).toBe(AuthType.USE_VERTEX_AI);
    });
    it('selects initial auth type from GEMINI_DEFAULT_AUTH_TYPE env var', () => {
        process.env['GEMINI_DEFAULT_AUTH_TYPE'] = AuthType.USE_GEMINI;
        renderWithProviders(_jsx(AuthDialog, { ...props }));
        const { items, initialIndex } = mockedRadioButtonSelect.mock.calls[0][0];
        expect(items[initialIndex].value).toBe(AuthType.USE_GEMINI);
    });
    it('selects initial auth type from GEMINI_API_KEY env var', () => {
        process.env['GEMINI_API_KEY'] = 'test-key';
        renderWithProviders(_jsx(AuthDialog, { ...props }));
        const { items, initialIndex } = mockedRadioButtonSelect.mock.calls[0][0];
        expect(items[initialIndex].value).toBe(AuthType.USE_GEMINI);
    });
    it('defaults to Login with Google', () => {
        renderWithProviders(_jsx(AuthDialog, { ...props }));
        const { items, initialIndex } = mockedRadioButtonSelect.mock.calls[0][0];
        expect(items[initialIndex].value).toBe(AuthType.LOGIN_WITH_GOOGLE);
    });
    describe('handleAuthSelect', () => {
        it('calls onAuthError if validation fails', () => {
            mockedValidateAuthMethod.mockReturnValue('Invalid method');
            renderWithProviders(_jsx(AuthDialog, { ...props }));
            const { onSelect: handleAuthSelect } = mockedRadioButtonSelect.mock.calls[0][0];
            handleAuthSelect(AuthType.USE_GEMINI);
            expect(mockedValidateAuthMethod).toHaveBeenCalledWith(AuthType.USE_GEMINI, props.settings);
            expect(props.onAuthError).toHaveBeenCalledWith('Invalid method');
            expect(props.settings.setValue).not.toHaveBeenCalled();
        });
        it('calls onSelect if validation passes', async () => {
            mockedValidateAuthMethod.mockReturnValue(null);
            renderWithProviders(_jsx(AuthDialog, { ...props }));
            const { onSelect: handleAuthSelect } = mockedRadioButtonSelect.mock.calls[0][0];
            await handleAuthSelect(AuthType.USE_GEMINI);
            expect(mockedValidateAuthMethod).toHaveBeenCalledWith(AuthType.USE_GEMINI, props.settings);
            expect(props.onAuthError).not.toHaveBeenCalled();
            expect(mockedClearCachedCredentialFile).toHaveBeenCalled();
            expect(props.settings.setValue).toHaveBeenCalledWith(SettingScope.User, 'security.auth.selectedType', AuthType.USE_GEMINI);
            expect(props.setAuthState).toHaveBeenCalledWith(AuthState.Unauthenticated);
        });
        it('exits process for Login with Google when browser is suppressed', async () => {
            const exitSpy = vi
                .spyOn(process, 'exit')
                .mockImplementation(() => undefined);
            const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
            vi.mocked(props.config.isBrowserLaunchSuppressed).mockReturnValue(true);
            mockedValidateAuthMethod.mockReturnValue(null);
            renderWithProviders(_jsx(AuthDialog, { ...props }));
            const { onSelect: handleAuthSelect } = mockedRadioButtonSelect.mock.calls[0][0];
            await handleAuthSelect(AuthType.LOGIN_WITH_GOOGLE);
            expect(mockedRunExitCleanup).toHaveBeenCalled();
            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Please restart Gemini CLI'));
            expect(exitSpy).toHaveBeenCalledWith(0);
            exitSpy.mockRestore();
            logSpy.mockRestore();
        });
    });
    it('displays authError when provided', () => {
        props.authError = 'Something went wrong';
        const { lastFrame } = renderWithProviders(_jsx(AuthDialog, { ...props }));
        expect(lastFrame()).toContain('Something went wrong');
    });
    describe('useKeypress', () => {
        it('does nothing on escape if authError is present', () => {
            props.authError = 'Some error';
            renderWithProviders(_jsx(AuthDialog, { ...props }));
            const keypressHandler = mockedUseKeypress.mock.calls[0][0];
            keypressHandler({ name: 'escape' });
            expect(props.onAuthError).not.toHaveBeenCalled();
            expect(props.setAuthState).not.toHaveBeenCalled();
        });
        it('calls onAuthError on escape if no auth method is set', () => {
            props.settings.merged.security.auth.selectedType = undefined;
            renderWithProviders(_jsx(AuthDialog, { ...props }));
            const keypressHandler = mockedUseKeypress.mock.calls[0][0];
            keypressHandler({ name: 'escape' });
            expect(props.onAuthError).toHaveBeenCalledWith('You must select an auth method to proceed. Press Ctrl+C twice to exit.');
        });
        it('calls onSelect(undefined) on escape if auth method is set', () => {
            props.settings.merged.security.auth.selectedType = AuthType.USE_GEMINI;
            renderWithProviders(_jsx(AuthDialog, { ...props }));
            const keypressHandler = mockedUseKeypress.mock.calls[0][0];
            keypressHandler({ name: 'escape' });
            expect(props.setAuthState).toHaveBeenCalledWith(AuthState.Unauthenticated);
            expect(props.settings.setValue).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=AuthDialog.test.js.map