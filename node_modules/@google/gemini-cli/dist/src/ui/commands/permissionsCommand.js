/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CommandKind } from './types.js';
export const permissionsCommand = {
    name: 'permissions',
    description: 'Manage folder trust settings',
    kind: CommandKind.BUILT_IN,
    action: () => ({
        type: 'dialog',
        dialog: 'permissions',
    }),
};
//# sourceMappingURL=permissionsCommand.js.map