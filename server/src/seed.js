import { getDB, saveDB } from './services/storage.js';

export const seedDatabase = () => {
  const db = getDB();

  // If categories are already initialized, nothing to seed
  if (db.categories && db.categories.length > 0) {
    return;
  }

  console.log('[Seed] Initializing clean starter categories with zero dummy wallpapers...');

  const categories = [
    {
      id: 'cat_amoled',
      name: 'AMOLED & Pitch Black',
      slug: 'amoled',
      description: 'True pitch-black #000000 wallpapers designed to maximize battery life on OLED displays.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_nature',
      name: 'Nature & Landscapes',
      slug: 'nature',
      description: 'Breathtaking mountains, lush forests, tranquil lakes, and mesmerizing sunsets in 4K.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_animals',
      name: 'Animals & Wildlife',
      slug: 'animals',
      description: 'Majestic creatures, exotic birds, intricate macro insects, and wildlife photography in stunning 4K.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_ocean',
      name: 'Ocean & Beaches',
      slug: 'ocean',
      description: 'Turquoise ocean waves, dramatic rocky coastlines, tropical shores, and coastal landscapes in 4K.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_architecture',
      name: 'Architecture',
      slug: 'architecture',
      description: 'Timeless European cityscapes, historic buildings, elegant corridors, and architectural masterworks.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_city',
      name: 'City & Urban',
      slug: 'city',
      description: 'Dynamic metropolitan skylines, modern architecture, panoramic city vistas, and urban landscapes.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_cyberpunk',
      name: 'Cyberpunk & Sci-Fi',
      slug: 'cyberpunk',
      description: 'Neon-drenched cityscapes, futuristic tech, and sci-fi synthwave aesthetics.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_anime',
      name: 'Anime & Illustration',
      slug: 'anime',
      description: 'Vibrant artistic anime scenes, fantasy landscapes, and Japanese inspired artwork.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_minimalist',
      name: 'Minimalist & Clean',
      slug: 'minimalist',
      description: 'Elegant simplicity with subtle geometry, calming pastels, and distraction-free layouts.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_city_architecture',
      name: 'City & Architecture',
      slug: 'city-architecture',
      description: 'Iconic suspension bridges, modern glass skyscrapers, and atmospheric urban cobblestone streets in 4K.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_military',
      name: 'Military & Aviation',
      slug: 'military',
      description: 'Naval warship fleets, military aviation, aircraft carriers, and defense photography in 4K.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_cars',
      name: 'Cars & Vehicles',
      slug: 'cars',
      description: 'Exotic hypercars, modified track weapons, and vintage classic automobiles in 8K.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_space',
      name: 'Space & Night Sky',
      slug: 'space',
      description: 'Deep galaxies, nebulae, star trails, James Webb telescope imagery, and distant star clusters.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    },
    {
      id: 'cat_abstract',
      name: 'Abstract 3D Art',
      slug: 'abstract',
      description: 'Fluid gradients, glass dispersion, 3D ribbons, and chromatic aberration textures.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      wallpaperCount: 0
    }
  ];

  db.categories = categories;
  db.wallpapers = db.wallpapers || [];
  saveDB(db);

  console.log(`[Seed] Initialized ${categories.length} categories with 0 wallpapers.`);
};

// If run directly via node seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
