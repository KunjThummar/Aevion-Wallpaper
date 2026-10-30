import { getDB, saveDB } from '../services/storage.js';
import { processWallpaperImage } from '../services/imageProcessor.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('aevion@admin2026', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'aevion_secret_key_production_2026';

// POST /api/admin/login
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && (password === 'aevion@admin2026' || bcrypt.compareSync(password, ADMIN_PASSWORD_HASH))) {
    const token = jwt.sign({ role: 'admin', username: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      success: true,
      token,
      admin: { username: 'admin', role: 'Super Administrator' }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
};

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const db = getDB();
    const wallpapers = db.wallpapers || [];
    
    const totalDownloads = wallpapers.reduce((acc, w) => acc + (w.downloadsCount || 0), 0);
    const totalViews = wallpapers.reduce((acc, w) => acc + (w.viewsCount || 0), 0);
    const totalWallpapers = wallpapers.length;
    const totalCategories = (db.categories || []).length;
    const pendingReports = (db.reports || []).filter(r => r.status === 'pending').length;

    // Top downloaded
    const topDownloaded = [...wallpapers]
      .sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0))
      .slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalWallpapers,
        totalDownloads,
        totalViews,
        totalCategories,
        pendingReports,
        topDownloaded
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve stats' });
  }
};

// POST /api/admin/wallpapers (Upload with Sharp auto-processing)
export const uploadWallpaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const {
      title,
      description,
      categorySlug,
      tags = '',
      deviceTarget = 'universal',
      isFeatured = false
    } = req.body;

    const db = getDB();

    // Sharp processing
    const processed = await processWallpaperImage(req.file.buffer, req.file.originalname);

    // Duplicate check via pHash
    const duplicate = (db.wallpapers || []).find(w => w.pHash === processed.pHash);
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: `Potential duplicate image detected (Already uploaded as "${duplicate.title}")`
      });
    }

    // Match category
    const category = (db.categories || []).find(c => c.slug === categorySlug);
    const categoryName = category ? category.name : 'Uncategorized';

    // Generate unique slug
    const cleanTitle = (title || 'untitled-wallpaper')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${cleanTitle}-${Date.now().toString(36)}`;

    const newWallpaper = {
      id: `wall_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title || 'Untitled Wallpaper',
      slug,
      description: description || `High quality 4K ${categoryName} wallpaper download for Desktop and Mobile devices.`,
      categorySlug: categorySlug || 'abstract',
      categoryName,
      tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : tags,
      dominantColor: processed.dominantColor,
      palette: [processed.dominantColor, '#10141f', '#ffffff'],
      originalWidth: processed.width,
      originalHeight: processed.height,
      aspectRatio: processed.aspectRatio,
      orientation: processed.orientation,
      deviceTarget: deviceTarget || 'universal',
      fileFormat: processed.format,
      fileSizeBytes: processed.fileSizeBytes,
      pHash: processed.pHash,
      images: {
        originalUrl: processed.originalUrl,
        previewUrl: processed.previewUrl,
        thumbnailUrl: processed.thumbnailUrl
      },
      viewsCount: 0,
      downloadsCount: 0,
      favoritesCount: 0,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      status: 'published',
      createdAt: new Date().toISOString()
    };

    db.wallpapers = db.wallpapers || [];
    db.wallpapers.unshift(newWallpaper);
    saveDB(db);

    res.status(201).json({
      success: true,
      message: 'Wallpaper processed and published successfully',
      data: newWallpaper
    });
  } catch (err) {
    console.error('uploadWallpaper error:', err);
    res.status(500).json({ success: false, message: 'Image processing or upload failed' });
  }
};

// PUT /api/admin/wallpapers/:id
export const updateWallpaper = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const index = db.wallpapers.findIndex(w => w.id === id || w.slug === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    const current = db.wallpapers[index];
    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    if (req.body.tags && typeof req.body.tags === 'string') {
      updated.tags = req.body.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    }

    db.wallpapers[index] = updated;
    saveDB(db);

    res.json({ success: true, message: 'Wallpaper updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

// DELETE /api/admin/wallpapers/:id
export const deleteWallpaper = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const prevLen = db.wallpapers.length;
    db.wallpapers = db.wallpapers.filter(w => w.id !== id && w.slug !== id);

    if (db.wallpapers.length === prevLen) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    saveDB(db);
    res.json({ success: true, message: 'Wallpaper removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Deletion failed' });
  }
};
