/**
 * BytePlus API Type Definitions
 *
 * TypeScript strict mode type definitions for BytePlus image and video generation APIs.
 * Covers SEEDDREAM, SEEDDREAM4, and SEEDDANCE models.
 *
 * @module types/byteplus
 */

/**
 * BytePlus API client configuration
 */
export interface BytePlusConfig {
  /** BytePlus API key */
  apiKey: string;

  /** API endpoint URL */
  endpoint: string;

  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;

  /** Maximum retry attempts for failed requests (default: 3) */
  retryAttempts?: number;

  /** Enable debug logging (default: false) */
  debug?: boolean;
}

/**
 * Image style options for generation
 */
export type ImageStyle =
  | 'Photorealistic'
  | 'Anime'
  | '3D'
  | 'Oil Painting'
  | 'Watercolor'
  | 'Sketch'
  | 'Digital Art';

/**
 * Supported image generation models
 */
export type ImageGenerationModel = 'seeddream' | 'seeddream4';

/**
 * Image generation request parameters
 */
export interface ImageGenerationRequest {
  /** Text prompt describing the desired image */
  prompt: string;

  /** Negative prompt to avoid unwanted elements */
  negativePrompt?: string;

  /** Image width in pixels (64-4096, default: 1024) */
  width?: number;

  /** Image height in pixels (64-4096, default: 1024) */
  height?: number;

  /** Visual style for the generated image */
  style?: ImageStyle;

  /** Random seed for reproducible generation */
  seed?: number;

  /** Guidance scale for prompt adherence (1.0-20.0, default: 7.5) */
  guidanceScale?: number;

  /** Number of inference steps (10-100, default: 50) */
  steps?: number;

  /** Number of images to generate (1-4, default: 1) */
  count?: number;
}

/**
 * Image dimensions
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Image generation metadata
 */
export interface ImageMetadata {
  /** Model used for generation */
  model: string;

  /** Original prompt */
  prompt: string;

  /** Generation time in milliseconds */
  generationTime: number;

  /** Image dimensions */
  dimensions: ImageDimensions;

  /** Seed used for generation */
  seed: number;

  /** Guidance scale used */
  guidanceScale: number;

  /** Number of steps used */
  steps: number;
}

/**
 * Image generation response
 */
export interface ImageGenerationResponse {
  /** URL to the generated image */
  imageUrl: string;

  /** Seed used for generation (for reproducibility) */
  seed: number;

  /** Generation metadata */
  metadata: ImageMetadata;

  /** Additional images if count > 1 */
  additionalImages?: string[];
}

/**
 * Video generation request parameters
 */
export interface VideoGenerationRequest {
  /** Path or URL to source image */
  sourceImage: string;

  /** Dance style to apply */
  danceStyle: 'hip-hop' | 'ballet' | 'contemporary' | 'jazz' | 'freestyle';

  /** Video duration in seconds (1-30, default: 10) */
  duration?: number;

  /** Optional music file path or URL */
  music?: string;

  /** Random seed for reproducible generation */
  seed?: number;

  /** Video quality ('low' | 'medium' | 'high', default: 'high') */
  quality?: 'low' | 'medium' | 'high';
}

/**
 * Video generation metadata
 */
export interface VideoMetadata {
  /** Model used for generation */
  model: string;

  /** Dance style applied */
  danceStyle: string;

  /** Generation time in milliseconds */
  generationTime: number;

  /** Video duration in seconds */
  duration: number;

  /** Video dimensions */
  dimensions: ImageDimensions;

  /** Frame rate */
  fps: number;

  /** Seed used for generation */
  seed: number;
}

/**
 * Video generation response
 */
export interface VideoGenerationResponse {
  /** URL to the generated video */
  videoUrl: string;

  /** Seed used for generation */
  seed: number;

  /** Generation metadata */
  metadata: VideoMetadata;

  /** URL to thumbnail image */
  thumbnailUrl: string;
}

/**
 * API error response
 */
export interface APIErrorResponse {
  /** Error code */
  code: string;

  /** Error message */
  message: string;

  /** Additional error details */
  details?: Record<string, unknown>;

  /** Request ID for debugging */
  requestId?: string;
}

/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
  /** Maximum requests per window */
  maxRequests: number;

  /** Time window in milliseconds */
  windowMs: number;
}

/**
 * Batch generation request
 */
export interface BatchGenerationRequest {
  /** Array of prompts to generate */
  prompts: string[];

  /** Shared parameters for all generations */
  sharedParams?: Partial<ImageGenerationRequest>;

  /** Maximum concurrent requests (default: 10) */
  maxConcurrency?: number;
}

/**
 * Batch generation result
 */
export interface BatchGenerationResult {
  /** Successfully generated images */
  successful: ImageGenerationResponse[];

  /** Failed generations with error details */
  failed: Array<{
    prompt: string;
    error: string;
  }>;

  /** Total time in milliseconds */
  totalTime: number;

  /** Success rate (0.0-1.0) */
  successRate: number;
}

/**
 * Quality check result
 */
export interface QualityCheckResult {
  /** Quality score (0-100) */
  score: number;

  /** Pass/fail status (>= 80 is pass) */
  passed: boolean;

  /** Detailed quality metrics */
  metrics: {
    promptAdherence: number;
    resolution: number;
    noiseLevel: number;
    composition: number;
  };

  /** Issues found during quality check */
  issues: string[];
}
