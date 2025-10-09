/**
 * ByteDance Agent - Autonomous BytePlus API Operations
 *
 * Handles all BytePlus/ByteDance API operations:
 * - Image generation (T2I, I2I)
 * - Video generation (I2V)
 * - Prompt optimization (T2T)
 * - Asset management
 *
 * Part of Miyabi Framework
 */

import { BytePlusAI } from '../api/byteplus-ai.js';
import { PromptOptimizer } from '../services/prompt-optimizer.js';
import { PromptChain } from '../services/prompt-chain.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export interface AgentTask {
  id: string;
  type: 'image' | 'video' | 'story' | 'batch';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  params: any;
  metadata?: Record<string, any>;
}

export interface AgentResult {
  taskId: string;
  status: 'success' | 'failed' | 'partial';
  assets: GeneratedAsset[];
  errors?: string[];
  metrics: {
    totalTime: number;
    successRate: number;
    totalCost?: number;
  };
}

export interface GeneratedAsset {
  type: 'image' | 'video';
  url: string;
  seed?: number;
  prompt: string;
  generationTime?: number;
  metadata?: Record<string, any>;
}

export class ByteDanceAgent {
  private ai: BytePlusAI;
  private optimizer: PromptOptimizer;
  private chain: PromptChain;
  private outputDir: string;

  constructor(config: {
    apiKey: string;
    endpoint: string;
    outputDir?: string;
    debug?: boolean;
  }) {
    this.ai = new BytePlusAI({
      apiKey: config.apiKey,
      endpoint: config.endpoint,
      debug: config.debug ?? false
    });

    this.optimizer = new PromptOptimizer({
      apiKey: config.apiKey,
      endpoint: config.endpoint
    });

    this.chain = new PromptChain({
      apiKey: config.apiKey,
      endpoint: config.endpoint
    });

    this.outputDir = config.outputDir ?? './output';

    // Ensure output directory exists
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Execute an agent task autonomously
   */
  async execute(task: AgentTask): Promise<AgentResult> {
    this.log(`[ByteDanceAgent] Starting task: ${task.id} (${task.type})`);

    const startTime = Date.now();

    try {
      let result: AgentResult;

      switch (task.type) {
        case 'image':
          result = await this.executeImageGeneration(task);
          break;
        case 'video':
          result = await this.executeVideoGeneration(task);
          break;
        case 'story':
          result = await this.executeStoryGeneration(task);
          break;
        case 'batch':
          result = await this.executeBatchGeneration(task);
          break;
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }

      result.metrics.totalTime = Date.now() - startTime;

      // Save result
      this.saveResult(task.id, result);

      this.log(
        `[ByteDanceAgent] Task completed: ${task.id} (${result.status})`
      );

      return result;
    } catch (error) {
      this.log(
        `[ByteDanceAgent] Task failed: ${task.id} - ${error instanceof Error ? error.message : error}`
      );

      const result: AgentResult = {
        taskId: task.id,
        status: 'failed',
        assets: [],
        errors: [error instanceof Error ? error.message : String(error)],
        metrics: {
          totalTime: Date.now() - startTime,
          successRate: 0
        }
      };

      this.saveResult(task.id, result);

      return result;
    }
  }

  /**
   * Generate single image
   */
  private async executeImageGeneration(
    task: AgentTask
  ): Promise<AgentResult> {
    const { prompt, size = '2K', optimizePrompt = false } = task.params;

    let finalPrompt = prompt;

    // Optimize prompt if requested
    if (optimizePrompt) {
      this.log('[ByteDanceAgent] Optimizing prompt...');
      finalPrompt = await this.optimizer.optimizeForImage(prompt);
    }

    this.log('[ByteDanceAgent] Generating image...');

    const image = await this.ai.generateImage({
      model: 'seedream-4-0-250828',
      prompt: finalPrompt,
      size,
      watermark: false
    });

    return {
      taskId: task.id,
      status: 'success',
      assets: [
        {
          type: 'image',
          url: image.data[0].url,
          seed: image.seed,
          prompt: finalPrompt
        }
      ],
      metrics: {
        totalTime: 0, // Set by caller
        successRate: 1.0
      }
    };
  }

  /**
   * Generate video from image
   */
  private async executeVideoGeneration(
    task: AgentTask
  ): Promise<AgentResult> {
    const {
      imageUrl,
      prompt,
      resolution = '1080p',
      duration = 5,
      camerafixed = false
    } = task.params;

    this.log('[ByteDanceAgent] Generating video...');

    const video = await this.ai.generateVideo({
      model: 'seedance-1-0-pro-250528',
      image: imageUrl,
      prompt,
      resolution,
      duration,
      camerafixed
    });

    return {
      taskId: task.id,
      status: 'success',
      assets: [
        {
          type: 'video',
          url: video.data[0].url,
          seed: video.seed,
          prompt,
          generationTime: video.metadata?.generationTime
        }
      ],
      metrics: {
        totalTime: 0,
        successRate: 1.0
      }
    };
  }

  /**
   * Generate multi-scene story
   */
  private async executeStoryGeneration(
    task: AgentTask
  ): Promise<AgentResult> {
    const {
      storyPrompt,
      numScenes = 4,
      size = '2K',
      generateVideos = false
    } = task.params;

    this.log(
      `[ByteDanceAgent] Generating ${numScenes}-scene story...`
    );

    const assets: GeneratedAsset[] = [];
    const errors: string[] = [];

    // Generate sequential images
    const images = await this.ai.generateStory(storyPrompt, numScenes, {
      model: 'seedream-4-0-250828',
      size,
      watermark: false
    });

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      assets.push({
        type: 'image',
        url: image.data[0].url,
        seed: image.seed,
        prompt: image.metadata?.prompt || storyPrompt,
        metadata: { sceneId: i + 1 }
      });

      // Generate video if requested
      if (generateVideos) {
        try {
          const cameraPrompt = this.getCameraPromptForScene(i, numScenes);

          const video = await this.ai.generateVideo({
            model: 'seedance-1-0-pro-250528',
            image: image.data[0].url,
            prompt: cameraPrompt,
            resolution: '1080p',
            duration: 5,
            camerafixed: false
          });

          assets.push({
            type: 'video',
            url: video.data[0].url,
            seed: video.seed,
            prompt: cameraPrompt,
            generationTime: video.metadata?.generationTime,
            metadata: { sceneId: i + 1 }
          });
        } catch (error) {
          errors.push(
            `Scene ${i + 1} video failed: ${error instanceof Error ? error.message : error}`
          );
        }
      }
    }

    return {
      taskId: task.id,
      status: errors.length === 0 ? 'success' : 'partial',
      assets,
      errors: errors.length > 0 ? errors : undefined,
      metrics: {
        totalTime: 0,
        successRate: assets.length / (numScenes * (generateVideos ? 2 : 1))
      }
    };
  }

