/**
 * BytePlus API Client
 *
 * Production-grade TypeScript client for BytePlus image and video generation APIs.
 * Implements rate limiting, retry logic, and error handling.
 *
 * @module api/byteplus-client
 */

import type {
  BytePlusConfig,
  ImageGenerationModel,
  ImageGenerationRequest,
  ImageGenerationResponse,
  VideoGenerationRequest,
  VideoGenerationResponse,
  RateLimiterConfig,
  BatchGenerationRequest,
  BatchGenerationResult,
  APIErrorResponse,
} from '../types/byteplus.js';

/**
 * Custom error class for BytePlus API errors
 */
export class BytePlusAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public requestId?: string
  ) {
    super(message);
    this.name = 'BytePlusAPIError';
  }
}

/**
 * Rate limiter implementation using token bucket algorithm
 */
class RateLimiter {
  private tokens: number[] = [];

  constructor(private config: RateLimiterConfig) {}

  /**
   * Acquire a token to proceed with request
   * Waits if rate limit is exceeded
   */
  async acquire(): Promise<void> {
    const now = Date.now();
    this.tokens = this.tokens.filter((t) => now - t < this.config.windowMs);

    if (this.tokens.length >= this.config.maxRequests) {
      const oldestToken = this.tokens[0];
      const waitTime = this.config.windowMs - (now - oldestToken);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.acquire();
    }

    this.tokens.push(now);
  }

  /**
   * Get current usage statistics
   */
  getStats(): { used: number; available: number; resetIn: number } {
    const now = Date.now();
    this.tokens = this.tokens.filter((t) => now - t < this.config.windowMs);

    const oldestToken = this.tokens[0];
    const resetIn = oldestToken
      ? Math.max(0, this.config.windowMs - (now - oldestToken))
      : 0;

    return {
      used: this.tokens.length,
      available: this.config.maxRequests - this.tokens.length,
      resetIn,
    };
  }
}

/**
 * BytePlus API Client
 *
 * Main client for interacting with BytePlus image and video generation APIs.
 *
 * @example
 * ```typescript
 * const client = new BytePlusClient({
 *   apiKey: process.env.BYTEPLUS_API_KEY!,
 *   endpoint: process.env.BYTEPLUS_ENDPOINT!
 * });
 *
 * const result = await client.generateImage('seeddream4', {
 *   prompt: 'A beautiful sunset over mountains',
 *   width: 1024,
 *   height: 1024
 * });
 * ```
 */
export class BytePlusClient {
  private config: Required<BytePlusConfig>;
  private rateLimiter: RateLimiter;

  constructor(config: BytePlusConfig) {
    this.config = {
      apiKey: config.apiKey,
      endpoint: config.endpoint,
      timeout: config.timeout ?? 30000,
      retryAttempts: config.retryAttempts ?? 3,
      debug: config.debug ?? false,
    };

    this.rateLimiter = new RateLimiter({
      maxRequests: 10,
      windowMs: 1000,
    });

    this.validateConfig();
  }

