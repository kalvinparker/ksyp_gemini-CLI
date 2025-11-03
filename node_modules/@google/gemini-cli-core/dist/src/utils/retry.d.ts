/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { GenerateContentResponse } from '@google/genai';
export interface HttpError extends Error {
    status?: number;
}
export interface RetryOptions {
    maxAttempts: number;
    initialDelayMs: number;
    maxDelayMs: number;
    shouldRetryOnError: (error: Error) => boolean;
    shouldRetryOnContent?: (content: GenerateContentResponse) => boolean;
    onPersistent429?: (authType?: string, error?: unknown) => Promise<string | boolean | null>;
    authType?: string;
}
/**
 * Retries a function with exponential backoff and jitter.
 * @param fn The asynchronous function to retry.
 * @param options Optional retry configuration.
 * @returns A promise that resolves with the result of the function if successful.
 * @throws The last error encountered if all attempts fail.
 */
export declare function retryWithBackoff<T>(fn: () => Promise<T>, options?: Partial<RetryOptions>): Promise<T>;
/**
 * Extracts the HTTP status code from an error object.
 * @param error The error object.
 * @returns The HTTP status code, or undefined if not found.
 */
export declare function getErrorStatus(error: unknown): number | undefined;
