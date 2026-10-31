import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server .env
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });
dotenv.config();

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim().toLowerCase();
const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

let isConfigured = false;
if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
  isConfigured = true;
}

/**
 * Checks if Cloudinary credentials are fully loaded
 */
export function checkCloudinaryAuth() {
  return isConfigured;
}

/**
 * Uploads a buffer directly to a Cloudinary folder
 */
function uploadBuffer(buffer, folder, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'image',
        overwrite: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

/**
 * Uploads original and thumbnail variants following Aevion's structured hierarchy:
 * - Aevion/Wallpapers/<Category>/
 * - Aevion/Thumbnails/
 * - Aevion/Original/
 */
export async function uploadToCloudinaryHierarchy({ originalBuffer, previewBuffer, thumbnailBuffer, categoryFolder, fileId }) {
  if (!isConfigured) {
    throw new Error('Cloudinary credentials missing in server/.env');
  }

  const categorySubfolder = categoryFolder || 'General';

  // 1. Upload Master Original
  const originalResult = await uploadBuffer(
    originalBuffer,
    `aevion_wallpapers/Original/${categorySubfolder}`,
    `orig_${fileId}`
  );

  // 2. Upload Web Preview (Optimized WebP for detail page)
  const previewResult = await uploadBuffer(
    previewBuffer,
    `aevion_wallpapers/Wallpapers/${categorySubfolder}`,
    `view_${fileId}`
  );

  // 3. Upload Gallery Thumbnail
  const thumbResult = await uploadBuffer(
    thumbnailBuffer,
    `aevion_wallpapers/Thumbnails/${categorySubfolder}`,
    `thumb_${fileId}`
  );

  return {
    publicId: originalResult.public_id,
    originalUrl: originalResult.secure_url,
    previewUrl: previewResult.secure_url,
    thumbnailUrl: thumbResult.secure_url,
    bytes: originalResult.bytes,
    format: originalResult.format
  };
}
