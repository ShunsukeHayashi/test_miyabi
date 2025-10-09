#!/usr/bin/env tsx

/**
 * Download all generated images locally
 * Reads URLs from GENERATED_ASSETS.json and saves to local directory
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const ASSETS_FILE = './gamer-grandma-output/GENERATED_ASSETS.json';
const OUTPUT_DIR = './gamer-grandma-output/images';

interface ImageAsset {
  sceneId: number;
  name: string;
  imageUrl: string;
  localFile: string;
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
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

async function main() {
  console.log('📥 Downloading all generated images...\n');

  // Read assets file
  const assetsData = await fs.readFile(ASSETS_FILE, 'utf-8');
  const assets = JSON.parse(assetsData);

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Download all scene images
  let downloaded = 0;
  let failed = 0;

  for (const scene of assets.scenes) {
    console.log(`Downloading Scene ${scene.sceneId}: ${scene.name}...`);

    try {
      const filepath = path.join(OUTPUT_DIR, scene.localFile);
      await downloadImage(scene.imageUrl, filepath);
      console.log(`✅ Saved: ${scene.localFile}`);
      downloaded++;
    } catch (error: any) {
      console.error(`❌ Failed to download Scene ${scene.sceneId}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Download complete:`);
  console.log(`   ✅ Success: ${downloaded}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`\n📁 Images saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);
