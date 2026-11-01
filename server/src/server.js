import express from 'express';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectDB, isMongoConnected } from './config/db.js';
import { syncWithMongoDB } from './services/storage.js';
import { seedDatabase } from './seed.js';

import wallpaperRoutes from './routes/wallpaperRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adRoutes from './routes/adRoutes.js';
import seoRoutes from './routes/seoRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Optimization Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Allow AdSense and CDN images
}));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static uploads directory for processed wallpapers and thumbnails
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath, {
  maxAge: '7d', // 7 day edge cache
  immutable: true
}));

// SEO Routes (Sitemap & Robots)
app.use('/', seoRoutes);

// API Endpoints
app.use('/api/wallpapers', wallpaperRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ads', adRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Aevion Wallpapers API',
    version: '1.0.0',
    database: isMongoConnected ? 'MongoDB Atlas Connected' : 'Local JSON Storage Fallback',
    time: new Date().toISOString()
  });
});

// Serve frontend static build if available with optimized caching
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      // Never cache HTML so users always get fresh releases immediately
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));
  app.get('*', (req, res) => {
    // Avoid intercepting API / upload requests
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Start Server and Initialize Database
const startServer = async () => {
  const connected = await connectDB();
  if (connected) {
    await syncWithMongoDB();
  }
  seedDatabase();

  const server = app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Aevion Server active on http://localhost:${PORT}`);
    console.log(`📸 Uploads mapped to ${uploadsPath}`);
    console.log(`🗺️  Sitemap: http://localhost:${PORT}/sitemap.xml`);
    console.log(`===============================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use by another process.`);
      console.error(`👉 You can free port ${PORT} in PowerShell with:`);
      console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`);
      console.error(`👉 Or start on another port:`);
      console.error(`   $env:PORT=5001; npm start\n`);
    } else {
      console.error('Server startup error:', err);
    }
  });
};

startServer();
