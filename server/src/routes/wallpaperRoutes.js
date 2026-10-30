import express from 'express';
import {
  getWallpapers,
  getWallpaperBySlug,
  incrementDownload,
  getSearchSuggestions,
  reportWallpaper
} from '../controllers/wallpaperController.js';

const router = express.Router();

router.get('/', getWallpapers);
router.get('/search-suggestions', getSearchSuggestions);
router.get('/:slug', getWallpaperBySlug);
router.post('/:id/download', incrementDownload);
router.post('/:id/report', reportWallpaper);

export default router;
