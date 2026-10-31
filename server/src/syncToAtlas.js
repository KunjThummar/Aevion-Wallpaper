import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const DB_FILE = path.resolve(__dirname, '../data/db.json');

async function syncAll() {
  const uri = (process.env.MONGODB_URI || '').trim();
  console.log('Connecting to MongoDB Atlas with reliable DNS...');
  await mongoose.connect(uri, {
    dbName: 'aevion_wallpapers',
    serverSelectionTimeoutMS: 10000
  });
  console.log('✅ Connected to MongoDB Atlas!');

  const raw = fs.readFileSync(DB_FILE, 'utf8');
  const db = JSON.parse(raw);
  console.log(`Local wallpapers in db.json: ${db.wallpapers.length}`);

  const Wallpaper = mongoose.model('Wallpaper', new mongoose.Schema({}, { strict: false, collection: 'wallpapers' }));
  const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false, collection: 'categories' }));

  // 1. Bulk Upsert Wallpapers
  const ops = db.wallpapers.map(w => ({
    updateOne: {
      filter: { id: w.id },
      update: { $set: w },
      upsert: true
    }
  }));

  const res = await Wallpaper.bulkWrite(ops);
  console.log(`✅ Wallpapers synced: ${res.upsertedCount} inserted, ${res.modifiedCount} updated, ${res.matchedCount} already current.`);

  // 2. Sync Categories
  if (db.categories && db.categories.length > 0) {
    const catOps = db.categories.map(c => ({
      updateOne: {
        filter: { id: c.id },
        update: { $set: c },
        upsert: true
      }
    }));
    await Category.bulkWrite(catOps);
    console.log(`✅ Categories synced: ${db.categories.length}`);
  }

  const count = await Wallpaper.countDocuments();
  console.log(`🎉 Total wallpapers now live in MongoDB Atlas: ${count}`);

  await mongoose.disconnect();
}

syncAll().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
