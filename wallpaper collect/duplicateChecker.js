import crypto from 'crypto';
import sharp from 'sharp';

/**
 * Calculates a 64-bit perceptual block hash for visual similarity
 */
export async function calculatePHash(buffer) {
  try {
    const raw = await sharp(buffer)
      .resize(8, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer();

    let sum = 0;
    for (let i = 0; i < raw.length; i++) {
      sum += raw[i];
    }
    const avg = sum / raw.length;

    let hash = '';
    for (let i = 0; i < raw.length; i++) {
      hash += raw[i] >= avg ? '1' : '0';
    }
    return hash;
  } catch (err) {
    return null;
  }
}

/**
 * Calculates cryptographic SHA-256 hash for byte-level duplicate detection
 */
export function calculateSha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Calculates Hamming distance between two binary hash strings
 */
export function getHammingDistance(hashA, hashB) {
  if (!hashA || !hashB || hashA.length !== hashB.length) return 64;
  let dist = 0;
  for (let i = 0; i < hashA.length; i++) {
    if (hashA[i] !== hashB[i]) dist++;
  }
  return dist;
}

/**
 * Checks if an image buffer is a duplicate of any existing wallpaper
 * @param {Buffer} buffer - Target image buffer
 * @param {Array} existingWallpapers - Collection of existing wallpapers
 * @returns {Object} { isDuplicate: boolean, reason: string | null }
 */
export async function checkDuplicate(buffer, existingWallpapers = []) {
  const sha256 = calculateSha256(buffer);
  const pHash = await calculatePHash(buffer);

  for (const existing of existingWallpapers) {
    // 1. Exact SHA-256 match
    if (existing.sha256 && existing.sha256 === sha256) {
      return {
        isDuplicate: true,
        reason: `Exact byte match with existing wallpaper '${existing.title}' (${existing.id})`,
        matchId: existing.id
      };
    }

    // 2. Perceptual hash similarity (Hamming distance <= 4 is visually nearly identical)
    if (pHash && existing.pHash) {
      const dist = getHammingDistance(pHash, existing.pHash);
      if (dist <= 4) {
        return {
          isDuplicate: true,
          reason: `Visually identical to existing wallpaper '${existing.title}' (${existing.id}) [Distance: ${dist}]`,
          matchId: existing.id
        };
      }
    }
  }

  return {
    isDuplicate: false,
    pHash,
    sha256
  };
}
