#!/usr/bin/env node

/**
 * Aevion Wallpaper - Automated Copyright-Safe Collection Runner
 * 
 * Supports:
 *   1) Automated AI Generation (FLUX.1 via Pollinations REST)
 *   2) Local Batch Ingestion (--input from 'wallpaper collect/input/')
 *   3) Duplicate verification (pHash + SHA-256)
 *   4) Cloudinary hierarchy upload (Original, Wallpapers, Thumbnails)
 *   5) MongoDB Atlas synchronization & live publishing
 * 
 * Usage:
 *   node "wallpaper collect/collect.js" --count 5
 *   node "wallpaper collect/collect.js" --category amoled --count 3 --orientation mobile
 *   node "wallpaper collect/collect.js" --all --count 10
 *   node "wallpaper collect/collect.js" --input
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import services from server
import { connectDB, isMongoConnected } from '../server/src/config/db.js';
import { getDB, saveDB, WallpaperModel, CategoryModel } from '../server/src/services/storage.js';

// Import collection modules
import { CATEGORIES_CONFIG, getRandomPrompt } from './promptLibrary.js';
import { checkDuplicate } from './duplicateChecker.js';
import { uploadToCloudinaryHierarchy, checkCloudinaryAuth } from './cloudinaryUploader.js';
import { generateAiImageBuffer, processVariants } from './generator.js';
import { buildWallpaperRecord } from './metadataBuilder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server .env
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });
dotenv.config();

// Parse CLI Arguments
const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const index = args.indexOf(flag);
  if (index !== -1 && args[index + 1]) {
    return args[index + 1];
  }
  return defaultValue;
}

const isInputMode = args.includes('--input');
const requestedCategory = getArg('--category', 'all');
const requestedCount = parseInt(getArg('--count', '3'), 10);
const requestedOrientation = getArg('--orientation', 'desktop'); // 'desktop' | 'mobile' | 'both'

console.log(`\n============================================================`);
console.log(`🚀 Aevion Automated Wallpaper Collection Pipeline`);
console.log(`============================================================`);
console.log(`📋 Execution Mode:     ${isInputMode ? '📁 Local Folder Ingest (--input)' : '🤖 Automated AI Generation (FLUX.1)'}`);
if (!isInputMode) {
  console.log(`📂 Target Category:    ${requestedCategory.toUpperCase()}`);
  console.log(`🖼️  Wallpapers to make:  ${requestedCount}`);
  console.log(`📐 Target Orientation:  ${requestedOrientation.toUpperCase()}`);
}
console.log(`☁️  Cloudinary Auth:     ${checkCloudinaryAuth() ? '✅ Connected' : '❌ Missing credentials'}`);

async function runPipeline() {
  // 1. Connect to Database
  console.log(`\n[1/4] Connecting to MongoDB Atlas & Local Storage...`);
  await connectDB();
  const db = getDB();
  db.wallpapers = db.wallpapers || [];
  db.categories = db.categories || [];

  console.log(`📊 Existing Wallpapers in Database: ${db.wallpapers.length}`);

  let successCount = 0;
  let duplicateCount = 0;
  let failCount = 0;

  // MODE A: Local Folder Ingestion
  if (isInputMode) {
    const inputDir = path.resolve(__dirname, 'input');
    const processedDir = path.join(inputDir, 'processed');

    if (!fs.existsSync(inputDir)) fs.mkdirSync(inputDir, { recursive: true });
    if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });

    const files = fs.readdirSync(inputDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp', '.avif'].includes(ext);
    });

    if (files.length === 0) {
      console.log(`\n⚠️ No image files found in 'wallpaper collect/input/'.`);
      console.log(`👉 Place your .png, .jpg, or .webp images into:`);
      console.log(`   ${inputDir}`);
      console.log(`   Then re-run: node "wallpaper collect/collect.js" --input\n`);
      process.exit(0);
    }

    console.log(`\n📥 Found ${files.length} local images to process in input folder.`);

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const filePath = path.join(inputDir, fileName);
      console.log(`\n------------------------------------------------------------`);
      console.log(`🔄 Processing Local File [${i + 1}/${files.length}]: ${fileName}`);

      try {
        const rawBuffer = fs.readFileSync(filePath);

        // Duplicate Check
        const dupCheck = await checkDuplicate(rawBuffer, db.wallpapers);
        if (dupCheck.isDuplicate) {
          console.warn(`   ⚠️ Duplicate detected! ${dupCheck.reason}. Skipping.`);
          duplicateCount++;
          continue;
        }

        // Process Variants
        const {
          width,
          height,
          originalBuffer,
          previewBuffer,
          thumbnailBuffer,
          dominantColor,
          fileSizeBytes
        } = await processVariants(rawBuffer);

        // Derive Category from filename or default to abstract
        const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        let detectedCategory = 'abstract';
        for (const catKey of Object.keys(CATEGORIES_CONFIG)) {
          if (cleanName.toLowerCase().includes(catKey)) {
            detectedCategory = catKey;
            break;
          }
        }
        const catConfig = CATEGORIES_CONFIG[detectedCategory] || CATEGORIES_CONFIG['abstract'];

        const orientation = width >= height ? 'landscape' : 'portrait';
        const aspectRatio = width >= height ? '16:9' : '9:16';
        const fileId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        console.log(`☁️  Uploading to Cloudinary (${catConfig.folder})...`);
        const uploadResult = await uploadToCloudinaryHierarchy({
          originalBuffer,
          previewBuffer,
          thumbnailBuffer,
          categoryFolder: catConfig.folder,
          fileId
        });

        const slug = cleanName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') + '-' + fileId.slice(-4);

        const title = cleanName
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ') + (orientation === 'portrait' ? ' Phone Wallpaper 4K' : ' Ultra HD 4K');

        const description = `Download high-resolution 4K wallpaper featuring ${cleanName}. Masterfully optimized for desktop monitors, OLED mobile screens, and tablet displays. 100% free download with zero copyright restrictions on Aevion.`;

        const wallpaperRecord = buildWallpaperRecord({
          id: `wall_${fileId}`,
          title,
          slug,
          description,
          categorySlug: catConfig.slug,
          categoryName: catConfig.name,
          tags: [catConfig.slug, '4k', orientation === 'portrait' ? 'mobile' : 'desktop', 'wallpaper'],
          width,
          height,
          aspectRatio,
          orientation,
          deviceTarget: orientation === 'portrait' ? 'mobile' : 'desktop',
          dominantColor,
          pHash: dupCheck.pHash,
          sha256: dupCheck.sha256,
          fileSizeBytes,
          images: {
            originalUrl: uploadResult.originalUrl,
            previewUrl: uploadResult.previewUrl,
            thumbnailUrl: uploadResult.thumbnailUrl
          },
          cloudinaryPublicId: uploadResult.publicId,
          source: 'Verified Artist / Public Domain Upload',
          creatorName: 'Aevion Contributor'
        });

        db.wallpapers.unshift(wallpaperRecord);
        const cat = db.categories.find(c => c.slug === catConfig.slug);
        if (cat) cat.wallpaperCount = (cat.wallpaperCount || 0) + 1;
        saveDB(db);

        // Move to processed folder
        fs.renameSync(filePath, path.join(processedDir, fileName));
        console.log(`✅ Published: ${title}`);
        successCount++;
      } catch (err) {
        console.error(`❌ Failed processing ${fileName}:`, err.message);
        failCount++;
      }
    }
  }

  // MODE B: Automated AI Generation
  else {
    for (let i = 1; i <= requestedCount; i++) {
      console.log(`\n------------------------------------------------------------`);
      console.log(`🔄 Processing [${i}/${requestedCount}]...`);

      let currentOrientation = requestedOrientation;
      if (requestedOrientation === 'both') {
        currentOrientation = i % 2 === 0 ? 'mobile' : 'desktop';
      }

      const promptConfig = getRandomPrompt(requestedCategory, currentOrientation);
      console.log(`📌 Category:    ${promptConfig.categoryName}`);
      console.log(`🎨 Concept:     ${promptConfig.title}`);
      console.log(`📐 Resolution:  ${promptConfig.width}x${promptConfig.height} (${promptConfig.aspectRatio})`);

      try {
        console.log(`🤖 Generating original AI artwork via FLUX.1 engine...`);
        const rawBuffer = await generateAiImageBuffer(
          promptConfig.prompt,
          promptConfig.width,
          promptConfig.height,
          promptConfig.seed
        );
        console.log(`   └─ Image received (${(rawBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);

        console.log(`🔍 Checking visual perceptual hash (pHash) against database...`);
        const dupCheck = await checkDuplicate(rawBuffer, db.wallpapers);
        if (dupCheck.isDuplicate) {
          console.warn(`   ⚠️ Duplicate detected! ${dupCheck.reason}. Skipping to next.`);
          duplicateCount++;
          continue;
        }
        console.log(`   └─ Verified unique! pHash: ${dupCheck.pHash.substring(0, 16)}...`);

        console.log(`⚡ Processing Sharp WebP variants (Master, Preview, Thumbnail)...`);
        const {
          width,
          height,
          originalBuffer,
          previewBuffer,
          thumbnailBuffer,
          dominantColor,
          fileSizeBytes
        } = await processVariants(rawBuffer);

        console.log(`☁️  Uploading to Cloudinary folders (${promptConfig.categoryFolder})...`);
        const fileId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const uploadResult = await uploadToCloudinaryHierarchy({
          originalBuffer,
          previewBuffer,
          thumbnailBuffer,
          categoryFolder: promptConfig.categoryFolder,
          fileId
        });
        console.log(`   └─ Master CDN:    ${uploadResult.originalUrl}`);
        console.log(`   └─ Thumbnail CDN: ${uploadResult.thumbnailUrl}`);

        const slug = promptConfig.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') + '-' + fileId.slice(-4);

        const wallpaperRecord = buildWallpaperRecord({
          id: `wall_${fileId}`,
          title: promptConfig.title,
          slug,
          description: promptConfig.description,
          categorySlug: promptConfig.categorySlug,
          categoryName: promptConfig.categoryName,
          tags: promptConfig.tags,
          width,
          height,
          aspectRatio: promptConfig.aspectRatio,
          orientation: promptConfig.orientation,
          deviceTarget: promptConfig.deviceTarget,
          dominantColor,
          pHash: dupCheck.pHash,
          sha256: dupCheck.sha256,
          fileSizeBytes,
          images: {
            originalUrl: uploadResult.originalUrl,
            previewUrl: uploadResult.previewUrl,
            thumbnailUrl: uploadResult.thumbnailUrl
          },
          cloudinaryPublicId: uploadResult.publicId
        });

        db.wallpapers.unshift(wallpaperRecord);
        const cat = db.categories.find(c => c.slug === promptConfig.categorySlug);
        if (cat) {
          cat.wallpaperCount = (cat.wallpaperCount || 0) + 1;
        }

        saveDB(db);
        console.log(`✅ Saved & published to MongoDB Atlas & Local Store:`);
        console.log(`   Title: ${wallpaperRecord.title}`);
        console.log(`   Live Slug: /wallpaper/${wallpaperRecord.slug}`);
        successCount++;

      } catch (err) {
        console.error(`❌ Failed processing wallpaper [${i}]:`, err.message);
        failCount++;
      }

      if (i < requestedCount) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  console.log(`\n============================================================`);
  console.log(`🎉 Collection Batch Summary`);
  console.log(`============================================================`);
  console.log(`✅ Successfully published: ${successCount}`);
  console.log(`⚠️ Duplicates skipped:     ${duplicateCount}`);
  console.log(`❌ Failures:                ${failCount}`);
  console.log(`📚 Total Wallpapers in DB: ${db.wallpapers.length}`);
  console.log(`🌐 Live Site:              https://aevion-wallpaper.onrender.com`);
  console.log(`============================================================\n`);

  process.exit(0);
}

runPipeline().catch(err => {
  console.error('Fatal Pipeline Error:', err);
  process.exit(1);
});
