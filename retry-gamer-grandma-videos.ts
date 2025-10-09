/**
 * Retry Gamer Grandma Video Generation
 *
 * Uses new BytePlus seedance-1-0-pro-250528 task-based API
 * to generate videos for all 7 scenes with proper I2V workflow.
 *
 * Run: npx tsx retry-gamer-grandma-videos.ts
 */

import { BytePlusAI } from './src/api/byteplus-ai.js';
import { config } from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';

config();

interface Scene {
  sceneId: number;
  name: string;
  timing: string;
  purpose: string;
  imageUrl: string;
  localFile: string;
  prompt: string;
  dialogue: {
    romaji: string;
    japanese: string;
    english: string;
  };
  videoStatus: string;
  size: string;
}

interface GeneratedAssets {
  scenes: Scene[];
  [key: string]: any;
}

async function retryVideos() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║     Retry Gamer Grandma Video Generation (New Task API)         ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log();

  // Load existing assets
  const assetsPath = './gamer-grandma-output/GENERATED_ASSETS.json';
  const assets: GeneratedAssets = JSON.parse(readFileSync(assetsPath, 'utf-8'));

  console.log(`📋 Found ${assets.scenes.length} scenes to process`);
  console.log();

  const ai = new BytePlusAI({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    debug: false
  });

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const scene of assets.scenes) {
    console.log('─'.repeat(70));
    console.log(`🎬 Scene ${scene.sceneId}: ${scene.name}`);
    console.log(`   Timing: ${scene.timing}`);
    console.log(`   Image: ${scene.imageUrl}`);
    console.log();

    try {
      // Convert I2V prompt to camera movement description
      const cameraPrompt = convertToVideoPrompt(scene.prompt, scene.purpose);

      console.log(`   📝 Video prompt: ${cameraPrompt}`);
      console.log(`   ⏳ Generating video (this takes ~40-50 seconds)...`);

      const startTime = Date.now();

      const video = await ai.generateVideo({
        model: 'seedance-1-0-pro-250528',
        image: scene.imageUrl,
        prompt: cameraPrompt,
        resolution: '1080p',
        duration: 5,
        camerafixed: false // Dynamic camera for TikTok engagement
      });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(`   ✅ Success! Generated in ${elapsed}s`);
      console.log(`   📹 Video URL: ${video.data[0].url}`);
      console.log();

      // Update scene data
      scene.videoStatus = 'Success - Task API';
      (scene as any).videoUrl = video.data[0].url;
      (scene as any).generationTime = `${elapsed}s`;
      (scene as any).seed = video.seed;

      successCount++;
      results.push({
        sceneId: scene.sceneId,
        status: 'success',
        videoUrl: video.data[0].url,
        generationTime: elapsed
      });

    } catch (error) {
      console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
      console.log();

      scene.videoStatus = `Failed - ${error instanceof Error ? error.message : 'Unknown error'}`;
      failCount++;
      results.push({
        sceneId: scene.sceneId,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Update assets file
  assets.apiStatus.i2v = {
    model: 'seedance-1-0-pro-250528',
    status: successCount > 0 ? '✅ Working (Task API)' : '❌ Failed',
    videosGenerated: successCount,
    successRate: `${((successCount / assets.scenes.length) * 100).toFixed(1)}%`
  };

  writeFileSync(assetsPath, JSON.stringify(assets, null, 2));

  // Save results summary
  const summaryPath = './gamer-grandma-output/VIDEO_GENERATION_RESULTS.json';
  writeFileSync(summaryPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    model: 'seedance-1-0-pro-250528',
    totalScenes: assets.scenes.length,
    successCount,
    failCount,
    successRate: `${((successCount / assets.scenes.length) * 100).toFixed(1)}%`,
    results
  }, null, 2));

  console.log('═'.repeat(70));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(70));
  console.log(`   Total scenes: ${assets.scenes.length}`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   Success rate: ${((successCount / assets.scenes.length) * 100).toFixed(1)}%`);
  console.log();
  console.log(`   📝 Updated: ${assetsPath}`);
  console.log(`   📝 Results: ${summaryPath}`);
  console.log();

  if (successCount === assets.scenes.length) {
    console.log('🎉 All videos generated successfully!');
    console.log('   Next steps:');
    console.log('   1. Download videos (URLs valid for 24 hours)');
    console.log('   2. Add dialogue voiceovers');
    console.log('   3. Add BGM and sound effects');
    console.log('   4. Export as 9:16 vertical video');
    console.log('   5. Post to TikTok (19:00-23:00 JST recommended)');
  } else if (successCount > 0) {
    console.log('⚠️  Partial success. Some videos need retry.');
  } else {
    console.log('❌ All videos failed. Check API credentials and endpoints.');
  }
  console.log();
}

/**
 * Convert image generation prompt to video camera movement prompt
 */
function convertToVideoPrompt(imagePrompt: string, purpose: string): string {
  // Analyze purpose to determine camera movement
  const purposeLower = purpose.toLowerCase();

  if (purposeLower.includes('hook') || purposeLower.includes('establish')) {
    // Opening scene - slow reveal
    return 'Slow gentle zoom in, establishing shot, smooth cinematic movement, professional lighting';
  } else if (purposeLower.includes('transformation')) {
    // Transformation - dramatic zoom
    return 'Dynamic zoom in to face, dramatic lighting change, cinematic intensity, smooth transition';
  } else if (purposeLower.includes('intensity') || purposeLower.includes('peak')) {
    // Intense gaming - shaky cam
    return 'Subtle camera shake, intense close-up, dynamic lighting flicker, high energy movement';
  } else if (purposeLower.includes('victory') || purposeLower.includes('climax')) {
    // Victory moment - dynamic pan
    return 'Dramatic upward camera movement, celebration energy, dynamic pan, cinematic triumph';
  } else if (purposeLower.includes('comedy') || purposeLower.includes('trash talk')) {
    // Comedy - tilted angle
    return 'Dynamic side-to-side camera movement, comedic Dutch angle, expressive framing';
  } else if (purposeLower.includes('resolution') || purposeLower.includes('calming')) {
    // Calming down - slow zoom out
    return 'Slow zoom out, tension release, smooth deceleration, professional framing';
  } else if (purposeLower.includes('outro') || purposeLower.includes('loop')) {
    // Outro - mirror opening
    return 'Slow gentle zoom out, peaceful resolution, smooth cinematic ending, return to calm';
  }

  // Default: subtle movement
  return 'Subtle camera movement, cinematic style, professional lighting, smooth motion';
}

retryVideos().catch(console.error);
