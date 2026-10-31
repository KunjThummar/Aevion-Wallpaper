import { getDB, saveDB, CategoryModel, WallpaperModel } from '../services/storage.js';
import { isMongoConnected } from '../config/db.js';

export const getCategories = async (req, res) => {
  try {
    let categories;
    let wallpapers;

    if (isMongoConnected) {
      categories = await CategoryModel.find({}).lean();
      wallpapers = await WallpaperModel.find({ status: 'published' }).lean();
    } else {
      const db = getDB();
      categories = db.categories || [];
      wallpapers = db.wallpapers || [];
    }

    // Calculate real-time counts
    const counts = {};
    (wallpapers || []).forEach(w => {
      if (w.status === 'published' && w.categorySlug) {
        counts[w.categorySlug] = (counts[w.categorySlug] || 0) + 1;
      }
    });

    const categoriesWithCount = (categories || []).map(cat => ({
      ...cat,
      wallpaperCount: counts[cat.slug] || cat.wallpaperCount || 0
    }));

    res.json({ success: true, data: categoriesWithCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let category;
    let count;

    if (isMongoConnected) {
      category = await CategoryModel.findOne({ slug }).lean();
      count = await WallpaperModel.countDocuments({ status: 'published', categorySlug: slug });
    } else {
      const db = getDB();
      category = (db.categories || []).find(c => c.slug === slug);
      count = (db.wallpapers || []).filter(w => w.status === 'published' && w.categorySlug === slug).length;
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      data: {
        ...category,
        wallpaperCount: count
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
};
