import fs from 'fs';
import path from 'path';
import { DB_FILE, isMongoConnected } from '../config/db.js';
import mongoose from 'mongoose';

const DEFAULT_STATE = {
  wallpapers: [],
  categories: [],
  tags: [],
  ads: [
    {
      slotId: 'home_header_banner',
      name: 'Homepage Top Leaderboard',
      adClient: 'ca-pub-XXXXXXXXXXXXXXXX',
      adSlot: '1234567890',
      adFormat: 'horizontal',
      isEnabled: true,
      customCodeSnippet: ''
    },
    {
      slotId: 'grid_feed_inline',
      name: 'Wallpaper Gallery In-Feed Native Ad',
      adClient: 'ca-pub-XXXXXXXXXXXXXXXX',
      adSlot: '2345678901',
      adFormat: 'fluid',
      isEnabled: true,
      customCodeSnippet: ''
    },
    {
      slotId: 'detail_page_sidebar',
      name: 'Wallpaper Detail Page Ad (Below Specs)',
      adClient: 'ca-pub-XXXXXXXXXXXXXXXX',
      adSlot: '3456789012',
      adFormat: 'rectangle',
      isEnabled: true,
      customCodeSnippet: ''
    }
  ],
  settings: {
    siteName: 'Aevion',
    slogan: 'Ultra HD & 4K Wallpapers for Every Screen',
    contactEmail: 'contact@aevionwallpapers.com',
    maintenanceMode: false,
    googleAnalyticsId: 'G-XXXXXXXXXX',
    adSensePublisherId: 'ca-pub-XXXXXXXXXXXXXXXX'
  },
  reports: []
};

export const getDB = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_STATE, null, 2), 'utf-8');
      return DEFAULT_STATE;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB_FILE:', err);
    return DEFAULT_STATE;
  }
};

export const saveDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving DB_FILE:', err);
    return false;
  }
};
