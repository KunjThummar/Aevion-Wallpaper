import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * Generates an original AI wallpaper buffer via FLUX.1 (Pollinations REST)
 * @param {string} prompt - Detailed prompt text
 * @param {number} width - Target width (e.g., 1920 or 1080)
 * @param {number} height - Target height (e.g., 1080 or 1920)
 * @param {number} seed - Random seed for reproducibility
 */
export async function generateAiImageBuffer(prompt, width = 1920, height = 1080, seed = null) {
  const currentSeed = seed || Math.floor(Math.random() * 9999999);
  const encodedPrompt = encodeURIComponent(prompt);

  // Pollinations FLUX.1 REST URL
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&seed=${currentSeed}&enhance=true`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'AevionWallpaperCollector/1.0 (https://aevionwallpapers.com)'
    }
  });

  if (!response.ok) {
    throw new Error(`AI Generation API responded with HTTP ${response.status}: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Extracts dominant color from image buffer
 */
export async function extractDominantColor(buffer) {
  try {
    const { dominant } = await sharp(buffer).stats();
    const r = Math.round(dominant.r);
    const g = Math.round(dominant.g);
    const b = Math.round(dominant.b);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return '#090a0f';
  }
}

/**
 * Optimizes the image buffer into 3 variants using Sharp:
 * 1. Master Original (High quality WebP)
 * 2. Preview (Max width 1600px, 85 quality WebP)
 * 3. Thumbnail (Max width 600px, 80 quality WebP)
 */
export async function processVariants(inputBuffer) {
  const metadata = await sharp(inputBuffer).metadata();
  const width = metadata.width || 1920;
  const height = metadata.height || 1080;

  // 1. Master WebP (Original quality)
  const originalBuffer = await sharp(inputBuffer)
    .webp({ quality: 92, effort: 4 })
    .toBuffer();

  // 2. Optimized Preview (Max 1600px)
  const previewBuffer = await sharp(inputBuffer)
    .resize({ width: Math.min(width, 1600), withoutEnlargement: true })
    .webp({ quality: 84 })
    .toBuffer();

  // 3. Crisp Gallery Thumbnail (Max 600px)
  const thumbnailBuffer = await sharp(inputBuffer)
    .resize({ width: Math.min(width, 600), withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const dominantColor = await extractDominantColor(inputBuffer);

  return {
    width,
    height,
    originalBuffer,
    previewBuffer,
    thumbnailBuffer,
    dominantColor,
    fileSizeBytes: originalBuffer.length
  };
}
