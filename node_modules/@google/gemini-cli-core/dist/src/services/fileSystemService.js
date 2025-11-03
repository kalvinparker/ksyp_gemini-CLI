/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import fs from 'node:fs/promises';
import * as path from 'node:path';
import { globSync } from 'glob';
/**
 * Standard file system implementation
 */
export class StandardFileSystemService {
    async readTextFile(filePath) {
        return fs.readFile(filePath, 'utf-8');
    }
    async writeTextFile(filePath, content) {
        await fs.writeFile(filePath, content, 'utf-8');
    }
    findFiles(fileName, searchPaths) {
        return searchPaths.flatMap((searchPath) => {
            const pattern = path.posix.join(searchPath, '**', fileName);
            return globSync(pattern, {
                nodir: true,
                absolute: true,
            });
        });
    }
}
//# sourceMappingURL=fileSystemService.js.map