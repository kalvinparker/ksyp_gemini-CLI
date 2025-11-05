/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { EventEmitter } from 'node:events';
import type { PolicyEngine } from '../policy/policy-engine.js';
import { type Message } from './types.js';
export declare class MessageBus extends EventEmitter {
    private readonly policyEngine;
    constructor(policyEngine: PolicyEngine);
    private isValidMessage;
    private emitMessage;
    publish(message: Message): void;
    subscribe<T extends Message>(type: T['type'], listener: (message: T) => void): void;
    unsubscribe<T extends Message>(type: T['type'], listener: (message: T) => void): void;
}
