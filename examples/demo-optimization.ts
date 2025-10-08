/**
 * Byteflow - Prompt Optimization Demo
 *
 * Demonstrates AI-powered prompt optimization using T2T models.
 *
 * @example
 * ts-node examples/demo-optimization.ts
 */

import 'dotenv/config';
import { BytePlusAI } from '../src/api/byteplus-ai.js';
import { PromptOptimizer } from '../src/services/prompt-optimizer.js';

async function main() {
  console.log('🤖 Byteflow - Prompt Optimization Demo\n');

  // Initialize unified AI client
  const ai = new BytePlusAI({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    debug: true,
  });

  // Example 1: Simple prompt optimization
  console.log('✨ Example 1: Simple Prompt Optimization\n');
  const simplePrompt = 'a beautiful sunset';
  console.log(`Original: "${simplePrompt}"`);

  try {
    const optimized = await ai.optimizePrompt(simplePrompt, 't2i');
    console.log(`Optimized: "${optimized}"`);
    console.log();
  } catch (error) {
    console.error('❌ Optimization failed:', error);
  }

  // Example 2: Image generation with automatic optimization
  console.log('📸 Example 2: Auto-Optimized Image Generation\n');
  try {
    const result = await ai.generateImage(
      {
        model: 'seedream-4-0-250828',
        prompt: 'a cat on a windowsill', // Simple input
        size: '2K',
      },
      { optimizePrompt: true } // Auto-optimize
    );

    console.log('✅ Image generated with optimized prompt!');
    console.log(`   URL: ${result.data[0]?.url}`);
    console.log();
  } catch (error) {
    console.error('❌ Generation failed:', error);
  }

  // Example 3: Image editing with optimization
  console.log('🎨 Example 3: Optimized Image Editing\n');
  try {
    const editResult = await ai.editImage(
      {
        model: 'Bytedance-SeedEdit-3.0-i2i',
        prompt: 'add rainbow', // Simple edit instruction
        image: ['https://example.com/original.jpg'],
        size: '2K',
      },
      { optimizePrompt: true }
    );

    console.log('✅ Image edited with optimized prompt!');
    console.log(`   URL: ${editResult.data[0]?.url}`);
    console.log();
  } catch (error) {
    console.error('❌ Editing failed:', error);
  }

  // Example 4: Video generation with optimization
  console.log('🎬 Example 4: Optimized Video Generation\n');
  try {
    const videoResult = await ai.generateVideo(
      {
        model: 'Bytedance-Seedance-1.0-pro',
        image: 'https://example.com/source.jpg',
        prompt: 'smooth camera pan', // Simple motion description
        resolution: '1080P',
        duration: 5,
      },
      { optimizePrompt: true }
    );

    console.log('✅ Video generated with optimized prompt!');
    console.log(`   URL: ${videoResult.data[0]?.url}`);
    console.log();
  } catch (error) {
    console.error('❌ Video generation failed:', error);
  }

  // Example 5: Manual optimization with PromptOptimizer
  console.log('🔧 Example 5: Manual Prompt Optimization\n');
  const optimizer = new PromptOptimizer({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
  });

  try {
    // Optimize for different use cases
    const [t2iPrompt, i2iPrompt, i2vPrompt] = await Promise.all([
      optimizer.optimizeForImage('cyberpunk city', 'photorealistic'),
      optimizer.optimizeForImageEdit('enhance lighting'),
      optimizer.optimizeForVideo('dramatic camera zoom'),
    ]);

    console.log('Text-to-Image prompt:');
    console.log(`  ${t2iPrompt}\n`);

    console.log('Image-to-Image prompt:');
    console.log(`  ${i2iPrompt}\n`);

    console.log('Image-to-Video prompt:');
    console.log(`  ${i2vPrompt}\n`);
  } catch (error) {
    console.error('❌ Manual optimization failed:', error);
  }

  console.log('🎉 Demo completed!');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
