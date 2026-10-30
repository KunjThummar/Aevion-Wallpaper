import dotenv from 'dotenv';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
const WALLPAPERS_DIR = path.join(UPLOADS_DIR, 'wallpapers');
const THUMBNAILS_DIR = path.join(UPLOADS_DIR, 'thumbnails');

[WALLPAPERS_DIR, THUMBNAILS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const getCloudinaryConfig = () => {
  const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || '').trim().toLowerCase();
  const api_key = (process.env.CLOUDINARY_API_KEY || '').trim();
  const api_secret = (process.env.CLOUDINARY_API_SECRET || '').trim();
  return { cloud_name, api_key, api_secret };
};

// Configure Cloudinary if credentials are present
export const isCloudinaryConfigured = () => {
  const conf = getCloudinaryConfig();
  return !!(conf.cloud_name && conf.api_key && conf.api_secret);
};

if (isCloudinaryConfigured()) {
  cloudinary.config(getCloudinaryConfig());
}

/**
 * Uploads a memory Buffer to Cloudinary via upload_stream
 */
const uploadBufferToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    // Re-verify configuration in case env vars were loaded dynamically
    if (isCloudinaryConfigured()) {
      cloudinary.config(getCloudinaryConfig());
    }
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        ...options
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

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
 * Supports both Cloudinary (Free Cloud Storage) and Local Fallback
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

  // Generate crisp Preview WebP buffer (max width 1600px)
  const previewBuffer = await sharp(fileBuffer)
    .resize({ width: Math.min(width, 1600), withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  // Generate high-speed Thumbnail WebP buffer (max width 500px)
  const thumbBuffer = await sharp(fileBuffer)
    .resize({ width: Math.min(width, 500), withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // Strategy A: If Cloudinary is configured, upload to Cloudinary CDN
  if (isCloudinaryConfigured()) {
    try {
      console.log(`[Storage] Uploading to Cloudinary CDN (${baseName})...`);

      const [originalResult, previewResult, thumbResult] = await Promise.all([
        uploadBufferToCloudinary(fileBuffer, {
          folder: 'aevion_wallpapers/original',
          public_id: `${baseName}-original`
        }),
        uploadBufferToCloudinary(previewBuffer, {
          folder: 'aevion_wallpapers/previews',
          public_id: `${baseName}-preview`,
          format: 'webp'
        }),
        uploadBufferToCloudinary(thumbBuffer, {
          folder: 'aevion_wallpapers/thumbnails',
          public_id: `${baseName}-thumb`,
          format: 'webp'
        })
      ]);

      console.log(`[Storage] ✅ Uploaded to Cloudinary successfully!`);

      return {
        originalUrl: originalResult.secure_url,
        previewUrl: previewResult.secure_url,
        thumbnailUrl: thumbResult.secure_url,
        cloudinaryPublicId: originalResult.public_id,
        width,
        height,
        format,
        orientation,
        aspectRatio,
        dominantColor,
        pHash,
        fileSizeBytes: fileBuffer.length
      };
    } catch (cloudErr) {
      console.error('[Storage] Cloudinary upload failed, falling back to local storage:', cloudErr.message);
    }
  }

  // Strategy B: Local Disk Storage Fallback
  const originalFileName = `${baseName}-original.${format}`;
  const previewFileName = `${baseName}-preview.webp`;
  const thumbFileName = `${baseName}-thumb.webp`;

  await sharp(fileBuffer).toFile(path.join(WALLPAPERS_DIR, originalFileName));
  await sharp(previewBuffer).toFile(path.join(WALLPAPERS_DIR, previewFileName));
  await sharp(thumbBuffer).toFile(path.join(THUMBNAILS_DIR, thumbFileName));

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
