/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useGitBranchName } from './useGitBranchName.js';
import { fs, vol } from 'memfs'; // For mocking fs
import { spawnAsync as mockSpawnAsync } from '@google/gemini-cli-core';
// Mock @google/gemini-cli-core
vi.mock('@google/gemini-cli-core', async () => {
    const original = await vi.importActual('@google/gemini-cli-core');
    return {
        ...original,
        spawnAsync: vi.fn(),
    };
});
// Mock fs and fs/promises
vi.mock('node:fs', async () => {
    const memfs = await vi.importActual('memfs');
    return {
        ...memfs.fs,
        default: memfs.fs,
    };
});
vi.mock('node:fs/promises', async () => {
    const memfs = await vi.importActual('memfs');
    return memfs.fs.promises;
});
const CWD = '/test/project';
const GIT_LOGS_HEAD_PATH = `${CWD}/.git/logs/HEAD`;
describe('useGitBranchName', () => {
    beforeEach(() => {
        vol.reset(); // Reset in-memory filesystem
        vol.fromJSON({
            [GIT_LOGS_HEAD_PATH]: 'ref: refs/heads/main',
        });
        vi.useFakeTimers(); // Use fake timers for async operations
    });
    afterEach(() => {
        vi.restoreAllMocks();
        vi.clearAllTimers();
    });
    it('should return branch name', async () => {
        mockSpawnAsync.mockResolvedValue({
            stdout: 'main\n',
        });
        const { result, rerender } = renderHook(() => useGitBranchName(CWD));
        await act(async () => {
            vi.runAllTimers(); // Advance timers to trigger useEffect and exec callback
            rerender(); // Rerender to get the updated state
        });
        expect(result.current).toBe('main');
    });
    it('should return undefined if git command fails', async () => {
        mockSpawnAsync.mockRejectedValue(new Error('Git error'));
        const { result, rerender } = renderHook(() => useGitBranchName(CWD));
        expect(result.current).toBeUndefined();
        await act(async () => {
            vi.runAllTimers();
            rerender();
        });
        expect(result.current).toBeUndefined();
    });
    it('should return short commit hash if branch is HEAD (detached state)', async () => {
        mockSpawnAsync.mockImplementation(async (command, args) => {
            if (args.includes('--abbrev-ref')) {
                return { stdout: 'HEAD\n' };
            }
            else if (args.includes('--short')) {
                return { stdout: 'a1b2c3d\n' };
            }
            return { stdout: '' };
        });
        const { result, rerender } = renderHook(() => useGitBranchName(CWD));
        await act(async () => {
            vi.runAllTimers();
            rerender();
        });
        expect(result.current).toBe('a1b2c3d');
    });
    it('should return undefined if branch is HEAD and getting commit hash fails', async () => {
        mockSpawnAsync.mockImplementation(async (command, args) => {
            if (args.includes('--abbrev-ref')) {
                return { stdout: 'HEAD\n' };
            }
            else if (args.includes('--short')) {
                throw new Error('Git error');
            }
            return { stdout: '' };
        });
        const { result, rerender } = renderHook(() => useGitBranchName(CWD));
        await act(async () => {
            vi.runAllTimers();
            rerender();
        });
        expect(result.current).toBeUndefined();
    });
    it('should update branch name when .git/HEAD changes', async ({ skip }) => {
        skip(); // TODO: fix
        mockSpawnAsync
            .mockResolvedValueOnce({ stdout: 'main\n' })
            .mockResolvedValueOnce({ stdout: 'develop\n' });
        const { result, rerender } = renderHook(() => useGitBranchName(CWD));
        await act(async () => {
            vi.runAllTimers();
            rerender();
        });
        expect(result.current).toBe('main');
        // Simulate file change event
        // Ensure the watcher is set up before triggering the change
        await act(async () => {
            fs.writeFileSync(GIT_LOGS_HEAD_PATH, 'ref: refs/heads/develop'); // Trigger watcher
            vi.runAllTimers(); // Process timers for watcher and exec
            rerender();
        });
        await waitFor(() => {
            expect(result.current).toBe('develop');
        });
    });
    it('should handle watcher setup error silently', async () => {
        // Remove .git/logs/HEAD to cause an error in fs.watch setup
        vol.unlinkSync(GIT_LOGS_HEAD_PATH);
        mockSpawnAsync.mockResolvedValue({
            stdout: 'main\n',
        });
        const { result, rerender } = renderHook(() => useGitBranchName(CWD));
        await act(async () => {
            vi.runAllTimers();
            rerender();
        });
        expect(result.current).toBe('main'); // Branch name should still be fetched initially
        mockSpawnAsync.mockResolvedValueOnce({
            stdout: 'develop\n',
        });
        // This write would trigger the watcher if it was set up
        // but since it failed, the branch name should not update
        // We need to create the file again for writeFileSync to not throw
        vol.fromJSON({
            [GIT_LOGS_HEAD_PATH]: 'ref: refs/heads/develop',
        });
        await act(async () => {
            fs.writeFileSync(GIT_LOGS_HEAD_PATH, 'ref: refs/heads/develop');
            vi.runAllTimers();
            rerender();
        });
        // Branch name should not change because watcher setup failed
        expect(result.current).toBe('main');
    });
    it('should cleanup watcher on unmount', async ({ skip }) => {
        skip(); // TODO: fix
        const closeMock = vi.fn();
        const watchMock = vi.spyOn(fs, 'watch').mockReturnValue({
            close: closeMock,
        });
        mockSpawnAsync.mockResolvedValue({
            stdout: 'main\n',
        });
        const { unmount, rerender } = renderHook(() => useGitBranchName(CWD));
        await act(async () => {
            vi.runAllTimers();
            rerender();
        });
        unmount();
        expect(watchMock).toHaveBeenCalledWith(GIT_LOGS_HEAD_PATH, expect.any(Function));
        expect(closeMock).toHaveBeenCalled();
    });
});
//# sourceMappingURL=useGitBranchName.test.js.map