/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { GenerateContentConfig, PartListUnion, Content, GenerateContentResponse } from '@google/genai';
import type { ServerGeminiStreamEvent, ChatCompressionInfo } from './turn.js';
import { Turn } from './turn.js';
import type { Config } from '../config/config.js';
import { GeminiChat } from './geminiChat.js';
import type { ChatRecordingService } from '../services/chatRecordingService.js';
import { LoopDetectionService } from '../services/loopDetectionService.js';
export declare function isThinkingSupported(model: string): boolean;
export declare function isThinkingDefault(model: string): boolean;
/**
 * Returns the index of the oldest item to keep when compressing. May return
 * contents.length which indicates that everything should be compressed.
 *
 * Exported for testing purposes.
 */
export declare function findCompressSplitPoint(contents: Content[], fraction: number): number;
export declare class GeminiClient {
    private readonly config;
    private chat?;
    private readonly generateContentConfig;
    private sessionTurnCount;
    private readonly loopDetector;
    private lastPromptId;
    private currentSequenceModel;
    private lastSentIdeContext;
    private forceFullIdeContext;
    /**
     * At any point in this conversation, was compression triggered without
     * being forced and did it fail?
     */
    private hasFailedCompressionAttempt;
    constructor(config: Config);
    initialize(): Promise<void>;
    private getContentGeneratorOrFail;
    addHistory(content: Content): Promise<void>;
    getChat(): GeminiChat;
    isInitialized(): boolean;
    getHistory(): Content[];
    stripThoughtsFromHistory(): void;
    setHistory(history: Content[]): void;
    setTools(): Promise<void>;
    resetChat(): Promise<void>;
    getChatRecordingService(): ChatRecordingService | undefined;
    getLoopDetectionService(): LoopDetectionService;
    addDirectoryContext(): Promise<void>;
    startChat(extraHistory?: Content[]): Promise<GeminiChat>;
    private getIdeContextParts;
    sendMessageStream(request: PartListUnion, signal: AbortSignal, prompt_id: string, turns?: number): AsyncGenerator<ServerGeminiStreamEvent, Turn>;
    generateContent(contents: Content[], generationConfig: GenerateContentConfig, abortSignal: AbortSignal, model: string): Promise<GenerateContentResponse>;
    tryCompressChat(prompt_id: string, force?: boolean): Promise<ChatCompressionInfo>;
}
export declare const TEST_ONLY: {
    COMPRESSION_PRESERVE_THRESHOLD: number;
    COMPRESSION_TOKEN_THRESHOLD: number;
};
