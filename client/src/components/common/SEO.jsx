import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://aevion-wallpaper.onrender.com';
const DEFAULT_TITLE = 'Aevion Wallpaper | Free 4K, 8K & AMOLED Wallpapers';
const DEFAULT_DESCRIPTION = 'Discover stunning free 4K and 8K wallpapers for mobile and desktop. Explore AMOLED, nature, anime, space, cyberpunk, and minimalist wallpapers on Aevion Wallpapers.';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false
}) => {
  const fullTitle = title ? `${title} | Aevion Wallpaper` : DEFAULT_TITLE;
  const canonicalUrl = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const fullImageUrl = image && image.startsWith('http') ? image : `${SITE_URL}${image || '/logo.png'}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Aevion Wallpaper" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
};

export default SEO;
