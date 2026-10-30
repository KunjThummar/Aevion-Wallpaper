import { getDB, saveDB } from './services/storage.js';

export const seedDatabase = () => {
  const db = getDB();

  // If already seeded with more than 3 wallpapers, skip
  if (db.wallpapers && db.wallpapers.length >= 8) {
    console.log('[Seed] Database already has wallpapers, skipping seed.');
    return;
  }

  console.log('[Seed] Seeding starter categories and high-resolution wallpapers...');

  const categories = [
    {
      id: 'cat_amoled',
      name: 'AMOLED & Pitch Black',
      slug: 'amoled',
      description: 'True pitch-black #000000 wallpapers designed to maximize battery life on OLED displays.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 4
    },
    {
      id: 'cat_nature',
      name: 'Nature & Landscapes',
      slug: 'nature',
      description: 'Breathtaking mountains, lush forests, tranquil lakes, and mesmerizing sunsets in 4K.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 3
    },
    {
      id: 'cat_cyberpunk',
      name: 'Cyberpunk & Sci-Fi',
      slug: 'cyberpunk',
      description: 'Neon-drenched cityscapes, futuristic tech, and sci-fi synthwave aesthetics.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 3
    },
    {
      id: 'cat_anime',
      name: 'Anime & Illustration',
      slug: 'anime',
      description: 'Vibrant artistic anime scenes, fantasy landscapes, and Japanese inspired artwork.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 2
    },
    {
      id: 'cat_minimalist',
      name: 'Minimalist & Clean',
      slug: 'minimalist',
      description: 'Elegant simplicity with subtle geometry, calming pastels, and distraction-free layouts.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 2
    },
    {
      id: 'cat_cars',
      name: 'Supercars & Vehicles',
      slug: 'cars',
      description: 'Exotic hypercars, modified track weapons, and vintage classic automobiles in 8K.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 2
    },
    {
      id: 'cat_space',
      name: 'Space & Cosmos',
      slug: 'space',
      description: 'Deep galaxies, nebulae, James Webb telescope imagery, and distant star clusters.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 2
    },
    {
      id: 'cat_abstract',
      name: 'Abstract 3D Art',
      slug: 'abstract',
      description: 'Fluid gradients, glass dispersion, 3D ribbons, and chromatic aberration textures.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 2
    }
  ];

  const wallpapers = [
    {
      id: 'wall_01',
      title: 'Neon Tokyo Cyberpunk Rainy Street 4K',
      slug: 'neon-tokyo-cyberpunk-rainy-street-4k',
      description: 'A mesmerizing ultra-HD cyberpunk rainy night street in Neo-Tokyo filled with glowing neon signs, puddles reflecting magenta light, and cinematic ambiance. Perfect 4K wallpaper for desktop and mobile displays.',
      categorySlug: 'cyberpunk',
      categoryName: 'Cyberpunk & Sci-Fi',
      tags: ['cyberpunk', 'neon', 'tokyo', 'rain', 'night', '4k', 'city'],
      dominantColor: '#0a0d1a',
      palette: ['#ff007f', '#00e5ff', '#0a0d1a', '#8a2be2'],
      originalWidth: 3840,
      originalHeight: 2160,
      aspectRatio: '16:9',
      orientation: 'landscape',
      deviceTarget: 'desktop',
      fileFormat: 'jpeg',
      fileSizeBytes: 4210000,
      pHash: '1100101010110011',
      images: {
        originalUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=3840&q=95',
        previewUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80'
      },
      viewsCount: 3420,
      downloadsCount: 1890,
      favoritesCount: 420,
      isFeatured: true,
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'wall_02',
      title: 'Pitch Black Geometric AMOLED Hummingbird',
      slug: 'pitch-black-geometric-amoled-hummingbird',
      description: 'Official Aevion tribute wallpaper showcasing an origami geometric low-poly hummingbird hovering gracefully over a pure 100% black AMOLED canvas (#000000). Maximizes battery savings while giving a luxurious minimalist look.',
      categorySlug: 'amoled',
      categoryName: 'AMOLED & Pitch Black',
      tags: ['amoled', 'black', 'origami', 'hummingbird', 'minimalist', 'aevion', 'dark'],
      dominantColor: '#05070e',
      palette: ['#05070e', '#3b82f6', '#60a5fa', '#ffffff'],
      originalWidth: 2160,
      originalHeight: 3840,
      aspectRatio: '9:16',
      orientation: 'portrait',
      deviceTarget: 'mobile',
      fileFormat: 'png',
      fileSizeBytes: 3100000,
      pHash: '1111000011110000',
      images: {
        originalUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=2160&q=95',
        previewUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80'
      },
      viewsCount: 5210,
      downloadsCount: 3120,
      favoritesCount: 890,
      isFeatured: true,
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'wall_03',
      title: 'Dolomites Alpine Peak Sunset Gold 8K',
      slug: 'dolomites-alpine-peak-sunset-gold-8k',
      description: 'Majestic jagged mountain peaks of the Italian Dolomites reflecting warm alpine golden-hour sunlight against deep dramatic mist. High dynamic range resolution suitable for multi-monitor setups.',
      categorySlug: 'nature',
      categoryName: 'Nature & Landscapes',
      tags: ['mountains', 'dolomites', 'sunset', 'nature', 'landscape', '8k', 'gold'],
      dominantColor: '#e07a3f',
      palette: ['#e07a3f', '#2a2830', '#f4a261', '#4a4e69'],
      originalWidth: 7680,
      originalHeight: 4320,
      aspectRatio: '16:9',
      orientation: 'landscape',
      deviceTarget: 'desktop',
      fileFormat: 'jpeg',
      fileSizeBytes: 8940000,
      pHash: '1010101010101010',
      images: {
        originalUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=3840&q=95',
        previewUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
      },
      viewsCount: 4120,
      downloadsCount: 2450,
      favoritesCount: 610,
      isFeatured: true,
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'wall_04',
      title: 'Cosmic Orion Nebula Deep Galaxy Core',
      slug: 'cosmic-orion-nebula-deep-galaxy-core',
      description: 'Ultra-deep space astrophotography capture of interstellar gas clouds, baby star nurseries, and ethereal purple cosmic dust. Ideal for space enthusiasts looking for high definition desktop backgrounds.',
      categorySlug: 'space',
      categoryName: 'Space & Cosmos',
      tags: ['space', 'galaxy', 'nebula', 'stars', 'cosmos', 'universe', '4k'],
      dominantColor: '#120a2a',
      palette: ['#7928ca', '#ff0080', '#0070f3', '#120a2a'],
      originalWidth: 3840,
      originalHeight: 2160,
      aspectRatio: '16:9',
      orientation: 'landscape',
      deviceTarget: 'universal',
      fileFormat: 'jpeg',
      fileSizeBytes: 5400000,
      pHash: '0011001100110011',
      images: {
        originalUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=3840&q=95',
        previewUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80'
      },
      viewsCount: 2980,
      downloadsCount: 1670,
      favoritesCount: 340,
      isFeatured: false,
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'wall_05',
      title: 'Futuristic Matte Black Porsche GT3 RS Silhouette',
      slug: 'futuristic-matte-black-porsche-gt3-rs-silhouette',
      description: 'Aggressive aero lines of a stealth black sports coupe under dramatic top studio lighting with reflection on wet tarmac. Engineered for car enthusiasts seeking a clean automotive wallpaper.',
      categorySlug: 'cars',
      categoryName: 'Supercars & Vehicles',
      tags: ['cars', 'supercar', 'porsche', 'dark', 'matte', 'automotive', 'speed'],
      dominantColor: '#0a0a0c',
      palette: ['#0a0a0c', '#e63946', '#f1faee', '#457b9d'],
      originalWidth: 3840,
      originalHeight: 2160,
      aspectRatio: '16:9',
      orientation: 'landscape',
      deviceTarget: 'desktop',
      fileFormat: 'jpeg',
      fileSizeBytes: 3950000,
      pHash: '1111110000001111',
      images: {
        originalUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=3840&q=95',
        previewUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80'
      },
      viewsCount: 6300,
      downloadsCount: 4190,
      favoritesCount: 970,
      isFeatured: true,
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    {
      id: 'wall_06',
      title: 'Chromatic Glass Iridescent 3D Fluid Waves',
      slug: 'chromatic-glass-iridescent-3d-fluid-waves',
      description: 'Abstract digital sculpture with translucent glass ribbons bending holographic dispersion light into liquid gradients. Highly recommended for Apple retina screens and modern clean setups.',
      categorySlug: 'abstract',
      categoryName: 'Abstract 3D Art',
      tags: ['abstract', '3d', 'glass', 'iridescent', 'fluid', 'minimalist', 'gradient'],
      dominantColor: '#4f46e5',
      palette: ['#4f46e5', '#06b6d4', '#ec4899', '#8b5cf6'],
      originalWidth: 2880,
      originalHeight: 1800,
      aspectRatio: '16:10',
      orientation: 'landscape',
      deviceTarget: 'desktop',
      fileFormat: 'png',
      fileSizeBytes: 4800000,
      pHash: '0101010101010101',
      images: {
        originalUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=3000&q=95',
        previewUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80'
      },
      viewsCount: 3820,
      downloadsCount: 2190,
      favoritesCount: 512,
      isFeatured: false,
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      id: 'wall_07',
      title: 'Lofi Cozy Anime Room Sunset Golden Hour',
      slug: 'lofi-cozy-anime-room-sunset-golden-hour',
      description: 'A relaxing and nostalgic anime illustration of a bedroom balcony overlooking a warm sunset sky filled with clouds and telephone poles. Calming vibe ideal for study, work, and lofi music sessions.',
      categorySlug: 'anime',
      categoryName: 'Anime & Illustration',
      tags: ['anime', 'lofi', 'illustration', 'cozy', 'sunset', 'art', 'japan'],
      dominantColor: '#e76f51',
      palette: ['#e76f51', '#f4a261', '#264653', '#e9c46a'],
      originalWidth: 3840,
      originalHeight: 2160,
      aspectRatio: '16:9',
      orientation: 'landscape',
      deviceTarget: 'universal',
      fileFormat: 'jpeg',
      fileSizeBytes: 3750000,
      pHash: '1100001111000011',
      images: {
        originalUrl: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=3840&q=95',
        previewUrl: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=600&q=80'
      },
      viewsCount: 7100,
      downloadsCount: 4890,
      favoritesCount: 1240,
      isFeatured: true,
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: 'wall_08',
      title: 'Minimalist Scandinavian Sand Dune Shadow',
      slug: 'minimalist-scandinavian-sand-dune-shadow',
      description: 'Crisp curving ridge of desert sand bathed in morning light with an architectural deep shadow line. Soothing earthy tones for minimalists who appreciate uncluttered desktop screen aesthetics.',
      categorySlug: 'minimalist',
      categoryName: 'Minimalist & Clean',
      tags: ['minimalist', 'sand', 'desert', 'shadow', 'clean', 'neutral', 'aesthetic'],
      dominantColor: '#d4a373',
      palette: ['#d4a373', '#ccd5ae', '#faedcd', '#333333'],
      originalWidth: 3840,
      originalHeight: 2400,
      aspectRatio: '16:10',
      orientation: 'landscape',
      deviceTarget: 'desktop',
      fileFormat: 'jpeg',
      fileSizeBytes: 3200000,
      pHash: '1000000110000001',
      images: {
        originalUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=3840&q=95',
        previewUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'
      },
      viewsCount: 2600,
      downloadsCount: 1420,
      favoritesCount: 310,
      isFeatured: false,
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
    }
  ];

  db.categories = categories;
  db.wallpapers = wallpapers;
  saveDB(db);

  console.log(`[Seed] Seeded ${categories.length} categories and ${wallpapers.length} high-res wallpapers successfully.`);
};

// If run directly via node seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
