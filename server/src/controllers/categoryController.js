import { getDB, saveDB } from '../services/storage.js';

export const getCategories = async (req, res) => {
  try {
    const db = getDB();
    const categories = db.categories || [];

    // Calculate real-time counts
    const counts = {};
    (db.wallpapers || []).forEach(w => {
      if (w.status === 'published' && w.categorySlug) {
        counts[w.categorySlug] = (counts[w.categorySlug] || 0) + 1;
      }
    });

    const categoriesWithCount = categories.map(cat => ({
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
    const db = getDB();
    const category = (db.categories || []).find(c => c.slug === slug);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const count = (db.wallpapers || []).filter(w => w.status === 'published' && w.categorySlug === slug).length;

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
