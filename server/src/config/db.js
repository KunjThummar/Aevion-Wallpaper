import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_DIR = path.resolve(__dirname, '../../data');
export const DB_FILE = path.join(DATA_DIR, 'db.json');

export let isMongoConnected = false;

// Initialize JSON database fallback file if not present
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const connectDB = async () => {
  const rawURI = process.env.MONGODB_URI;
  
  if (!rawURI || rawURI.trim() === '') {
    console.log('[Database] No MONGODB_URI configured. Running in High-Speed Local JSON Storage mode.');
    isMongoConnected = false;
    return false;
  }

  const mongoURI = rawURI.trim();

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10s for DNS resolution and Atlas TLS handshake
      dbName: 'aevion_wallpapers',
    });
    isMongoConnected = true;
    console.log(`[Database] ✅ MongoDB Connected: ${conn.connection.host} (DB: aevion_wallpapers)`);
    return true;
  } catch (error) {
    console.warn(`[Database] ⚠️ MongoDB Atlas connection failed (${error.message}). Falling back to Local JSON Storage mode.`);
    isMongoConnected = false;
    return false;
  }
};
