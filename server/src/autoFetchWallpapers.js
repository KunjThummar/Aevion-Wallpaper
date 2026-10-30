import { getDB, saveDB } from './services/storage.js';

// Curated pool of high-resolution 4K/8K images from royalty-free Unsplash collections
const CURATED_SOURCES = {
  amoled: [
    {
      title: 'Deep Abyss Glowing Neon Cyan Sphere AMOLED',
      url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
      tags: ['amoled', 'black', 'neon', 'minimalist', 'dark', 'glowing'],
      color: '#05070e',
      palette: ['#05070e', '#00f0ff', '#1a1f36']
    },
    {
      title: 'Minimalist OLED Eclipse Corona Golden Glow',
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      tags: ['amoled', 'eclipse', 'gold', 'minimalist', 'dark', 'sun'],
      color: '#0a0a0c',
      palette: ['#0a0a0c', '#f59e0b', '#78350f']
    },
    {
      title: 'Geometric Dark Prism Glass Dispersion 4K',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      tags: ['amoled', 'geometric', 'prism', 'dark', 'glass'],
      color: '#05070e',
      palette: ['#05070e', '#3b82f6', '#9333ea']
    }
  ],
  nature: [
    {
      title: 'Misty Emerald Pine Forest Lake Sunrise 8K',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      tags: ['nature', 'forest', 'lake', 'sunrise', 'mountains', '8k'],
      color: '#1b3b22',
      palette: ['#1b3b22', '#52796f', '#f4a261']
    },
    {
      title: 'Moraine Lake Glacial Turquoise Water Banff 4K',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      tags: ['nature', 'banff', 'lake', 'mountains', 'water', '4k'],
      color: '#1d3557',
      palette: ['#1d3557', '#457b9d', '#a8dadc']
    },
    {
      title: 'Autumn Golden Aspen Trees Foggy Mountain Ridge',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
      tags: ['nature', 'autumn', 'trees', 'fog', 'landscape', 'forest'],
      color: '#d4a373',
      palette: ['#d4a373', '#bc6c25', '#283618']
    }
  ],
  cyberpunk: [
    {
      title: 'Cyberpunk Shinjuku Neon Crossing Rainy Reflections',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      tags: ['cyberpunk', 'tokyo', 'neon', 'rain', 'night', '4k'],
      color: '#0d1117',
      palette: ['#ff0055', '#00e5ff', '#0d1117']
    },
    {
      title: 'Futuristic Megacity Blade Runner Highway Sunset',
      url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
      tags: ['cyberpunk', 'city', 'sci-fi', 'futuristic', 'highway'],
      color: '#2b0938',
      palette: ['#ff2a85', '#8a2be2', '#0f051d']
    }
  ],
  cars: [
    {
      title: 'Shelby Cobra Classic Racing Blue Under Dramatic Lighting',
      url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80',
      tags: ['cars', 'supercar', 'classic', 'racing', 'automotive'],
      color: '#0f172a',
      palette: ['#1e40af', '#60a5fa', '#0f172a']
    },
    {
      title: 'Aerodynamic Hypercar Tail Lights Long Exposure Speed',
      url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
      tags: ['cars', 'speed', 'hypercar', 'night', 'lights'],
      color: '#18181b',
      palette: ['#ef4444', '#f97316', '#18181b']
    }
  ],
  space: [
    {
      title: 'Milky Way Galaxy Arc Over Desert Pinnacles 4K',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      tags: ['space', 'milky-way', 'stars', 'desert', 'astrophotography'],
      color: '#0b0f19',
      palette: ['#6366f1', '#a855f7', '#0b0f19']
    },
    {
      title: 'Ethereal Cosmic Stardust Pillars of Creation 8K',
      url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80',
      tags: ['space', 'nebula', 'cosmos', 'hubble', 'galaxy', '8k'],
      color: '#130d24',
      palette: ['#8b5cf6', '#ec4899', '#130d24']
    }
  ],
  abstract: [
    {
      title: 'Iridescent Holographic Glass Ribbons 3D Render',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      tags: ['abstract', '3d', 'holographic', 'glass', 'fluid', 'gradient'],
      color: '#4338ca',
      palette: ['#4338ca', '#06b6d4', '#f43f5e']
    },
    {
      title: 'Topographic Contour Lines Clean Dark Architectural Art',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      tags: ['abstract', 'topography', 'lines', 'contour', 'minimalist'],
      color: '#111827',
      palette: ['#111827', '#e5e7eb', '#374151']
    }
  ],
  minimalist: [
    {
      title: 'Zen Arch Geometric Monolith Warm Sunlight Shadow',
      url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80',
      tags: ['minimalist', 'zen', 'architecture', 'shadow', 'clean', 'sun'],
      color: '#e2d9cc',
      palette: ['#e2d9cc', '#a89f91', '#4a443c']
    },
    {
      title: 'Calm Foggy Misty Nordic Ocean Horizon Minimalist',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      tags: ['minimalist', 'ocean', 'horizon', 'fog', 'calm', 'serene'],
      color: '#cbd5e1',
      palette: ['#cbd5e1', '#94a3b8', '#475569']
    }
  ],
  anime: [
    {
      title: 'Shinkai Style Sunset Clouds Railway Crossing Dream',
      url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      tags: ['anime', 'sunset', 'clouds', 'railway', 'shinkai', 'japan'],
      color: '#f97316',
      palette: ['#f97316', '#3b82f6', '#1e1b4b']
    },
    {
      title: 'Magical Cherry Blossom Petals Wind Kyoto Shrine',
      url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=3840&q=95',
      thumb: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=600&q=80',
      tags: ['anime', 'sakura', 'cherry-blossom', 'kyoto', 'japan', 'pink'],
      color: '#f472b6',
      palette: ['#f472b6', '#fbcfe8', '#831843']
    }
  ]
};

