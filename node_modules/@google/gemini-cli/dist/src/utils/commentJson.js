/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as fs from 'node:fs';
import { parse, stringify } from 'comment-json';
/**
 * Updates a JSON file while preserving comments and formatting.
 */
export function updateSettingsFilePreservingFormat(filePath, updates) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(updates, null, 2), 'utf-8');
        return;
    }
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    let parsed;
    try {
        parsed = parse(originalContent);
    }
    catch (error) {
        console.error('Error parsing settings file:', error);
        console.error('Settings file may be corrupted. Please check the JSON syntax.');
        return;
    }
    const updatedStructure = applyUpdates(parsed, updates);
    const updatedContent = stringify(updatedStructure, null, 2);
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
}
function applyUpdates(current, updates) {
    const result = current;
    for (const key of Object.getOwnPropertyNames(updates)) {
        const value = updates[key];
        if (typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value) &&
            typeof result[key] === 'object' &&
            result[key] !== null &&
            !Array.isArray(result[key])) {
            result[key] = applyUpdates(result[key], value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
//# sourceMappingURL=commentJson.js.map