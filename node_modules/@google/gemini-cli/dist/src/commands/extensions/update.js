/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { loadExtensions, annotateActiveExtensions, ExtensionStorage, requestConsentNonInteractive, } from '../../config/extension.js';
import { updateAllUpdatableExtensions, checkForAllExtensionUpdates, updateExtension, } from '../../config/extensions/update.js';
import { checkForExtensionUpdate } from '../../config/extensions/github.js';
import { getErrorMessage } from '../../utils/errors.js';
import { ExtensionUpdateState } from '../../ui/state/extensions.js';
import { ExtensionEnablementManager } from '../../config/extensions/extensionEnablement.js';
const updateOutput = (info) => `Extension "${info.name}" successfully updated: ${info.originalVersion} → ${info.updatedVersion}.`;
export async function handleUpdate(args) {
    const workingDir = process.cwd();
    const extensionEnablementManager = new ExtensionEnablementManager(ExtensionStorage.getUserExtensionsDir(), 
    // Force enable named extensions, otherwise we will only update the enabled
    // ones.
    args.name ? [args.name] : []);
    const allExtensions = loadExtensions(extensionEnablementManager);
    const extensions = annotateActiveExtensions(allExtensions, workingDir, extensionEnablementManager);
    if (args.name) {
        try {
            const extension = extensions.find((extension) => extension.name === args.name);
            if (!extension) {
                console.log(`Extension "${args.name}" not found.`);
                return;
            }
            let updateState;
            if (!extension.installMetadata) {
                console.log(`Unable to install extension "${args.name}" due to missing install metadata`);
                return;
            }
            await checkForExtensionUpdate(extension, (newState) => {
                updateState = newState;
            });
            if (updateState !== ExtensionUpdateState.UPDATE_AVAILABLE) {
                console.log(`Extension "${args.name}" is already up to date.`);
                return;
            }
            // TODO(chrstnb): we should list extensions if the requested extension is not installed.
            const updatedExtensionInfo = (await updateExtension(extension, workingDir, requestConsentNonInteractive, updateState, () => { }));
            if (updatedExtensionInfo.originalVersion !==
                updatedExtensionInfo.updatedVersion) {
                console.log(`Extension "${args.name}" successfully updated: ${updatedExtensionInfo.originalVersion} → ${updatedExtensionInfo.updatedVersion}.`);
            }
            else {
                console.log(`Extension "${args.name}" is already up to date.`);
            }
        }
        catch (error) {
            console.error(getErrorMessage(error));
        }
    }
    if (args.all) {
        try {
            const extensionState = new Map();
            await checkForAllExtensionUpdates(extensions, (action) => {
                if (action.type === 'SET_STATE') {
                    extensionState.set(action.payload.name, {
                        status: action.payload.state,
                        processed: true, // No need to process as we will force the update.
                    });
                }
            });
            let updateInfos = await updateAllUpdatableExtensions(workingDir, requestConsentNonInteractive, extensions, extensionState, () => { });
            updateInfos = updateInfos.filter((info) => info.originalVersion !== info.updatedVersion);
            if (updateInfos.length === 0) {
                console.log('No extensions to update.');
                return;
            }
            console.log(updateInfos.map((info) => updateOutput(info)).join('\n'));
        }
        catch (error) {
            console.error(getErrorMessage(error));
        }
    }
}
export const updateCommand = {
    command: 'update [<name>] [--all]',
    describe: 'Updates all extensions or a named extension to the latest version.',
    builder: (yargs) => yargs
        .positional('name', {
        describe: 'The name of the extension to update.',
        type: 'string',
    })
        .option('all', {
        describe: 'Update all extensions.',
        type: 'boolean',
    })
        .conflicts('name', 'all')
        .check((argv) => {
        if (!argv.all && !argv.name) {
            throw new Error('Either an extension name or --all must be provided');
        }
        return true;
    }),
    handler: async (argv) => {
        await handleUpdate({
            name: argv['name'],
            all: argv['all'],
        });
    },
};
//# sourceMappingURL=update.js.map