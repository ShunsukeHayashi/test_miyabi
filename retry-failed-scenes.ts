/**
 * Retry only failed gamer grandma scenes
 *
 * Run: npx tsx retry-failed-scenes.ts
 */

import { BytePlusAI } from './src/api/byteplus-ai.js';
import { config } from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';

config();

async function retryFailedScenes() {
  console.log('🔄 Retrying failed scenes...\n');

  const assetsPath = './gamer-grandma-output/GENERATED_ASSETS.json';
  const assets = JSON.parse(readFileSync(assetsPath, 'utf-8'));

  const failedScenes = assets.scenes.filter((scene: any) =>
    scene.videoStatus?.includes('Failed')
  );

  console.log(`Found ${failedScenes.length} failed scenes to retry\n`);

  const ai = new BytePlusAI({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
    debug: false
  });

  for (const scene of failedScenes) {
    console.log(`🎬 Scene ${scene.sceneId}: ${scene.name}`);

    const cameraPrompt = getCameraPrompt(scene.purpose);

    try {
      const video = await ai.generateVideo({
        model: 'seedance-1-0-pro-250528',
        image: scene.imageUrl,
        prompt: cameraPrompt,
        resolution: '1080p',
        duration: 5,
        camerafixed: false
      });

      console.log(`   ✅ Success!`);
      console.log(`   📹 ${video.data[0].url}\n`);

      // Update in main assets array
      const sceneIndex = assets.scenes.findIndex((s: any) => s.sceneId === scene.sceneId);
      assets.scenes[sceneIndex].videoStatus = 'Success - Task API';
      assets.scenes[sceneIndex].videoUrl = video.data[0].url;
      assets.scenes[sceneIndex].seed = video.seed;

    } catch (error) {
      console.log(`   ❌ Still failed: ${error instanceof Error ? error.message : error}\n`);
    }

    // Wait 2s between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Update stats
  const successCount = assets.scenes.filter((s: any) =>
    s.videoStatus?.includes('Success')
  ).length;

  assets.apiStatus.i2v.videosGenerated = successCount;
  assets.apiStatus.i2v.successRate = `${((successCount / assets.scenes.length) * 100).toFixed(1)}%`;

  writeFileSync(assetsPath, JSON.stringify(assets, null, 2));

  console.log('═'.repeat(60));
  console.log(`✅ Success: ${successCount}/${assets.scenes.length} scenes`);
  console.log(`📝 Updated: ${assetsPath}`);
  console.log('═'.repeat(60));
}

function getCameraPrompt(purpose: string): string {
  const p = purpose.toLowerCase();
  if (p.includes('transformation')) {
    return 'Dynamic zoom in to face, dramatic lighting change, cinematic intensity, smooth transition';
  } else if (p.includes('intensity') || p.includes('peak')) {
    return 'Subtle camera shake, intense close-up, dynamic lighting flicker, high energy movement';
  } else if (p.includes('victory') || p.includes('climax')) {
    return 'Dramatic upward camera movement, celebration energy, dynamic pan, cinematic triumph';
  }
  return 'Subtle camera movement, cinematic style, professional lighting, smooth motion';
}

retryFailedScenes().catch(console.error);
