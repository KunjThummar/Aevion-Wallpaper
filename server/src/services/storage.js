import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { DB_FILE, isMongoConnected } from '../config/db.js';

const DEFAULT_STATE = {
  wallpapers: [],
  categories: [],
  tags: [],
  ads: [
    {
      slotId: 'home_header_banner',
      name: 'Homepage Top Leaderboard',
      adClient: 'ca-pub-9992489128978003',
      adSlot: '1234567890',
      adFormat: 'horizontal',
      isEnabled: true,
      customCodeSnippet: ''
    },
    {
      slotId: 'grid_feed_inline',
      name: 'Wallpaper Gallery In-Feed Native Ad',
      adClient: 'ca-pub-9992489128978003',
      adSlot: '2345678901',
      adFormat: 'fluid',
      isEnabled: true,
      customCodeSnippet: ''
    },
    {
      slotId: 'detail_page_sidebar',
      name: 'Wallpaper Detail Page Ad (Below Specs)',
      adClient: 'ca-pub-9992489128978003',
      adSlot: '3456789012',
      adFormat: 'rectangle',
      isEnabled: true,
      customCodeSnippet: ''
    }
  ],
  settings: {
    siteName: 'Aevion',
    slogan: 'Ultra HD & 4K Wallpapers for Every Screen',
    contactEmail: 'contact@aevionwallpapers.com',
    maintenanceMode: false,
    googleAnalyticsId: 'G-XXXXXXXXXX',
    adSensePublisherId: 'ca-pub-9992489128978003'
  },
  reports: []
};

// -------------------------------------------------------------
// Mongoose Models
// -------------------------------------------------------------
const WallpaperSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  slug: String,
  description: String,
  categorySlug: String,
  categoryName: String,
  tags: [String],
  dominantColor: String,
  palette: [String],
  originalWidth: Number,
  originalHeight: Number,
  aspectRatio: String,
  orientation: String,
  deviceTarget: String,
  fileFormat: String,
  fileSizeBytes: Number,
  pHash: String,
  attribution: String,
  sourceUrl: String,
  license: String,
  images: {
    originalUrl: String,
    previewUrl: String,
    thumbnailUrl: String
  },
  viewsCount: { type: Number, default: 0 },
  downloadsCount: { type: Number, default: 0 },
  favoritesCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, default: 'published' },
  createdAt: { type: Date, default: Date.now }
}, { strict: false, collection: 'wallpapers' });

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  slug: String,
  description: String,
  thumbnailUrl: String,
  wallpaperCount: { type: Number, default: 0 }
}, { strict: false, collection: 'categories' });

const ConfigSchema = new mongoose.Schema({
  key: { type: String, default: 'main_config', unique: true },
  ads: [mongoose.Schema.Types.Mixed],
  settings: mongoose.Schema.Types.Mixed,
  tags: [String],
  reports: [mongoose.Schema.Types.Mixed]
}, { strict: false, collection: 'configs' });

export const WallpaperModel = mongoose.models.Wallpaper || mongoose.model('Wallpaper', WallpaperSchema);
export const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const ConfigModel = mongoose.models.PlatformConfig || mongoose.model('PlatformConfig', ConfigSchema);

// In-memory cache for high-speed synchronous reads
let memoryCache = null;

/**
 * Reads database state (from cache, local file, or MongoDB)
 */
export const getDB = () => {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_STATE, null, 2), 'utf-8');
      memoryCache = { ...DEFAULT_STATE };
      return memoryCache;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    memoryCache = JSON.parse(data);
    return memoryCache;
  } catch (err) {
    console.error('[Storage] Error reading DB_FILE:', err.message);
    memoryCache = { ...DEFAULT_STATE };
    return memoryCache;
  }
};

/**
 * Saves database state to local JSON file AND persists to MongoDB
 */
export const saveDB = (data) => {
  try {
    memoryCache = data;
    // 1. Always update local db.json as instantaneous cache & backup
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');

    // 2. If MongoDB is connected, asynchronously persist to MongoDB
    if (isMongoConnected) {
      persistToMongo(data).catch((err) => {
        console.error('[Storage] MongoDB async persist error:', err.message);
      });
    }

    return true;
  } catch (err) {
    console.error('[Storage] Error saving DB_FILE:', err.message);
    return false;
  }
};

/**
 * Persists all collections to MongoDB
 */
async function persistToMongo(data) {
  try {
    // 1. Bulk Upsert Wallpapers or Clear All if Empty
    if (data.wallpapers && data.wallpapers.length > 0) {
      const wallpaperOps = data.wallpapers.map((w) => ({
        updateOne: {
          filter: { id: w.id },
          update: { $set: w },
          upsert: true
        }
      }));
      await WallpaperModel.bulkWrite(wallpaperOps, { ordered: false });

      // Clean up deleted wallpapers in MongoDB
      const currentIds = data.wallpapers.map((w) => w.id);
      await WallpaperModel.deleteMany({ id: { $nin: currentIds } });
    } else {
      // If db.wallpapers is empty, ensure MongoDB wallpapers collection is also cleared
      await WallpaperModel.deleteMany({});
    }

    // 2. Bulk Upsert Categories
    if (data.categories && data.categories.length > 0) {
      const categoryOps = data.categories.map((c) => ({
        updateOne: {
          filter: { id: c.id },
          update: { $set: c },
          upsert: true
        }
      }));
      await CategoryModel.bulkWrite(categoryOps, { ordered: false });
    }

    // 3. Upsert Ads, Settings, Tags, Reports
    await ConfigModel.updateOne(
      { key: 'main_config' },
      {
        $set: {
          key: 'main_config',
          ads: data.ads || [],
          settings: data.settings || {},
          tags: data.tags || [],
          reports: data.reports || []
        }
      },
      { upsert: true }
    );
  } catch (err) {
    console.error('[Storage] MongoDB bulk sync error:', err.message);
  }
}

/**
 * Initializes and synchronizes storage with MongoDB when connected
 */
export const syncWithMongoDB = async () => {
  try {
    const mongoWallpapers = await WallpaperModel.find({}).lean();
    const localData = getDB();

    console.log(`[Storage] Loaded ${mongoWallpapers.length} wallpapers from MongoDB Atlas.`);
    const mongoCategories = await CategoryModel.find({}).lean();
    const mongoConfig = await ConfigModel.findOne({ key: 'main_config' }).lean();

    const merged = {
      wallpapers: mongoWallpapers,
      categories: mongoCategories.length > 0 ? mongoCategories : (localData.categories || []),
      tags: mongoConfig?.tags || localData.tags || [],
      ads: mongoConfig?.ads || localData.ads || [],
      settings: mongoConfig?.settings || localData.settings || {},
      reports: mongoConfig?.reports || localData.reports || []
    };

    memoryCache = merged;
    fs.writeFileSync(DB_FILE, JSON.stringify(merged, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Failed to sync with MongoDB:', err.message);
  }
};