  /**
   * Batch generation with concurrency control
   */
  private async executeBatchGeneration(
    task: AgentTask
  ): Promise<AgentResult> {
    const { items, maxConcurrency = 5 } = task.params;

    this.log(
      `[ByteDanceAgent] Batch generating ${items.length} items (max ${maxConcurrency} concurrent)...`
    );

    const assets: GeneratedAsset[] = [];
    const errors: string[] = [];

    // Process in batches
    for (let i = 0; i < items.length; i += maxConcurrency) {
      const batch = items.slice(i, i + maxConcurrency);

      const results = await Promise.allSettled(
        batch.map((item: any) =>
          this.generateSingleAsset(item.type, item.params)
        )
      );

      results.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          assets.push(result.value);
        } else {
          errors.push(
            `Item ${i + idx + 1} failed: ${result.reason}`
          );
        }
      });
    }

    return {
      taskId: task.id,
      status: errors.length === 0 ? 'success' : 'partial',
      assets,
      errors: errors.length > 0 ? errors : undefined,
      metrics: {
        totalTime: 0,
        successRate: assets.length / items.length
      }
    };
  }

  /**
   * Generate single asset (helper for batch)
   */
  private async generateSingleAsset(
    type: 'image' | 'video',
    params: any
  ): Promise<GeneratedAsset> {
    if (type === 'image') {
      const image = await this.ai.generateImage({
        model: 'seedream-4-0-250828',
        prompt: params.prompt,
        size: params.size || '2K',
        watermark: false
      });

      return {
        type: 'image',
        url: image.data[0].url,
        seed: image.seed,
        prompt: params.prompt
      };
    } else {
      const video = await this.ai.generateVideo({
        model: 'seedance-1-0-pro-250528',
        image: params.imageUrl,
        prompt: params.prompt,
        resolution: params.resolution || '1080p',
        duration: params.duration || 5,
        camerafixed: params.camerafixed ?? false
      });

      return {
        type: 'video',
        url: video.data[0].url,
        seed: video.seed,
        prompt: params.prompt,
        generationTime: video.metadata?.generationTime
      };
    }
  }

  /**
   * Get appropriate camera prompt for story scene
   */
  private getCameraPromptForScene(
    sceneIndex: number,
    totalScenes: number
  ): string {
    if (sceneIndex === 0) {
      return 'Slow gentle zoom in, establishing shot, smooth cinematic movement, professional lighting';
    } else if (sceneIndex === totalScenes - 1) {
      return 'Slow gentle zoom out, peaceful resolution, smooth cinematic ending, return to calm';
    } else if (sceneIndex === 1) {
      return 'Dynamic zoom in to face, dramatic lighting change, cinematic intensity, smooth transition';
    } else {
      return 'Subtle camera movement, dynamic lighting, cinematic style, professional framing';
    }
  }

  /**
   * Save result to output directory
   */
  private saveResult(taskId: string, result: AgentResult): void {
    const outputPath = join(this.outputDir, `${taskId}-result.json`);
    writeFileSync(outputPath, JSON.stringify(result, null, 2));
    this.log(`[ByteDanceAgent] Result saved: ${outputPath}`);
  }

  /**
   * Log message
   */
  private log(message: string): void {
    console.log(message);
  }
}

/**
 * Example usage
 */
export async function runByteDanceAgent() {
  const agent = new ByteDanceAgent({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    outputDir: './agent-output',
    debug: true
  });

  // Example: Generate single image
  const imageTask: AgentTask = {
    id: 'task-image-001',
    type: 'image',
    priority: 'P1',
    params: {
      prompt: 'A beautiful sunset over mountains',
      size: '2K',
      optimizePrompt: true
    }
  };

  const imageResult = await agent.execute(imageTask);
  console.log('Image result:', imageResult);

  // Example: Generate story with videos
  const storyTask: AgentTask = {
    id: 'task-story-001',
    type: 'story',
    priority: 'P0',
    params: {
      storyPrompt: 'A grandmother transforms into a gamer',
      numScenes: 4,
      size: '2K',
      generateVideos: true
    }
  };

  const storyResult = await agent.execute(storyTask);
  console.log('Story result:', storyResult);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runByteDanceAgent().catch(console.error);
}
