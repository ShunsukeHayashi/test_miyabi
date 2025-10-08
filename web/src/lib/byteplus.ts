/**
 * BytePlus Client Wrapper for Next.js
 *
 * Provides a unified interface for BytePlus AI operations in the Next.js environment.
 * This module re-exports all BytePlus clients and types for convenient usage.
 *
 * @module lib/byteplus
 *
 * @example
 * ```typescript
 * // Server-side usage (API routes, Server Components)
 * import { BytePlusClient, BytePlusAI } from '@/lib/byteplus';
 *
 * const client = new BytePlusClient({
 *   apiKey: process.env.BYTEPLUS_API_KEY!,
 *   endpoint: process.env.BYTEPLUS_ENDPOINT!
 * });
 *
 * const ai = new BytePlusAI({
 *   apiKey: process.env.BYTEPLUS_API_KEY!,
 *   endpoint: process.env.BYTEPLUS_ENDPOINT!
 * });
 * ```
 */

// Core clients
export { BytePlusClient, BytePlusAPIError } from './api/byteplus-client.js';
export { BytePlusAI } from './api/byteplus-ai.js';
export { TextGenerationClient } from './api/text-generation-client.js';

// Services
export { PromptOptimizer } from './services/prompt-optimizer.js';
export { PromptChain } from './services/prompt-chain.js';

// Types
export type {
  BytePlusConfig,
  ImageGenerationModel,
  ImageGenerationRequest,
  ImageGenerationResponse,
  VideoGenerationModel,
  VideoGenerationRequest,
  VideoGenerationResponse,
  TextGenerationModel,
  TextGenerationRequest,
  TextGenerationResponse,
  BatchGenerationRequest,
  BatchGenerationResult,
  PromptOptimizationRequest,
  PromptOptimizationResponse,
  APIErrorResponse,
  GeneratedImageData,
  GeneratedVideoData,
  ImageMetadata,
  VideoMetadata,
  ImageSize,
  VideoResolution,
  VideoRatio,
  ResponseFormat,
  PromptType,
} from './types/byteplus.js';

/**
 * Create a BytePlusClient instance with environment variables
 *
 * IMPORTANT: This should only be used in server-side contexts (API routes, Server Components).
 * Never use this in client components as it exposes API keys.
 *
 * @param debug - Enable debug logging (default: false)
 * @returns Configured BytePlusClient instance
 *
 * @example
 * ```typescript
 * import { createBytePlusClient } from '@/lib/byteplus';
 *
 * const client = createBytePlusClient();
 * const result = await client.generateImage({
 *   model: 'seedream-4-0-250828',
 *   prompt: 'A sunset over mountains',
 *   size: '2K'
 * });
 * ```
 */
export function createBytePlusClient(debug = false) {
  const { BytePlusClient } = require('./api/byteplus-client.js');

  if (!process.env.BYTEPLUS_API_KEY) {
    throw new Error(
      'BYTEPLUS_API_KEY environment variable is required. ' +
        'Please add it to your .env.local file.'
    );
  }

  if (!process.env.BYTEPLUS_ENDPOINT) {
    throw new Error(
      'BYTEPLUS_ENDPOINT environment variable is required. ' +
        'Please add it to your .env.local file.'
    );
  }

  return new BytePlusClient({
    apiKey: process.env.BYTEPLUS_API_KEY,
    endpoint: process.env.BYTEPLUS_ENDPOINT,
    debug,
  });
}

/**
 * Create a BytePlusAI instance with environment variables
 *
 * IMPORTANT: This should only be used in server-side contexts (API routes, Server Components).
 * Never use this in client components as it exposes API keys.
 *
 * @param debug - Enable debug logging (default: false)
 * @returns Configured BytePlusAI instance
 *
 * @example
 * ```typescript
 * import { createBytePlusAI } from '@/lib/byteplus';
 *
 * const ai = createBytePlusAI();
 * const result = await ai.generateImage(
 *   {
 *     model: 'seedream-4-0-250828',
 *     prompt: 'a cat',
 *     size: '2K'
 *   },
 *   { optimizePrompt: true }
 * );
 * ```
 */
export function createBytePlusAI(debug = false) {
  const { BytePlusAI } = require('./api/byteplus-ai.js');

  if (!process.env.BYTEPLUS_API_KEY) {
    throw new Error(
      'BYTEPLUS_API_KEY environment variable is required. ' +
        'Please add it to your .env.local file.'
    );
  }

  if (!process.env.BYTEPLUS_ENDPOINT) {
    throw new Error(
      'BYTEPLUS_ENDPOINT environment variable is required. ' +
        'Please add it to your .env.local file.'
    );
  }

  return new BytePlusAI({
    apiKey: process.env.BYTEPLUS_API_KEY,
    endpoint: process.env.BYTEPLUS_ENDPOINT,
    debug,
  });
}

/**
 * Validate BytePlus configuration
 *
 * Checks if required environment variables are set.
 *
 * @returns Configuration validation result
 *
 * @example
 * ```typescript
 * import { validateConfig } from '@/lib/byteplus';
 *
 * const config = validateConfig();
 * if (!config.isValid) {
 *   console.error('Missing configuration:', config.errors);
 * }
 * ```
 */
export function validateConfig(): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!process.env.BYTEPLUS_API_KEY) {
    errors.push('BYTEPLUS_API_KEY is not set');
  }

  if (!process.env.BYTEPLUS_ENDPOINT) {
    errors.push('BYTEPLUS_ENDPOINT is not set');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
