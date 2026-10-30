import { getDB, saveDB } from '../services/storage.js';
import { fetchLiveWallpapersOnDemand } from '../services/liveSearchFetcher.js';

// GET /api/wallpapers with rich filtering, search, sorting, and pagination
export const getWallpapers = async (req, res) => {
  try {
    const {
      category,
      search,
      color,
      device,
      orientation,
      sort = 'latest',
      page = 1,
      limit = 16
    } = req.query;

    let db = getDB();
    let results = [...(db.wallpapers || [])].filter(w => w.status === 'published');

    // 1. Search query with On-Demand Live Sourcing
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      
      let matched = results.filter(w => {
        const titleMatch = w.title?.toLowerCase().includes(q);
        const descMatch = w.description?.toLowerCase().includes(q);
        const catMatch = w.categoryName?.toLowerCase().includes(q);
        const tagMatch = w.tags?.some(t => t.toLowerCase().includes(q));
        return titleMatch || descMatch || catMatch || tagMatch;
      });

      // If local database has fewer than 6 wallpapers for this search query, fetch live on-demand!
      if (matched.length < 6) {
        const newlyFetched = await fetchLiveWallpapersOnDemand(q);
        if (newlyFetched && newlyFetched.length > 0) {
          db = getDB();
          results = [...(db.wallpapers || [])].filter(w => w.status === 'published');
        }
      }

      results = results.filter(w => {
        const titleMatch = w.title?.toLowerCase().includes(q);
        const descMatch = w.description?.toLowerCase().includes(q);
        const catMatch = w.categoryName?.toLowerCase().includes(q);
        const tagMatch = w.tags?.some(t => t.toLowerCase().includes(q));
        return titleMatch || descMatch || catMatch || tagMatch;
      });
    }

    // 2. Category Filter
    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      results = results.filter(w => 
        w.categorySlug?.toLowerCase() === catLower || 
        w.categoryName?.toLowerCase() === catLower
      );
    }

    // 3. Color Filter (hex prefix or similarity)
    if (color && color !== 'all') {
      const targetColor = color.toLowerCase();
      results = results.filter(w => 
        w.dominantColor?.toLowerCase() === targetColor ||
        w.palette?.some(c => c.toLowerCase() === targetColor)
      );
    }

    // 4. Device Filter
    if (device && device !== 'all') {
      const dev = device.toLowerCase();
      results = results.filter(w => w.deviceTarget?.toLowerCase() === dev || w.deviceTarget === 'universal');
    }

    // 5. Orientation Filter
    if (orientation && orientation !== 'all') {
      const orient = orientation.toLowerCase();
      results = results.filter(w => w.orientation?.toLowerCase() === orient);
    }

    // 6. Sorting
    switch (sort) {
      case 'popular':
      case 'most_downloaded':
        results.sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0));
        break;
      case 'most_viewed':
        results.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
        break;
      case 'trending':
        results.sort((a, b) => ((b.viewsCount || 0) + (b.downloadsCount || 0) * 2) - ((a.viewsCount || 0) + (a.downloadsCount || 0) * 2));
        break;
      case 'featured':
        results = results.filter(w => w.isFeatured);
        break;
      case 'latest':
      default:
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    // 7. Pagination
    const total = results.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 16;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = results.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginated,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasMore: startIndex + limitNum < total
      }
    });
  } catch (err) {
    console.error('getWallpapers error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving wallpapers' });
  }
};

// GET /api/wallpapers/:slug
export const getWallpaperBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const db = getDB();
    const wallpaper = db.wallpapers.find(w => w.slug === slug || w.id === slug);

    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    // Increment view count
    wallpaper.viewsCount = (wallpaper.viewsCount || 0) + 1;
    saveDB(db);

    // Get related wallpapers (same category or shared tags)
    const related = db.wallpapers
      .filter(w => w.id !== wallpaper.id && w.status === 'published' && (
        w.categorySlug === wallpaper.categorySlug ||
        w.tags?.some(t => wallpaper.tags?.includes(t))
      ))
      .slice(0, 8);

    res.json({
      success: true,
      data: wallpaper,
      related
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving wallpaper' });
  }
};

// POST /api/wallpapers/:id/download
export const incrementDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const wallpaper = db.wallpapers.find(w => w.id === id || w.slug === id);

    if (wallpaper) {
      wallpaper.downloadsCount = (wallpaper.downloadsCount || 0) + 1;
      saveDB(db);
    }

    res.json({ success: true, downloadsCount: wallpaper ? wallpaper.downloadsCount : 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record download' });
  }
};

// GET /api/wallpapers/search-suggestions?q=...
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q = '' } = req.query;
    if (!q.trim() || q.trim().length < 2) {
      return res.json({ success: true, suggestions: [] });
    }

    const query = q.trim().toLowerCase();
    const db = getDB();

    const tagMatches = new Set();
    const titleMatches = [];

    db.wallpapers.forEach(w => {
      if (w.title?.toLowerCase().includes(query)) {
        titleMatches.push(w.title);
      }
      w.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          tagMatches.add(tag);
        }
      });
    });

    const suggestions = [
      ...Array.from(tagMatches).map(t => ({ type: 'tag', text: t })),
      ...titleMatches.slice(0, 5).map(t => ({ type: 'title', text: t }))
    ].slice(0, 8);

    res.json({ success: true, suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error getting suggestions' });
  }
};

// POST /api/wallpapers/:id/report
export const reportWallpaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, email, details } = req.body;
    const db = getDB();

    const report = {
      id: `rep_${Date.now()}`,
      wallpaperId: id,
      reason: reason || 'Inappropriate or Copyright Concern',
      email: email || 'anonymous',
      details: details || '',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    db.reports = db.reports || [];
    db.reports.push(report);
    saveDB(db);

    res.json({ success: true, message: 'Report submitted successfully. Our team will review it within 24 hours.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit report' });
  }
};
