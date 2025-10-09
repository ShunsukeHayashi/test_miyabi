#!/usr/bin/env tsx

/**
 * Regenerate Scene 6 and 7 (403 errors on URLs)
 */

import { BytePlusClient } from './src/api/byteplus-client.js';
import fs from 'fs/promises';
import fsSync from 'fs';
import https from 'https';
import path from 'path';

const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!,
  debug: true,
});

const OUTPUT_DIR = './gamer-grandma-output';
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');

const MISSING_SCENES = [
  {
    id: 6,
    name: 'Game Over',
    prompt: `Elderly Japanese woman (70s) removing RGB gaming headset slowly with both hands.
Gaming monitor in background showing victory or defeat screen with glowing blue light.
Her previously intense gaming expression is now softening, relaxing.
Deep breath with shoulders dropping. Slight sweat on forehead.
Cardigan slightly disheveled, reading glasses askew.
Cozy Japanese living room setting. Warm and cool lighting mix.
Photorealistic, 4K quality, cinematic lighting, 9:16 vertical composition.`,
    seed: 600,
    localFile: 'scene-06-game-over.jpeg',
  },
  {
    id: 7,
    name: 'Return to Peace',
    prompt: `Same cozy Japanese living room from opening scene. Soft afternoon sunlight filtering through shoji screens.
Elderly Japanese woman (70s) back on zabuton cushion in traditional neat cardigan and reading glasses in place,
gentle peaceful smile returned, picking up colorful knitting needles and yarn.
Low table with fresh steaming teacup and traditional sweets.
Everything back to perfect peace. Warm, calm atmosphere.
Photorealistic, 4K quality, soft cinematic lighting, 9:16 vertical composition.`,
    seed: 700,
    localFile: 'scene-07-return-to-peace.jpeg',
  },
];

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        if (response.headers.location) {
          downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const writeStream = fsSync.createWriteStream(filepath);
      response.pipe(writeStream);

      writeStream.on('finish', () => {
        writeStream.close();
        resolve();
      });

      writeStream.on('error', reject);
    }).on('error', reject);
  });
}

async function regenerateScene(scene: typeof MISSING_SCENES[0]) {
  console.log(`\n🎨 Regenerating Scene ${scene.id}: ${scene.name}`);
  console.log(`   Prompt: ${scene.prompt.slice(0, 80)}...`);

  try {
    const result = await client.generateImage({
      model: 'seedream-4-0-250828',
      prompt: scene.prompt,
      size: '2K',
      response_format: 'url',
      watermark: false,
      seed: scene.seed,
    });

    if (!result.data || result.data.length === 0) {
      throw new Error('No image generated');
    }

    const imageUrl = result.data[0]!.url;
    console.log(`✅ Generated: ${imageUrl}`);

    // Download immediately
    const filepath = path.join(IMAGES_DIR, scene.localFile);
    console.log(`📥 Downloading to: ${filepath}`);

    await downloadImage(imageUrl, filepath);
    console.log(`✅ Saved: ${scene.localFile}`);

    return {
      sceneId: scene.id,
      name: scene.name,
      imageUrl,
      localFile: scene.localFile,
      success: true,
    };
  } catch (error: any) {
    console.error(`❌ Failed Scene ${scene.id}: ${error.message}`);
    return {
      sceneId: scene.id,
      name: scene.name,
      error: error.message,
      success: false,
    };
  }
}

async function main() {
  console.log('🎮 Regenerating Missing Scenes (6 & 7)\n');

  if (!process.env.BYTEPLUS_API_KEY || !process.env.BYTEPLUS_ENDPOINT) {
    console.error('❌ Missing BYTEPLUS_API_KEY or BYTEPLUS_ENDPOINT');
    process.exit(1);
  }

  await fs.mkdir(IMAGES_DIR, { recursive: true });

  const results = [];

  for (const scene of MISSING_SCENES) {
    const result = await regenerateScene(scene);
    results.push(result);

    if (scene.id < MISSING_SCENES.length + 5) {
      console.log('   ⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 REGENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total scenes: ${MISSING_SCENES.length}`);
  console.log(`✅ Successful: ${results.filter(r => r.success).length}`);
  console.log(`❌ Failed: ${results.filter(r => !r.success).length}`);
  console.log('');

  // Update GENERATED_ASSETS.json
  const assetsPath = path.join(OUTPUT_DIR, 'GENERATED_ASSETS.json');
  const assetsData = await fs.readFile(assetsPath, 'utf-8');
  const assets = JSON.parse(assetsData);

  for (const result of results.filter(r => r.success)) {
    const sceneIndex = assets.scenes.findIndex((s: any) => s.sceneId === result.sceneId);
    if (sceneIndex >= 0) {
      assets.scenes[sceneIndex].imageUrl = result.imageUrl;
      console.log(`✅ Updated Scene ${result.sceneId} in GENERATED_ASSETS.json`);
    }
  }

  await fs.writeFile(assetsPath, JSON.stringify(assets, null, 2));
  console.log('\n✅ GENERATED_ASSETS.json updated');
}

main().catch(console.error);
