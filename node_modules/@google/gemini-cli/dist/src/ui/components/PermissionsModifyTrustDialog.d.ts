/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import { type UseHistoryManagerReturn } from '../hooks/useHistoryManager.js';
interface PermissionsModifyTrustDialogProps {
    onExit: () => void;
    addItem: UseHistoryManagerReturn['addItem'];
}
export declare function PermissionsModifyTrustDialog({ onExit, addItem, }: PermissionsModifyTrustDialogProps): React.JSX.Element;
export {};
