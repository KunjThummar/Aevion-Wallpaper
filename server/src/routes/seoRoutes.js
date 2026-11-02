import express from 'express';
import { getDB } from '../services/storage.js';

const router = express.Router();

// GET /sitemap.xml
router.get('/sitemap.xml', (req, res) => {
  const db = getDB();
  const baseUrl = process.env.SITE_URL || 'https://aevion-wallpaper.onrender.com';
  const wallpapers = (db.wallpapers || []).filter(w => w.status === 'published');
  const categories = db.categories || [];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/categories</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/dmca</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;

  // Categories
  categories.forEach(cat => {
    xml += `  <url>
    <loc>${baseUrl}/category/${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  // Wallpapers with Google Image Sitemap tags
  wallpapers.forEach(w => {
    const loc = `${baseUrl}/wallpaper/${w.slug}`;
    const imgUrl = w.images?.originalUrl?.startsWith('http')
      ? w.images.originalUrl
      : `${baseUrl}${w.images?.previewUrl || w.images?.originalUrl}`;

    xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date(w.createdAt || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title><![CDATA[${w.title}]]></image:title>
      <image:caption><![CDATA[${w.description || w.title}]]></image:caption>
    </image:image>
  </url>\n`;
  });

  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// GET /robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.SITE_URL || 'https://aevion-wallpaper.onrender.com';
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Disallow: /Aevion@1277/admin

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

// GET /ads.txt
router.get('/ads.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send('google.com, pub-9992489128978003, DIRECT, f08c47fec0942fa0\n');
});

export default router;
