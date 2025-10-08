/**
 * Type Definitions Unit Tests
 *
 * Tests for BytePlus type definitions, validating type safety and constraints.
 *
 * @module tests/unit/types.test.ts
 */

import { describe, it, expect } from 'vitest';
import type {
  BytePlusConfig,
  ImageStyle,
  ImageGenerationModel,
  ImageGenerationRequest,
  ImageGenerationResponse,
  VideoGenerationRequest,
  VideoGenerationResponse,
  APIErrorResponse,
  RateLimiterConfig,
  BatchGenerationRequest,
  BatchGenerationResult,
  QualityCheckResult,
  ImageDimensions,
  ImageMetadata,
  VideoMetadata,
} from '../../src/types/byteplus.js';

describe('Type Definitions', () => {
  describe('BytePlusConfig', () => {
    it('should accept valid configuration', () => {
      const config: BytePlusConfig = {
        apiKey: 'test-key',
        endpoint: 'https://api.example.com',
        timeout: 30000,
        retryAttempts: 3,
        debug: true,
      };

      expect(config.apiKey).toBe('test-key');
      expect(config.endpoint).toBe('https://api.example.com');
      expect(config.timeout).toBe(30000);
      expect(config.retryAttempts).toBe(3);
      expect(config.debug).toBe(true);
    });

    it('should accept minimal configuration', () => {
      const config: BytePlusConfig = {
        apiKey: 'test-key',
        endpoint: 'https://api.example.com',
      };

      expect(config.apiKey).toBe('test-key');
      expect(config.endpoint).toBe('https://api.example.com');
      expect(config.timeout).toBeUndefined();
      expect(config.retryAttempts).toBeUndefined();
      expect(config.debug).toBeUndefined();
    });
  });

  describe('ImageStyle', () => {
    it('should accept valid image styles', () => {
      const styles: ImageStyle[] = [
        'Photorealistic',
        'Anime',
        '3D',
        'Oil Painting',
        'Watercolor',
        'Sketch',
        'Digital Art',
      ];

      styles.forEach((style) => {
        const testStyle: ImageStyle = style;
        expect(testStyle).toBe(style);
      });
    });
  });

  describe('ImageGenerationModel', () => {
    it('should accept valid models', () => {
      const seeddream: ImageGenerationModel = 'seeddream';
      const seeddream4: ImageGenerationModel = 'seeddream4';

      expect(seeddream).toBe('seeddream');
      expect(seeddream4).toBe('seeddream4');
    });
  });

  describe('ImageGenerationRequest', () => {
    it('should accept complete request', () => {
      const request: ImageGenerationRequest = {
        prompt: 'A beautiful sunset',
        negativePrompt: 'blurry, low quality',
        width: 1024,
        height: 1024,
        style: 'Photorealistic',
        seed: 42,
        guidanceScale: 7.5,
        steps: 50,
        count: 1,
      };

      expect(request.prompt).toBe('A beautiful sunset');
      expect(request.width).toBe(1024);
      expect(request.height).toBe(1024);
      expect(request.style).toBe('Photorealistic');
      expect(request.seed).toBe(42);
    });

    it('should accept minimal request with only prompt', () => {
      const request: ImageGenerationRequest = {
        prompt: 'A simple image',
      };

      expect(request.prompt).toBe('A simple image');
      expect(request.width).toBeUndefined();
      expect(request.height).toBeUndefined();
    });

    it('should accept request with different styles', () => {
      const styles: ImageStyle[] = [
        'Photorealistic',
        'Anime',
        '3D',
        'Oil Painting',
        'Watercolor',
        'Sketch',
        'Digital Art',
      ];

      styles.forEach((style) => {
        const request: ImageGenerationRequest = {
          prompt: 'Test',
          style,
        };
        expect(request.style).toBe(style);
      });
    });
  });

  describe('ImageDimensions', () => {
    it('should accept valid dimensions', () => {
      const dimensions: ImageDimensions = {
        width: 1024,
        height: 768,
      };

      expect(dimensions.width).toBe(1024);
      expect(dimensions.height).toBe(768);
    });
  });

  describe('ImageMetadata', () => {
    it('should accept complete metadata', () => {
      const metadata: ImageMetadata = {
        model: 'seeddream4',
        prompt: 'Test prompt',
        generationTime: 5000,
        dimensions: { width: 1024, height: 1024 },
        seed: 42,
        guidanceScale: 7.5,
        steps: 50,
      };

      expect(metadata.model).toBe('seeddream4');
      expect(metadata.prompt).toBe('Test prompt');
      expect(metadata.generationTime).toBe(5000);
      expect(metadata.dimensions.width).toBe(1024);
      expect(metadata.seed).toBe(42);
    });
  });

  describe('ImageGenerationResponse', () => {
    it('should accept complete response', () => {
      const response: ImageGenerationResponse = {
        imageUrl: 'https://example.com/image.png',
        seed: 42,
        metadata: {
          model: 'seeddream',
          prompt: 'Test',
          generationTime: 3000,
          dimensions: { width: 1024, height: 1024 },
          seed: 42,
          guidanceScale: 7.5,
          steps: 50,
        },
        additionalImages: [
          'https://example.com/image2.png',
          'https://example.com/image3.png',
        ],
      };

      expect(response.imageUrl).toBe('https://example.com/image.png');
      expect(response.seed).toBe(42);
      expect(response.additionalImages).toHaveLength(2);
    });

    it('should accept response without additional images', () => {
      const response: ImageGenerationResponse = {
        imageUrl: 'https://example.com/image.png',
        seed: 42,
        metadata: {
          model: 'seeddream',
          prompt: 'Test',
          generationTime: 3000,
          dimensions: { width: 1024, height: 1024 },
          seed: 42,
          guidanceScale: 7.5,
          steps: 50,
        },
      };

      expect(response.imageUrl).toBe('https://example.com/image.png');
      expect(response.additionalImages).toBeUndefined();
    });
  });

  describe('VideoGenerationRequest', () => {
    it('should accept complete request', () => {
      const request: VideoGenerationRequest = {
        sourceImage: './character.png',
        danceStyle: 'hip-hop',
        duration: 15,
        music: './music.mp3',
        seed: 123,
        quality: 'high',
      };

      expect(request.sourceImage).toBe('./character.png');
      expect(request.danceStyle).toBe('hip-hop');
      expect(request.duration).toBe(15);
      expect(request.music).toBe('./music.mp3');
      expect(request.seed).toBe(123);
      expect(request.quality).toBe('high');
    });

    it('should accept minimal request', () => {
      const request: VideoGenerationRequest = {
        sourceImage: './image.png',
        danceStyle: 'ballet',
      };

      expect(request.sourceImage).toBe('./image.png');
      expect(request.danceStyle).toBe('ballet');
      expect(request.duration).toBeUndefined();
    });

    it('should accept all dance styles', () => {
      const danceStyles: Array<
        'hip-hop' | 'ballet' | 'contemporary' | 'jazz' | 'freestyle'
      > = ['hip-hop', 'ballet', 'contemporary', 'jazz', 'freestyle'];

      danceStyles.forEach((style) => {
        const request: VideoGenerationRequest = {
          sourceImage: './image.png',
          danceStyle: style,
        };
        expect(request.danceStyle).toBe(style);
      });
    });

    it('should accept all quality levels', () => {
      const qualities: Array<'low' | 'medium' | 'high'> = [
        'low',
        'medium',
        'high',
      ];

      qualities.forEach((quality) => {
        const request: VideoGenerationRequest = {
          sourceImage: './image.png',
          danceStyle: 'hip-hop',
          quality,
        };
        expect(request.quality).toBe(quality);
      });
    });
  });

  describe('VideoMetadata', () => {
    it('should accept complete metadata', () => {
      const metadata: VideoMetadata = {
        model: 'seeddance',
        danceStyle: 'hip-hop',
        generationTime: 10000,
        duration: 15,
        dimensions: { width: 1080, height: 1920 },
        fps: 30,
        seed: 789,
      };

      expect(metadata.model).toBe('seeddance');
      expect(metadata.danceStyle).toBe('hip-hop');
      expect(metadata.generationTime).toBe(10000);
      expect(metadata.duration).toBe(15);
      expect(metadata.fps).toBe(30);
      expect(metadata.seed).toBe(789);
    });
  });

  describe('VideoGenerationResponse', () => {
    it('should accept complete response', () => {
      const response: VideoGenerationResponse = {
        videoUrl: 'https://example.com/video.mp4',
        seed: 789,
        metadata: {
          model: 'seeddance',
          danceStyle: 'ballet',
          generationTime: 8000,
          duration: 10,
          dimensions: { width: 1080, height: 1920 },
          fps: 30,
          seed: 789,
        },
        thumbnailUrl: 'https://example.com/thumbnail.png',
      };

      expect(response.videoUrl).toBe('https://example.com/video.mp4');
      expect(response.seed).toBe(789);
      expect(response.thumbnailUrl).toBe('https://example.com/thumbnail.png');
      expect(response.metadata.danceStyle).toBe('ballet');
    });
  });

  describe('APIErrorResponse', () => {
    it('should accept complete error response', () => {
      const error: APIErrorResponse = {
        code: 'RATE_LIMIT',
        message: 'Rate limit exceeded',
        details: {
          limit: 100,
          remaining: 0,
          resetAt: '2024-01-01T00:00:00Z',
        },
        requestId: 'req-12345',
      };

      expect(error.code).toBe('RATE_LIMIT');
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.details?.limit).toBe(100);
      expect(error.requestId).toBe('req-12345');
    });

    it('should accept minimal error response', () => {
      const error: APIErrorResponse = {
        code: 'BAD_REQUEST',
        message: 'Invalid parameters',
      };

      expect(error.code).toBe('BAD_REQUEST');
      expect(error.message).toBe('Invalid parameters');
      expect(error.details).toBeUndefined();
      expect(error.requestId).toBeUndefined();
    });
  });

  describe('RateLimiterConfig', () => {
    it('should accept valid configuration', () => {
      const config: RateLimiterConfig = {
        maxRequests: 10,
        windowMs: 1000,
      };

      expect(config.maxRequests).toBe(10);
      expect(config.windowMs).toBe(1000);
    });

    it('should accept different rate limits', () => {
      const configs: RateLimiterConfig[] = [
        { maxRequests: 5, windowMs: 500 },
        { maxRequests: 100, windowMs: 60000 },
        { maxRequests: 1000, windowMs: 3600000 },
      ];

      configs.forEach((config) => {
        expect(config.maxRequests).toBeGreaterThan(0);
        expect(config.windowMs).toBeGreaterThan(0);
      });
    });
  });

  describe('BatchGenerationRequest', () => {
    it('should accept complete request', () => {
      const request: BatchGenerationRequest = {
        prompts: ['prompt1', 'prompt2', 'prompt3'],
        sharedParams: {
          width: 1024,
          height: 1024,
          style: 'Anime',
          guidanceScale: 8.0,
        },
        maxConcurrency: 5,
      };

      expect(request.prompts).toHaveLength(3);
      expect(request.sharedParams?.width).toBe(1024);
      expect(request.maxConcurrency).toBe(5);
    });

    it('should accept minimal request', () => {
      const request: BatchGenerationRequest = {
        prompts: ['single prompt'],
      };

      expect(request.prompts).toHaveLength(1);
      expect(request.sharedParams).toBeUndefined();
      expect(request.maxConcurrency).toBeUndefined();
    });

    it('should accept empty shared params', () => {
      const request: BatchGenerationRequest = {
        prompts: ['prompt1', 'prompt2'],
        sharedParams: {},
      };

      expect(request.prompts).toHaveLength(2);
      expect(request.sharedParams).toBeDefined();
    });
  });

  describe('BatchGenerationResult', () => {
    it('should accept complete result', () => {
      const result: BatchGenerationResult = {
        successful: [
          {
            imageUrl: 'https://example.com/1.png',
            seed: 1,
            metadata: {
              model: 'seeddream4',
              prompt: 'test1',
              generationTime: 3000,
              dimensions: { width: 1024, height: 1024 },
              seed: 1,
              guidanceScale: 7.5,
              steps: 50,
            },
          },
          {
            imageUrl: 'https://example.com/2.png',
            seed: 2,
            metadata: {
              model: 'seeddream4',
              prompt: 'test2',
              generationTime: 3100,
              dimensions: { width: 1024, height: 1024 },
              seed: 2,
              guidanceScale: 7.5,
              steps: 50,
            },
          },
        ],
        failed: [
          {
            prompt: 'failed prompt',
            error: 'Generation failed',
          },
        ],
        totalTime: 10000,
        successRate: 0.667,
      };

      expect(result.successful).toHaveLength(2);
      expect(result.failed).toHaveLength(1);
      expect(result.totalTime).toBe(10000);
      expect(result.successRate).toBeCloseTo(0.667, 3);
    });

    it('should accept result with no failures', () => {
      const result: BatchGenerationResult = {
        successful: [
          {
            imageUrl: 'https://example.com/1.png',
            seed: 1,
            metadata: {
              model: 'seeddream4',
              prompt: 'test',
              generationTime: 3000,
              dimensions: { width: 1024, height: 1024 },
              seed: 1,
              guidanceScale: 7.5,
              steps: 50,
            },
          },
        ],
        failed: [],
        totalTime: 5000,
        successRate: 1.0,
      };

      expect(result.successful).toHaveLength(1);
      expect(result.failed).toHaveLength(0);
      expect(result.successRate).toBe(1.0);
    });

    it('should accept result with all failures', () => {
      const result: BatchGenerationResult = {
        successful: [],
        failed: [
          { prompt: 'p1', error: 'error1' },
          { prompt: 'p2', error: 'error2' },
        ],
        totalTime: 2000,
        successRate: 0.0,
      };

      expect(result.successful).toHaveLength(0);
      expect(result.failed).toHaveLength(2);
      expect(result.successRate).toBe(0.0);
    });
  });

  describe('QualityCheckResult', () => {
    it('should accept passing quality check', () => {
      const result: QualityCheckResult = {
        score: 85,
        passed: true,
        metrics: {
          promptAdherence: 90,
          resolution: 95,
          noiseLevel: 80,
          composition: 75,
        },
        issues: [],
      };

      expect(result.score).toBe(85);
      expect(result.passed).toBe(true);
      expect(result.metrics.promptAdherence).toBe(90);
      expect(result.issues).toHaveLength(0);
    });

    it('should accept failing quality check', () => {
      const result: QualityCheckResult = {
        score: 65,
        passed: false,
        metrics: {
          promptAdherence: 70,
          resolution: 60,
          noiseLevel: 55,
          composition: 75,
        },
        issues: ['Low resolution', 'High noise level', 'Poor composition'],
      };

      expect(result.score).toBe(65);
      expect(result.passed).toBe(false);
      expect(result.issues).toHaveLength(3);
    });

    it('should accept quality check with specific metrics', () => {
      const result: QualityCheckResult = {
        score: 80,
        passed: true,
        metrics: {
          promptAdherence: 85,
          resolution: 90,
          noiseLevel: 70,
          composition: 75,
        },
        issues: ['Minor noise detected'],
      };

      expect(result.metrics.promptAdherence).toBeGreaterThan(80);
      expect(result.metrics.resolution).toBeGreaterThan(80);
      expect(result.issues).toHaveLength(1);
    });
  });

  describe('Type Consistency', () => {
    it('should maintain consistency between request and response types', () => {
      const request: ImageGenerationRequest = {
        prompt: 'Test image',
        width: 1024,
        height: 1024,
        seed: 42,
        guidanceScale: 7.5,
        steps: 50,
      };

      const response: ImageGenerationResponse = {
        imageUrl: 'https://example.com/image.png',
        seed: request.seed!,
        metadata: {
          model: 'seeddream',
          prompt: request.prompt,
          generationTime: 5000,
          dimensions: {
            width: request.width!,
            height: request.height!,
          },
          seed: request.seed!,
          guidanceScale: request.guidanceScale!,
          steps: request.steps!,
        },
      };

      expect(response.seed).toBe(request.seed);
      expect(response.metadata.prompt).toBe(request.prompt);
      expect(response.metadata.dimensions.width).toBe(request.width);
      expect(response.metadata.guidanceScale).toBe(request.guidanceScale);
    });

    it('should maintain consistency for batch operations', () => {
      const batchRequest: BatchGenerationRequest = {
        prompts: ['p1', 'p2', 'p3'],
        sharedParams: {
          width: 2048,
          height: 2048,
        },
        maxConcurrency: 3,
      };

      const batchResult: BatchGenerationResult = {
        successful: [
          {
            imageUrl: 'https://example.com/1.png',
            seed: 1,
            metadata: {
              model: 'seeddream4',
              prompt: batchRequest.prompts[0]!,
              generationTime: 3000,
              dimensions: {
                width: batchRequest.sharedParams!.width!,
                height: batchRequest.sharedParams!.height!,
              },
              seed: 1,
              guidanceScale: 7.5,
              steps: 50,
            },
          },
        ],
        failed: [],
        totalTime: 5000,
        successRate: 1 / batchRequest.prompts.length,
      };

      expect(batchResult.successful[0]?.metadata.prompt).toBe(
        batchRequest.prompts[0]
      );
      expect(batchResult.successful[0]?.metadata.dimensions.width).toBe(
        batchRequest.sharedParams?.width
      );
    });
  });

  describe('Numeric Ranges', () => {
    it('should handle valid dimension ranges', () => {
      const dimensions: ImageDimensions[] = [
        { width: 64, height: 64 },
        { width: 512, height: 512 },
        { width: 1024, height: 1024 },
        { width: 2048, height: 2048 },
        { width: 4096, height: 4096 },
      ];

      dimensions.forEach((dim) => {
        expect(dim.width).toBeGreaterThanOrEqual(64);
        expect(dim.width).toBeLessThanOrEqual(4096);
        expect(dim.height).toBeGreaterThanOrEqual(64);
        expect(dim.height).toBeLessThanOrEqual(4096);
      });
    });

    it('should handle valid guidance scale ranges', () => {
      const scales = [1.0, 5.0, 7.5, 10.0, 15.0, 20.0];

      scales.forEach((scale) => {
        const request: ImageGenerationRequest = {
          prompt: 'test',
          guidanceScale: scale,
        };

        expect(request.guidanceScale).toBeGreaterThanOrEqual(1.0);
        expect(request.guidanceScale).toBeLessThanOrEqual(20.0);
      });
    });

    it('should handle valid step ranges', () => {
      const steps = [10, 25, 50, 75, 100];

      steps.forEach((step) => {
        const request: ImageGenerationRequest = {
          prompt: 'test',
          steps: step,
        };

        expect(request.steps).toBeGreaterThanOrEqual(10);
        expect(request.steps).toBeLessThanOrEqual(100);
      });
    });

    it('should handle valid quality scores', () => {
      const scores = [0, 25, 50, 75, 80, 90, 100];

      scores.forEach((score) => {
        const result: QualityCheckResult = {
          score,
          passed: score >= 80,
          metrics: {
            promptAdherence: score,
            resolution: score,
            noiseLevel: score,
            composition: score,
          },
          issues: [],
        };

        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
      });
    });
  });
});