  /**
   * Validate client configuration
   */
  private validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error('BytePlus API key is required');
    }

    if (!this.config.endpoint) {
      throw new Error('BytePlus API endpoint is required');
    }

    if (this.config.timeout < 1000 || this.config.timeout > 300000) {
      throw new Error('Timeout must be between 1000ms and 300000ms');
    }

    if (this.config.retryAttempts < 0 || this.config.retryAttempts > 10) {
      throw new Error('Retry attempts must be between 0 and 10');
    }
  }

  /**
   * Log debug information
   */
  private log(message: string, data?: unknown): void {
    if (this.config.debug) {
      console.log(`[BytePlusClient] ${message}`, data ?? '');
    }
  }

  /**
   * Exponential backoff calculation
   */
  private calculateBackoff(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 10000);
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    path: string,
    method: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.config.endpoint}${path}`;

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        await this.rateLimiter.acquire();

        this.log(`Making ${method} request to ${url}`, {
          attempt: attempt + 1,
          body,
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout
        );

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Byteflow/1.0',
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = (await response.json()) as APIErrorResponse;
          throw new BytePlusAPIError(
            errorData.message || `API request failed: ${response.statusText}`,
            response.status,
            errorData.code,
            errorData.requestId
          );
        }

        const data = (await response.json()) as T;
        this.log('Request successful', data);
        return data;
      } catch (error) {
        const isLastAttempt = attempt === this.config.retryAttempts;

        if (error instanceof BytePlusAPIError) {
          // Retry on rate limit or server errors
          if (
            (error.statusCode === 429 || error.statusCode >= 500) &&
            !isLastAttempt
          ) {
            const backoff = this.calculateBackoff(attempt);
            this.log(`Retrying after ${backoff}ms`, { error: error.message });
            await new Promise((resolve) => setTimeout(resolve, backoff));
            continue;
          }
        }

        if (isLastAttempt) {
          throw error;
        }

        // Retry on network errors
        const backoff = this.calculateBackoff(attempt);
        this.log(`Retrying after ${backoff}ms`, {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Validate image generation request
   */
  private validateImageRequest(request: ImageGenerationRequest): void {
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (request.prompt.length > 2000) {
      throw new Error('Prompt must be less than 2000 characters');
    }

    if (request.width && (request.width < 64 || request.width > 4096)) {
      throw new Error('Width must be between 64 and 4096 pixels');
    }

    if (request.height && (request.height < 64 || request.height > 4096)) {
      throw new Error('Height must be between 64 and 4096 pixels');
    }

    if (
      request.guidanceScale &&
      (request.guidanceScale < 1.0 || request.guidanceScale > 20.0)
    ) {
      throw new Error('Guidance scale must be between 1.0 and 20.0');
    }

    if (request.steps && (request.steps < 10 || request.steps > 100)) {
      throw new Error('Steps must be between 10 and 100');
    }

    if (request.count && (request.count < 1 || request.count > 4)) {
      throw new Error('Count must be between 1 and 4');
    }
  }

  /**
   * Generate image using specified model
   *
   * @param model - Image generation model ('seeddream' or 'seeddream4')
   * @param request - Image generation parameters
   * @returns Generated image response with URL and metadata
   *
   * @example
   * ```typescript
   * const result = await client.generateImage('seeddream4', {
   *   prompt: 'A sunset over mountains, photorealistic',
   *   negativePrompt: 'blurry, low quality',
   *   width: 1024,
   *   height: 1024,
   *   style: 'Photorealistic',
   *   seed: 42
   * });
   *
   * console.log(`Image URL: ${result.imageUrl}`);
   * console.log(`Seed: ${result.seed}`);
   * ```
   */
  async generateImage(
    model: ImageGenerationModel,
    request: ImageGenerationRequest
  ): Promise<ImageGenerationResponse> {
    this.validateImageRequest(request);

    const startTime = Date.now();

    const response = await this.makeRequest<ImageGenerationResponse>(
      `/${model}/generate`,
      'POST',
      {
        prompt: request.prompt,
        negative_prompt: request.negativePrompt,
        width: request.width ?? 1024,
        height: request.height ?? 1024,
        style: request.style,
        seed: request.seed,
        guidance_scale: request.guidanceScale ?? 7.5,
        steps: request.steps ?? 50,
        count: request.count ?? 1,
      }
    );

    const generationTime = Date.now() - startTime;

    return {
      ...response,
      metadata: {
        ...response.metadata,
        generationTime,
      },
    };
  }

  /**
   * Generate dance video using SEEDDANCE model
   *
   * @param request - Video generation parameters
   * @returns Generated video response with URL and metadata
   *
   * @example
   * ```typescript
   * const result = await client.generateDanceVideo({
   *   sourceImage: './character.png',
   *   danceStyle: 'hip-hop',
   *   duration: 10,
   *   quality: 'high'
   * });
   *
   * console.log(`Video URL: ${result.videoUrl}`);
   * ```
   */
  async generateDanceVideo(
    request: VideoGenerationRequest
  ): Promise<VideoGenerationResponse> {
    if (!request.sourceImage) {
      throw new Error('Source image is required');
    }

    if (request.duration && (request.duration < 1 || request.duration > 30)) {
      throw new Error('Duration must be between 1 and 30 seconds');
    }

    const startTime = Date.now();

    const response = await this.makeRequest<VideoGenerationResponse>(
      '/seeddance/generate',
      'POST',
      {
        source_image: request.sourceImage,
        dance_style: request.danceStyle,
        duration: request.duration ?? 10,
        music: request.music,
        seed: request.seed,
        quality: request.quality ?? 'high',
      }
    );

    const generationTime = Date.now() - startTime;

    return {
      ...response,
      metadata: {
        ...response.metadata,
        generationTime,
      },
    };
  }

  /**
   * Batch generate multiple images in parallel
   *
   * @param request - Batch generation request
   * @returns Batch generation results with success/failure stats
   *
   * @example
   * ```typescript
   * const result = await client.batchGenerate({
   *   prompts: [
   *     'A sunset over mountains',
   *     'A city at night',
   *     'A forest in autumn'
   *   ],
   *   sharedParams: {
   *     width: 1024,
   *     height: 1024,
   *     style: 'Photorealistic'
   *   },
   *   maxConcurrency: 3
   * });
   *
   * console.log(`Success rate: ${result.successRate * 100}%`);
   * ```
   */
  async batchGenerate(
    request: BatchGenerationRequest
  ): Promise<BatchGenerationResult> {
    const { prompts, sharedParams = {}, maxConcurrency = 10 } = request;

    if (prompts.length === 0) {
      throw new Error('At least one prompt is required');
    }

    const startTime = Date.now();
    const successful: ImageGenerationResponse[] = [];
    const failed: Array<{ prompt: string; error: string }> = [];

    // Process in chunks to respect maxConcurrency
    for (let i = 0; i < prompts.length; i += maxConcurrency) {
      const chunk = prompts.slice(i, i + maxConcurrency);
      const promises = chunk.map(async (prompt) => {
        try {
          const result = await this.generateImage('seeddream4', {
            ...sharedParams,
            prompt,
          });
          successful.push(result);
        } catch (error) {
          failed.push({
            prompt,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      await Promise.all(promises);
    }

    const totalTime = Date.now() - startTime;
    const successRate = successful.length / prompts.length;

    return {
      successful,
      failed,
      totalTime,
      successRate,
    };
  }

  /**
   * Get rate limiter statistics
   */
  getRateLimiterStats(): { used: number; available: number; resetIn: number } {
    return this.rateLimiter.getStats();
  }

  /**
   * Check API health
   *
   * @returns True if API is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      await this.makeRequest<{ status: string }>('/health', 'GET');
      return true;
    } catch {
      return false;
    }
  }
}
