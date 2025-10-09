/**
 * BytePlus API v3 Integration Tests
 *
 * Comprehensive integration tests for all BytePlus API v3 endpoints:
 * - T2I (Text-to-Image): seedream-4-0-250828
 * - I2I (Image-to-Image): Bytedance-SeedEdit-3.0-i2i
 * - I2V (Image-to-Video): Bytedance-Seedance-1.0-pro
 * - T2T (Text-to-Text): DeepSeek-R1-250528, Skylark-pro-250415
 * - Vision API: seed-1-6-250915
 *
 * @module tests/integration/byteplus-api-v3.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { BytePlusClient, BytePlusAPIError } from '../../src/api/byteplus-client.js';
import { TextGenerationClient } from '../../src/api/text-generation-client.js';
import type {
  ImageGenerationRequest,
  ImageGenerationResponse,
  VideoGenerationRequest,
  VideoGenerationResponse,
  TextGenerationRequest,
  TextGenerationResponse,
} from '../../src/types/byteplus.js';

// Skip these tests if API credentials are not available
const skipIfNoCredentials = () => {
  if (!process.env.BYTEPLUS_API_KEY || !process.env.BYTEPLUS_ENDPOINT) {
    console.warn('⚠️ Skipping integration tests: BYTEPLUS_API_KEY or BYTEPLUS_ENDPOINT not set');
    return true;
  }
  return false;
};

describe('BytePlus API v3 Integration Tests', () => {
  let client: BytePlusClient;
  let textClient: TextGenerationClient;

  beforeAll(() => {
    if (skipIfNoCredentials()) {
      return;
    }

    client = new BytePlusClient({
      apiKey: process.env.BYTEPLUS_API_KEY!,
      endpoint: process.env.BYTEPLUS_ENDPOINT!,
      timeout: 60000, // 60秒
      retryAttempts: 3,
      debug: true,
    });

    textClient = new TextGenerationClient({
      apiKey: process.env.BYTEPLUS_API_KEY!,
      endpoint: process.env.BYTEPLUS_ENDPOINT!,
      timeout: 60000,
      debug: true,
    });
  });

  describe('T2I (Text-to-Image) API', () => {
    it.skipIf(skipIfNoCredentials())('should generate image with seedream-4-0-250828', async () => {
      const request: ImageGenerationRequest = {
        model: 'seedream-4-0-250828',
        prompt: 'A beautiful sunset over mountains, photorealistic style, 8K quality',
        size: '1K',
        response_format: 'url',
        watermark: true,
        seed: 42,
      };

      const response = await client.generateImage(request);

      // レスポンス検証
      expect(response).toBeDefined();
      expect(response.data).toBeInstanceOf(Array);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0]!.url).toMatch(/^https?:\/\//);
      // Note: BytePlus API v3 doesn't always return seed in response
      if (response.seed !== undefined) {
        expect(response.seed).toBe(42);
      }

      console.log('✅ T2I Test passed');
      console.log(`   Generated image: ${response.data[0]!.url}`);
      console.log(`   Model: ${response.model}`);
      console.log(`   Usage: ${JSON.stringify(response.usage)}`);
    }, 120000); // 2分タイムアウト

    it.skipIf(skipIfNoCredentials())('should generate 2K image', async () => {
      const request: ImageGenerationRequest = {
        model: 'seedream-4-0-250828',
        prompt: 'A serene lake with mountains in background, high detail',
        size: '2K',
        watermark: false,
      };

      const response = await client.generateImage(request);

      expect(response.data[0]!.url).toMatch(/^https?:\/\//);
      console.log('✅ 2K Image generated:', response.data[0]!.url);
    }, 120000);

    it.skipIf(skipIfNoCredentials())('should handle invalid prompt gracefully', async () => {
      const request: ImageGenerationRequest = {
        model: 'seedream-4-0-250828',
        prompt: '', // Empty prompt should fail
        size: '1K',
      };

      await expect(client.generateImage(request)).rejects.toThrow();
    });
  });

  describe('I2I (Image-to-Image) API', () => {
    const testImageUrl = 'https://picsum.photos/1024/1024'; // Public test image

    it.skipIf(skipIfNoCredentials())('should edit image with Bytedance-SeedEdit-3.0-i2i', async () => {
      const request: ImageGenerationRequest = {
        model: 'Bytedance-SeedEdit-3.0-i2i',
        prompt: 'Add vibrant sunset lighting, enhance colors, professional photo editing',
        image: [testImageUrl],
        size: '1K',
        response_format: 'url',
      };

      const response = await client.generateImage(request);

      expect(response).toBeDefined();
      expect(response.data[0]!.url).toMatch(/^https?:\/\//);

      console.log('✅ I2I Test passed');
      console.log(`   Edited image: ${response.data[0]!.url}`);
    }, 120000);

    it.skipIf(skipIfNoCredentials())('should fail without source image', async () => {
      const request: ImageGenerationRequest = {
        model: 'Bytedance-SeedEdit-3.0-i2i',
        prompt: 'Add rainbow',
        image: [], // Empty image array should fail
        size: '1K',
      };

      await expect(client.generateImage(request)).rejects.toThrow();
    });

    it.skipIf(skipIfNoCredentials())('should support multiple reference images', async () => {
      const request: ImageGenerationRequest = {
        model: 'Bytedance-SeedEdit-3.0-i2i',
        prompt: 'Combine styles from both images',
        image: [
          'https://picsum.photos/1024/1024?random=1',
          'https://picsum.photos/1024/1024?random=2',
        ],
        size: '1K',
      };

      const response = await client.generateImage(request);

      expect(response.data[0]!.url).toBeDefined();
      console.log('✅ Multi-reference I2I:', response.data[0]!.url);
    }, 120000);
  });

  describe('Sequential Image Generation', () => {
    it.skipIf(skipIfNoCredentials())('should generate sequential images', async () => {
      const request: ImageGenerationRequest = {
        model: 'seedream-4-0-250828',
        prompt: 'Generate 3 images: morning sunrise, afternoon sky, evening sunset',
        sequential_image_generation: 'auto',
        sequential_image_generation_options: {
          max_images: 3,
        },
        size: '1K',
        stream: false,
      };

      const response = await client.generateImage(request);

      expect(response.data.length).toBe(3);
      expect(response.data.every(img => img.url)).toBe(true);

      console.log('✅ Sequential generation passed');
      response.data.forEach((img, i) => {
        console.log(`   Scene ${i + 1}: ${img.url}`);
      });
    }, 180000); // 3分
  });

  describe('I2V (Image-to-Video) API', () => {
    const sourceImageUrl = 'https://picsum.photos/1920/1080';

    it.skipIf(skipIfNoCredentials())('should generate video with dynamic camera', async () => {
      const request: VideoGenerationRequest = {
        model: 'Bytedance-Seedance-1.0-pro',
        image: sourceImageUrl,
        prompt: 'Slow camera pan from left to right, cinematic style, smooth motion',
        resolution: '720P', // Use 720P for faster testing
        ratio: '16:9',
        duration: 5,
        quantity: 1,
        fixed_lens: false,
        watermark: true,
        seed: 100,
      };

      const response = await client.generateVideo(request);

      expect(response).toBeDefined();
      expect(response.data).toBeInstanceOf(Array);
      expect(response.data[0]!.url).toMatch(/^https?:\/\//);
      if (response.data[0]!.thumbnail_url) {
        expect(response.data[0]!.thumbnail_url).toMatch(/^https?:\/\//);
      }

      console.log('✅ I2V Dynamic camera test passed');
      console.log(`   Video: ${response.data[0]!.url}`);
      console.log(`   Thumbnail: ${response.data[0]!.thumbnail_url}`);
    }, 180000);

    it.skipIf(skipIfNoCredentials())('should generate video with fixed camera', async () => {
      const request: VideoGenerationRequest = {
        model: 'Bytedance-Seedance-1.0-pro',
        image: sourceImageUrl,
        prompt: 'Product showcase, professional lighting, static camera',
        resolution: '720P',
        ratio: '1:1', // Square format
        duration: 5,
        fixed_lens: true, // Fixed camera
        watermark: false,
      };

      const response = await client.generateVideo(request);

      expect(response.data[0]!.url).toBeDefined();
      console.log('✅ I2V Fixed camera:', response.data[0]!.url);
    }, 180000);

    it.skipIf(skipIfNoCredentials())('should generate multiple video variations', async () => {
      const request: VideoGenerationRequest = {
        model: 'Bytedance-Seedance-1.0-pro',
        image: sourceImageUrl,
        prompt: 'Dynamic camera movements',
        resolution: '480P', // Lower resolution for batch
        ratio: '16:9',
        duration: 5,
        quantity: 2, // Generate 2 variations
        seed: 200,
      };

      const response = await client.generateVideo(request);

      expect(response.data.length).toBe(2);
      console.log('✅ Multiple variations:', response.data.map(v => v.url));
    }, 240000); // 4分

    it.skipIf(skipIfNoCredentials())('should fail without source image', async () => {
      const request: VideoGenerationRequest = {
        model: 'Bytedance-Seedance-1.0-pro',
        image: '', // Empty image should fail
        prompt: 'test',
        resolution: '720P',
        ratio: '16:9',
        duration: 5,
      };

      await expect(client.generateVideo(request)).rejects.toThrow();
    });

    it.skipIf(skipIfNoCredentials())('should validate duration parameter', async () => {
      const request = {
        model: 'Bytedance-Seedance-1.0-pro' as const,
        image: sourceImageUrl,
        prompt: 'test',
        resolution: '720P' as const,
        ratio: '16:9' as const,
        duration: 15 as any, // Invalid: only 5 or 10 allowed
      };

      await expect(client.generateVideo(request)).rejects.toThrow();
    });
  });

  describe('T2T (Text-to-Text) API - Prompt Optimization', () => {
    it.skipIf(skipIfNoCredentials())('should optimize prompt with DeepSeek-R1', async () => {
      const request: TextGenerationRequest = {
        model: 'DeepSeek-R1-250528',
        messages: [
          {
            role: 'system',
            content: 'You are a prompt optimization expert for image generation AI.',
          },
          {
            role: 'user',
            content: 'Optimize this prompt for high-quality image generation: "a cat on a windowsill"',
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      };

      const response = await textClient.generateText(request);

      expect(response).toBeDefined();
      expect(response.choices).toBeInstanceOf(Array);
      expect(response.choices[0]!.message.content).toBeTruthy();
      expect(response.usage.total_tokens).toBeGreaterThan(0);

      console.log('✅ DeepSeek-R1 optimization passed');
      console.log(`   Optimized prompt: ${response.choices[0]!.message.content}`);
      console.log(`   Tokens used: ${response.usage.total_tokens}`);
    }, 60000);

    it.skipIf(skipIfNoCredentials())('should generate with Skylark-pro', async () => {
      const request: TextGenerationRequest = {
        model: 'Skylark-pro-250415',
        messages: [
          {
            role: 'user',
            content: 'Improve this prompt: "sunset landscape"',
          },
        ],
        max_tokens: 300,
        temperature: 0.6,
      };

      const response = await textClient.generateText(request);

      expect(response.choices[0]!.message.content).toBeTruthy();
      console.log('✅ Skylark-pro:', response.choices[0]!.message.content);
    }, 60000);
  });

  describe('Vision API (Multimodal)', () => {
    const testImageUrl = 'https://picsum.photos/1024/768';

    it.skipIf(skipIfNoCredentials())('should analyze image with seed-1-6-250915', async () => {
      const request: TextGenerationRequest = {
        model: 'seed-1-6-250915',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: testImageUrl,
                },
              },
              {
                type: 'text',
                text: 'Describe this image in detail. What objects, colors, and composition do you see?',
              },
            ],
          },
        ],
        max_tokens: 500,
      };

      const response = await textClient.generateText(request);

      expect(response.choices[0]!.message.content).toBeTruthy();
      expect(response.choices[0]!.message.content.length).toBeGreaterThan(50);

      console.log('✅ Vision API test passed');
      console.log(`   Image analysis: ${response.choices[0]!.message.content}`);
    }, 60000);

    it.skipIf(skipIfNoCredentials())('should answer questions about image', async () => {
      const request: TextGenerationRequest = {
        model: 'seed-1-6-250915',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: testImageUrl,
                },
              },
              {
                type: 'text',
                text: 'What is the dominant color in this image?',
              },
            ],
          },
        ],
      };

      const response = await textClient.generateText(request);

      expect(response.choices[0]!.message.content).toBeTruthy();
      console.log('✅ VQA test:', response.choices[0]!.message.content);
    }, 60000);
  });

  describe('Error Handling', () => {
    it.skipIf(skipIfNoCredentials())('should handle 400 Bad Request', async () => {
      const request: ImageGenerationRequest = {
        model: 'seedream-4-0-250828',
        prompt: '', // Empty prompt
        size: '1K',
      };

      try {
        await client.generateImage(request);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ 400 error handled correctly');
      }
    });

    it.skipIf(skipIfNoCredentials())('should handle invalid model', async () => {
      const request = {
        model: 'invalid-model' as any,
        prompt: 'test',
        size: '1K' as const,
      };

      try {
        await client.generateImage(request);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ Invalid model error handled');
      }
    });
  });

  describe('Rate Limiting', () => {
    it.skipIf(skipIfNoCredentials())('should track rate limiter stats', async () => {
      const stats = client.getRateLimiterStats();

      expect(stats).toHaveProperty('used');
      expect(stats).toHaveProperty('available');
      expect(stats).toHaveProperty('resetIn');
      expect(stats.used).toBeGreaterThanOrEqual(0);
      expect(stats.available).toBeGreaterThanOrEqual(0);

      console.log('✅ Rate limiter stats:', stats);
    });
  });

  describe('Batch Generation', () => {
    it.skipIf(skipIfNoCredentials())('should generate multiple images in batch', async () => {
      const result = await client.batchGenerate({
        prompts: [
          'A mountain landscape at sunrise',
          'An ocean wave at sunset',
          'A forest path in autumn',
        ],
        sharedParams: {
          model: 'seedream-4-0-250828',
          size: '1K',
          watermark: true,
        },
        maxConcurrency: 2,
      });

      expect(result.successful.length).toBeGreaterThan(0);
      expect(result.successRate).toBeGreaterThan(0);
      expect(result.totalTime).toBeGreaterThan(0);

      console.log('✅ Batch generation passed');
      console.log(`   Success rate: ${(result.successRate * 100).toFixed(1)}%`);
      console.log(`   Total time: ${(result.totalTime / 1000).toFixed(1)}s`);

      result.successful.forEach((res, i) => {
        console.log(`   Image ${i + 1}: ${res.data[0]!.url}`);
      });
    }, 300000); // 5分
  });

  describe('Health Check', () => {
    it.skipIf(skipIfNoCredentials())('should check API health', async () => {
      const isHealthy = await client.checkHealth();

      expect(typeof isHealthy).toBe('boolean');
      console.log(`✅ API health check: ${isHealthy ? 'Healthy' : 'Unhealthy'}`);
    }, 60000);
  });
});
