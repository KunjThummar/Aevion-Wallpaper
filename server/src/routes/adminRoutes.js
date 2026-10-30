import express from 'express';
import multer from 'multer';
import {
  adminLogin,
  getAdminStats,
  uploadWallpaper,
  updateWallpaper,
  deleteWallpaper
} from '../controllers/adminController.js';
import { verifyAdminToken } from '../middlewares/auth.js';
import { getDB, saveDB } from '../services/storage.js';

const router = express.Router();

// In-memory Multer storage for processing via Sharp
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP, AVIF) are allowed'));
    }
  }
});

// Admin Auth
router.post('/login', adminLogin);

// Protected Admin Endpoints
router.use(verifyAdminToken);

router.get('/stats', getAdminStats);
router.post('/wallpapers', upload.single('image'), uploadWallpaper);
router.put('/wallpapers/:id', updateWallpaper);
router.delete('/wallpapers/:id', deleteWallpaper);

// Category Management
router.post('/categories', (req, res) => {
  const { name, description, slug, thumbnailUrl } = req.body;
  const db = getDB();
  const newCat = {
    id: `cat_${Date.now()}`,
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || `Browse the best ${name} 4K & HD wallpapers.`,
    thumbnailUrl: thumbnailUrl || '/uploads/categories/default.webp',
    wallpaperCount: 0
  };
  db.categories = db.categories || [];
  db.categories.push(newCat);
  saveDB(db);
  res.status(201).json({ success: true, data: newCat });
});

router.delete('/categories/:slug', (req, res) => {
  const { slug } = req.params;
  const db = getDB();
  db.categories = (db.categories || []).filter(c => c.slug !== slug);
  saveDB(db);
  res.json({ success: true, message: 'Category deleted' });
});

// DMCA Reports Management
router.get('/reports', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.reports || [] });
});

router.put('/reports/:id/resolve', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const report = (db.reports || []).find(r => r.id === id);
  if (report) {
    report.status = 'resolved';
    report.resolvedAt = new Date().toISOString();
    saveDB(db);
  }
  res.json({ success: true, message: 'Report marked as resolved' });
});

export default router;
