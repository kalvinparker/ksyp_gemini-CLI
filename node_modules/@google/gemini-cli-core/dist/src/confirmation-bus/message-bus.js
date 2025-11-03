/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { EventEmitter } from 'node:events';
import { PolicyDecision } from '../policy/types.js';
import { MessageBusType } from './types.js';
import { safeJsonStringify } from '../utils/safeJsonStringify.js';
export class MessageBus extends EventEmitter {
    policyEngine;
    constructor(policyEngine) {
        super();
        this.policyEngine = policyEngine;
    }
    isValidMessage(message) {
        if (!message || !message.type) {
            return false;
        }
        if (message.type === MessageBusType.TOOL_CONFIRMATION_REQUEST &&
            !('correlationId' in message)) {
            return false;
        }
        return true;
    }
    emitMessage(message) {
        this.emit(message.type, message);
    }
    publish(message) {
        try {
            if (!this.isValidMessage(message)) {
                throw new Error(`Invalid message structure: ${safeJsonStringify(message)}`);
            }
            if (message.type === MessageBusType.TOOL_CONFIRMATION_REQUEST) {
                const decision = this.policyEngine.check(message.toolCall);
                switch (decision) {
                    case PolicyDecision.ALLOW:
                        // Directly emit the response instead of recursive publish
                        this.emitMessage({
                            type: MessageBusType.TOOL_CONFIRMATION_RESPONSE,
                            correlationId: message.correlationId,
                            confirmed: true,
                        });
                        break;
                    case PolicyDecision.DENY:
                        // Emit both rejection and response messages
                        this.emitMessage({
                            type: MessageBusType.TOOL_POLICY_REJECTION,
                            toolCall: message.toolCall,
                        });
                        this.emitMessage({
                            type: MessageBusType.TOOL_CONFIRMATION_RESPONSE,
                            correlationId: message.correlationId,
                            confirmed: false,
                        });
                        break;
                    case PolicyDecision.ASK_USER:
                        // Pass through to UI for user confirmation
                        this.emitMessage(message);
                        break;
                    default:
                        throw new Error(`Unknown policy decision: ${decision}`);
                }
            }
            else {
                // For all other message types, just emit them
                this.emitMessage(message);
            }
        }
        catch (error) {
            this.emit('error', error);
        }
    }
    subscribe(type, listener) {
        this.on(type, listener);
    }
    unsubscribe(type, listener) {
        this.off(type, listener);
    }
}
//# sourceMappingURL=message-bus.js.map