import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
const WALLPAPERS_DIR = path.join(UPLOADS_DIR, 'wallpapers');
const THUMBNAILS_DIR = path.join(UPLOADS_DIR, 'thumbnails');

[WALLPAPERS_DIR, THUMBNAILS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Calculates a simple perceptual block hash for duplicate detection
 */
export const calculatePHash = async (inputBuffer) => {
  try {
    const raw = await sharp(inputBuffer)
      .resize(8, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer();

    let sum = 0;
    for (let i = 0; i < raw.length; i++) {
      sum += raw[i];
    }
    const avg = sum / raw.length;

    let hash = '';
    for (let i = 0; i < raw.length; i++) {
      hash += raw[i] >= avg ? '1' : '0';
    }
    return hash;
  } catch (err) {
    console.warn('pHash calculation failed, using timestamp hash:', err.message);
    return Math.random().toString(36).substring(2, 15);
  }
};

/**
 * Extracts dominant color approximation
 */
export const extractDominantColor = async (inputBuffer) => {
  try {
    const { dominant } = await sharp(inputBuffer).stats();
    const r = Math.round(dominant.r);
    const g = Math.round(dominant.g);
    const b = Math.round(dominant.b);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch (err) {
    return '#1e293b';
  }
};

/**
 * Determine aspect ratio string
 */
export const getAspectRatio = (width, height) => {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const ratioW = width / divisor;
  const ratioH = height / divisor;

  const floatRatio = width / height;
  if (Math.abs(floatRatio - 16 / 9) < 0.05) return '16:9';
  if (Math.abs(floatRatio - 9 / 16) < 0.05) return '9:16';
  if (Math.abs(floatRatio - 21 / 9) < 0.05) return '21:9';
  if (Math.abs(floatRatio - 4 / 3) < 0.05) return '4:3';
  if (Math.abs(floatRatio - 3 / 4) < 0.05) return '3:4';
  if (Math.abs(floatRatio - 1) < 0.05) return '1:1';

  return `${ratioW}:${ratioH}`;
};

/**
 * Processes an uploaded image into multiple optimized WebP variants
 */
export const processWallpaperImage = async (fileBuffer, originalFilename) => {
  const metadata = await sharp(fileBuffer).metadata();
  const width = metadata.width || 1920;
  const height = metadata.height || 1080;
  const format = metadata.format || 'jpeg';

  const orientation = width > height ? 'landscape' : height > width ? 'portrait' : 'square';
  const aspectRatio = getAspectRatio(width, height);
  const dominantColor = await extractDominantColor(fileBuffer);
  const pHash = await calculatePHash(fileBuffer);

  const baseName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const originalFileName = `${baseName}-original.${format}`;
  const previewFileName = `${baseName}-preview.webp`;
  const thumbFileName = `${baseName}-thumb.webp`;

  // 1. Save original file
  await sharp(fileBuffer).toFile(path.join(WALLPAPERS_DIR, originalFileName));

  // 2. Generate crisp Preview WebP (max width 1600px)
  await sharp(fileBuffer)
    .resize({ width: Math.min(width, 1600), withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(WALLPAPERS_DIR, previewFileName));

  // 3. Generate high-speed Thumbnail WebP (max width 500px)
  await sharp(fileBuffer)
    .resize({ width: Math.min(width, 500), withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(THUMBNAILS_DIR, thumbFileName));

  return {
    originalUrl: `/uploads/wallpapers/${originalFileName}`,
    previewUrl: `/uploads/wallpapers/${previewFileName}`,
    thumbnailUrl: `/uploads/thumbnails/${thumbFileName}`,
    width,
    height,
    format,
    orientation,
    aspectRatio,
    dominantColor,
    pHash,
    fileSizeBytes: fileBuffer.length
  };
};