export const autoImportWallpapers = () => {
  const db = getDB();
  db.wallpapers = db.wallpapers || [];

  let addedCount = 0;

  for (const [categorySlug, items] of Object.entries(CURATED_SOURCES)) {
    const category = (db.categories || []).find(c => c.slug === categorySlug);
    const categoryName = category ? category.name : categorySlug.toUpperCase();

    items.forEach((item, index) => {
      // Check if already exists by title
      const exists = db.wallpapers.some(w => w.title.toLowerCase() === item.title.toLowerCase());
      if (exists) return;

      const slug = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const isPortrait = categorySlug === 'amoled' && index % 2 === 1;

      const newWallpaper = {
        id: `wall_${categorySlug}_${Date.now()}_${index}`,
        title: item.title,
        slug,
        description: `Stunning ultra-high resolution 4K ${categoryName} wallpaper for desktop monitors, iPhones, and Android devices. Optimized for battery efficiency and crisp display clarity on Aevion.`,
        categorySlug,
        categoryName,
        tags: item.tags,
        dominantColor: item.color,
        palette: item.palette,
        originalWidth: isPortrait ? 2160 : 3840,
        originalHeight: isPortrait ? 3840 : 2160,
        aspectRatio: isPortrait ? '9:16' : '16:9',
        orientation: isPortrait ? 'portrait' : 'landscape',
        deviceTarget: isPortrait ? 'mobile' : 'desktop',
        fileFormat: 'jpeg',
        fileSizeBytes: 4200000 + Math.floor(Math.random() * 2000000),
        pHash: Math.random().toString(36).substring(2, 18),
        images: {
          originalUrl: item.url,
          previewUrl: item.url,
          thumbnailUrl: item.thumb
        },
        viewsCount: Math.floor(Math.random() * 3000) + 1200,
        downloadsCount: Math.floor(Math.random() * 1500) + 600,
        favoritesCount: Math.floor(Math.random() * 400) + 100,
        isFeatured: index === 0,
        status: 'published',
        createdAt: new Date(Date.now() - (addedCount + 1) * 3600000 * 6).toISOString()
      };

      db.wallpapers.unshift(newWallpaper);
      addedCount++;
    });
  }

  saveDB(db);
  console.log(`[Auto-Import] Successfully imported ${addedCount} new 4K wallpapers into Aevion! Total wallpapers in database: ${db.wallpapers.length}`);
};

autoImportWallpapers();
