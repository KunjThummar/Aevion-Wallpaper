# 🚀 Aevion Wallpaper — Automated Copyright-Safe Collection System

This folder contains the complete, automated workflow for generating, verifying, processing, and publishing copyright-safe 4K and AMOLED wallpapers for **Aevion**.

---

## 🏗️ Architecture & Pipeline Flow

```
1. Prompt Selection  ──►  2. AI Generation (FLUX.1)
                                  │
                                  ▼
5. Cloudinary Upload ◄──  4. Sharp WebP Processing  ◄──  3. Duplicate Verification
(Structured Folders)       (Master, Preview, Thumb)        (pHash & SHA-256)
         │
         ▼
6. MongoDB Registration ──► 7. Instant Live Publishing on Aevion
```

---

## ⚡ How to Run

Open your terminal in the project root directory and use any of the following commands:

### 1. Auto-Generate Wallpapers (Default: 3 across all categories)
```bash
npm run collect
```
*or directly:*
```bash
node "wallpaper collect/collect.js" --count 5
```

### 2. Generate for a Specific Category
```bash
node "wallpaper collect/collect.js" --category amoled --count 5
```
Available categories:
- `amoled` (AMOLED & Pitch Black)
- `cyberpunk` (Cyberpunk & Sci-Fi)
- `nature` (Nature & Landscapes)
- `space` (Space & Cosmos)
- `abstract` (Abstract 3D Art)
- `minimalist` (Minimalist & Clean)
- `anime` (Anime & Illustration)
- `cars` (Supercars & Vehicles)

### 3. Generate Mobile (9:16) vs Desktop (16:9)
```bash
# Desktop 16:9 only
node "wallpaper collect/collect.js" --orientation desktop --count 5

# Mobile / Phone 9:16 only
node "wallpaper collect/collect.js" --orientation mobile --count 5

# Alternates between desktop and mobile
node "wallpaper collect/collect.js" --orientation both --count 10
```

### 4. Bulk Upload Your Own Images (Local Ingestion)
If you have created wallpapers on Midjourney, Leonardo.ai, or downloaded verified Public Domain / CC0 art:
1. Drop your `.png`, `.jpg`, or `.webp` files into `wallpaper collect/input/`.
2. Run:
```bash
node "wallpaper collect/collect.js" --input
```
The system will automatically:
- Calculate perceptual hash (pHash) to ensure it's not a duplicate.
- Generate Sharp WebP master, preview, and thumbnail files.
- Upload to Cloudinary under the correct category folder.
- Save rich metadata to MongoDB Atlas.
- Move the processed file to `wallpaper collect/input/processed/`.

---

## 🛡️ Copyright & AdSense Compliance Details

Every generated or imported wallpaper is stored with strict legal provenance fields:
- **`licenseType`**: `Creative Commons CC0 1.0 (Public Domain Equivalent)`
- **`licenseUrl`**: `https://creativecommons.org/publicdomain/zero/1.0/`
- **`creatorName`**: `Aevion AI Studio`
- **`commercialUseAllowed`**: `true`
- **`redistributionAllowed`**: `true`
- **`copyrightVerified`**: `true`
- **`verifiedAt`**: Current ISO Timestamp

---

## 📁 Cloudinary Storage Hierarchy

All files are structured inside Cloudinary:
- `aevion_wallpapers/Original/<Category>/` — Lossless master files for 4K downloads
- `aevion_wallpapers/Wallpapers/<Category>/` — Fast WebP previews for wallpaper detail pages
- `aevion_wallpapers/Thumbnails/<Category>/` — Lightweight thumbnails for gallery grid browsing
