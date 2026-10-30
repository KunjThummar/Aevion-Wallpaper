import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { getDB, saveDB } from './services/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback

console.log('--- Testing Cloudinary Connection ---');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function main() {
  try {
    const pingResult = await cloudinary.api.ping();
    console.log('✅ Cloudinary Ping Successful:', pingResult);

    const db = getDB();
    const localWallpapers = (db.wallpapers || []).filter(w => 
      w.images?.originalUrl?.startsWith('/uploads') ||
      w.images?.previewUrl?.startsWith('/uploads')
    );

    console.log(`Found ${localWallpapers.length} local wallpapers to upload to Cloudinary.`);

    for (const w of localWallpapers) {
      console.log(`Uploading wallpaper: "${w.title}"...`);

      const cleanRelOriginal = (w.images?.originalUrl || '').replace(/^\//, '');
      const originalPath = path.resolve(__dirname, '../', cleanRelOriginal);

      const cleanRelPreview = (w.images?.previewUrl || '').replace(/^\//, '');
      const previewPath = path.resolve(__dirname, '../', cleanRelPreview);

      const cleanRelThumb = (w.images?.thumbnailUrl || '').replace(/^\//, '');
      const thumbPath = path.resolve(__dirname, '../', cleanRelThumb);

      const baseName = `wall_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      if (fs.existsSync(originalPath)) {
        const origUpload = await cloudinary.uploader.upload(originalPath, {
          folder: 'aevion_wallpapers/original',
          public_id: `${baseName}-original`,
          resource_type: 'image'
        });
        w.images.originalUrl = origUpload.secure_url;
        console.log('  -> Original uploaded:', origUpload.secure_url);
      }

      if (fs.existsSync(previewPath)) {
        const prevUpload = await cloudinary.uploader.upload(previewPath, {
          folder: 'aevion_wallpapers/previews',
          public_id: `${baseName}-preview`,
          resource_type: 'image'
        });
        w.images.previewUrl = prevUpload.secure_url;
        console.log('  -> Preview uploaded:', prevUpload.secure_url);
      }

      if (fs.existsSync(thumbPath)) {
        const thumbUpload = await cloudinary.uploader.upload(thumbPath, {
          folder: 'aevion_wallpapers/thumbnails',
          public_id: `${baseName}-thumb`,
          resource_type: 'image'
        });
        w.images.thumbnailUrl = thumbUpload.secure_url;
        console.log('  -> Thumbnail uploaded:', thumbUpload.secure_url);
      }
    }

    saveDB(db);
    console.log('🎉 Migration to Cloudinary complete! Check your Cloudinary Media Library now.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Cloudinary Error:', err);
    process.exit(1);
  }
}

main();
