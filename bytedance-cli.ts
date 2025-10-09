#!/usr/bin/env node
/**
 * ByteDance Agent CLI
 *
 * Command-line interface for ByteDance Agent operations
 *
 * Usage:
 *   npx tsx bytedance-cli.ts image "prompt" [--size 2K] [--optimize]
 *   npx tsx bytedance-cli.ts video <imageUrl> "prompt" [--resolution 1080p]
 *   npx tsx bytedance-cli.ts story "story prompt" [--scenes 4] [--videos]
 *   npx tsx bytedance-cli.ts batch <config.json>
 */

import { ByteDanceAgent, AgentTask } from './src/agents/bytedance-agent.js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

config();

const HELP_TEXT = `
ByteDance Agent CLI - Autonomous BytePlus API Operations

USAGE:
  bytedance-cli.ts <command> [options]

COMMANDS:
  image <prompt>                Generate single image
    --size <2K|4K>             Image size (default: 2K)
    --optimize                 Optimize prompt with AI

  video <imageUrl> <prompt>    Generate video from image
    --resolution <480p|720p|1080p>  Video resolution (default: 1080p)
    --duration <seconds>       Video duration (default: 5)
    --fixed                    Use fixed camera (default: false)

  story <prompt>               Generate multi-scene story
    --scenes <number>          Number of scenes (default: 4)
    --videos                   Generate videos for each scene

  batch <config.json>          Batch generation from config file

EXAMPLES:
  # Generate optimized image
  bytedance-cli.ts image "sunset over mountains" --optimize

  # Generate video from image
  bytedance-cli.ts video "https://..." "slow zoom in" --resolution 1080p

  # Generate 4-scene story with videos
  bytedance-cli.ts story "grandmother becomes gamer" --scenes 4 --videos

  # Batch generation
  bytedance-cli.ts batch ./batch-config.json

ENVIRONMENT:
  BYTEPLUS_API_KEY    BytePlus API key (required)
  BYTEPLUS_ENDPOINT   BytePlus API endpoint (required)

DOCUMENTATION:
  .claude/agents/bytedance-agent.md
  NEW_VIDEO_API_IMPLEMENTATION.md
  BYTEPLUS_BEST_PRACTICES.md
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  // Validate environment
  if (!process.env.BYTEPLUS_API_KEY || !process.env.BYTEPLUS_ENDPOINT) {
    console.error('❌ Error: BYTEPLUS_API_KEY and BYTEPLUS_ENDPOINT must be set');
    console.error('   Add them to your .env file');
    process.exit(1);
  }

  const command = args[0];
  const agent = new ByteDanceAgent({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    outputDir: './agent-output',
    debug: false
  });

  try {
    switch (command) {
      case 'image':
        await handleImageCommand(agent, args.slice(1));
        break;
      case 'video':
        await handleVideoCommand(agent, args.slice(1));
        break;
      case 'story':
        await handleStoryCommand(agent, args.slice(1));
        break;
      case 'batch':
        await handleBatchCommand(agent, args.slice(1));
        break;
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log(HELP_TEXT);
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function handleImageCommand(agent: ByteDanceAgent, args: string[]) {
  const prompt = args[0];
  if (!prompt) {
    console.error('❌ Error: Prompt is required');
    console.log('Usage: image <prompt> [--size 2K] [--optimize]');
    process.exit(1);
  }

  const size = getFlag(args, '--size', '2K');
  const optimize = hasFlag(args, '--optimize');

  console.log('🎨 Generating image...');
  console.log(`   Prompt: ${prompt}`);
  console.log(`   Size: ${size}`);
  console.log(`   Optimize: ${optimize ? 'Yes' : 'No'}`);
  console.log();

  const task: AgentTask = {
    id: `image-${Date.now()}`,
    type: 'image',
    priority: 'P1',
    params: { prompt, size, optimizePrompt: optimize }
  };

  const result = await agent.execute(task);

  if (result.status === 'success') {
    console.log('✅ Image generated successfully!');
    console.log(`   URL: ${result.assets[0].url}`);
    console.log(`   Seed: ${result.assets[0].seed}`);
    console.log(`   Time: ${(result.metrics.totalTime / 1000).toFixed(1)}s`);
  } else {
    console.error('❌ Image generation failed');
    console.error(`   Errors: ${result.errors?.join(', ')}`);
  }
}

async function handleVideoCommand(agent: ByteDanceAgent, args: string[]) {
  const imageUrl = args[0];
  const prompt = args[1];

  if (!imageUrl || !prompt) {
    console.error('❌ Error: Image URL and prompt are required');
    console.log('Usage: video <imageUrl> <prompt> [--resolution 1080p] [--duration 5] [--fixed]');
    process.exit(1);
  }

  const resolution = getFlag(args, '--resolution', '1080p');
  const duration = parseInt(getFlag(args, '--duration', '5'));
  const camerafixed = hasFlag(args, '--fixed');

  console.log('🎬 Generating video...');
  console.log(`   Image: ${imageUrl}`);
  console.log(`   Prompt: ${prompt}`);
  console.log(`   Resolution: ${resolution}`);
  console.log(`   Duration: ${duration}s`);
  console.log(`   Camera: ${camerafixed ? 'Fixed' : 'Dynamic'}`);
  console.log();

  const task: AgentTask = {
    id: `video-${Date.now()}`,
    type: 'video',
    priority: 'P1',
    params: { imageUrl, prompt, resolution, duration, camerafixed }
  };

  const result = await agent.execute(task);

  if (result.status === 'success') {
    console.log('✅ Video generated successfully!');
    console.log(`   URL: ${result.assets[0].url}`);
    console.log(`   Generation time: ${result.assets[0].generationTime}ms`);
    console.log(`   Total time: ${(result.metrics.totalTime / 1000).toFixed(1)}s`);
  } else {
    console.error('❌ Video generation failed');
    console.error(`   Errors: ${result.errors?.join(', ')}`);
  }
}

async function handleStoryCommand(agent: ByteDanceAgent, args: string[]) {
  const storyPrompt = args[0];
  if (!storyPrompt) {
    console.error('❌ Error: Story prompt is required');
    console.log('Usage: story <prompt> [--scenes 4] [--videos]');
    process.exit(1);
  }

  const numScenes = parseInt(getFlag(args, '--scenes', '4'));
  const generateVideos = hasFlag(args, '--videos');

  console.log('📖 Generating story...');
  console.log(`   Prompt: ${storyPrompt}`);
  console.log(`   Scenes: ${numScenes}`);
  console.log(`   Generate videos: ${generateVideos ? 'Yes' : 'No'}`);
  console.log();

  const task: AgentTask = {
    id: `story-${Date.now()}`,
    type: 'story',
    priority: 'P0',
    params: { storyPrompt, numScenes, size: '2K', generateVideos }
  };

  const result = await agent.execute(task);

  if (result.status === 'success' || result.status === 'partial') {
    console.log(`${result.status === 'success' ? '✅' : '⚠️'} Story generated!`);
    console.log(`   Assets: ${result.assets.length}`);
    console.log(`   Success rate: ${(result.metrics.successRate * 100).toFixed(1)}%`);
    console.log(`   Total time: ${(result.metrics.totalTime / 1000).toFixed(1)}s`);
    console.log();

    const images = result.assets.filter(a => a.type === 'image');
    const videos = result.assets.filter(a => a.type === 'video');

    console.log(`   Images: ${images.length}`);
    images.forEach((asset, i) => {
      console.log(`   Scene ${i + 1}: ${asset.url}`);
    });

    if (videos.length > 0) {
      console.log();
      console.log(`   Videos: ${videos.length}`);
      videos.forEach((asset, i) => {
        console.log(`   Scene ${i + 1}: ${asset.url}`);
      });
    }

    if (result.errors && result.errors.length > 0) {
      console.log();
      console.log('   Errors:');
      result.errors.forEach(error => console.log(`   - ${error}`));
    }
  } else {
    console.error('❌ Story generation failed');
    console.error(`   Errors: ${result.errors?.join(', ')}`);
  }
}

async function handleBatchCommand(agent: ByteDanceAgent, args: string[]) {
  const configPath = args[0];
  if (!configPath) {
    console.error('❌ Error: Config file path is required');
    console.log('Usage: batch <config.json>');
    process.exit(1);
  }

  console.log('📦 Loading batch config...');
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));

  console.log(`   Items: ${config.items.length}`);
  console.log(`   Max concurrency: ${config.maxConcurrency || 5}`);
  console.log();

  const task: AgentTask = {
    id: `batch-${Date.now()}`,
    type: 'batch',
    priority: 'P2',
    params: config
  };

  const result = await agent.execute(task);

  if (result.status === 'success' || result.status === 'partial') {
    console.log(`${result.status === 'success' ? '✅' : '⚠️'} Batch completed!`);
    console.log(`   Assets: ${result.assets.length}/${config.items.length}`);
    console.log(`   Success rate: ${(result.metrics.successRate * 100).toFixed(1)}%`);
    console.log(`   Total time: ${(result.metrics.totalTime / 1000).toFixed(1)}s`);

    if (result.errors && result.errors.length > 0) {
      console.log();
      console.log('   Errors:');
      result.errors.forEach(error => console.log(`   - ${error}`));
    }
  } else {
    console.error('❌ Batch generation failed');
    console.error(`   Errors: ${result.errors?.join(', ')}`);
  }
}

function getFlag(args: string[], flag: string, defaultValue: string): string {
  const index = args.indexOf(flag);
  if (index === -1 || index === args.length - 1) {
    return defaultValue;
  }
  return args[index + 1];
}

function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag);
}

main();
