/**
 * Helper to resolve image URLs properly.
 * Fallbacks missing, "undefined", unsplash or broken links to local public gallery assets.
 * Replaces localhost origins with production backend API origin if applicable.
 * Optimizes Cloudinary CDN assets with automatic WebP/AVIF format and responsive sizing.
 */
export interface ImageUrlOptions {
  width?: number;
  quality?: string; // 'auto', 'auto:good', 'auto:eco', etc.
}

export const getImageUrl = (
  url?: string | null,
  options?: ImageUrlOptions
): string => {
  const DEFAULT_PLACEHOLDER = '/images/gallery/events_2025/image1.png';

  if (
    !url ||
    typeof url !== 'string' ||
    url.trim() === '' ||
    url === 'undefined' ||
    url === 'null' ||
    url.includes('unsplash.com') ||
    url.includes('placeholder.com')
  ) {
    return DEFAULT_PLACEHOLDER;
  }

  // Auto-optimize Cloudinary CDN assets with next-gen WebP/AVIF and responsive sizing
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const widthParam = options?.width ? `w_${options.width},c_limit,` : '';
    const qualityParam = options?.quality ? `q_${options.quality}` : 'q_auto';
    const transform = `${widthParam}f_auto,${qualityParam}`;

    // If it already has transformations, avoid duplicating
    if (url.includes('/upload/f_auto') || url.includes('/upload/w_') || url.includes('/upload/c_limit')) {
      return url;
    }

    return url.replace('/upload/', `/upload/${transform}/`);
  }

  if (url.startsWith('/images/')) {
    return url;
  }

  // If the image URL is a relative path starting with /uploads
  if (url.startsWith('/uploads/')) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://nss-vit-website.onrender.com/api';
    const serverOrigin = apiBase.replace(/\/api\/?$/, '');
    return `${serverOrigin}${url}`;
  }

  // If the image URL contains localhost or 127.0.0.1 (from local development or local seed)
  if (url.includes('localhost:') || url.includes('127.0.0.1:')) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://nss-vit-website.onrender.com/api';
    if (apiBase) {
      const serverOrigin = apiBase.replace(/\/api\/?$/, '');
      const match = url.match(/\/uploads\/.+$/);
      if (match) {
        return `${serverOrigin}${match[0]}`;
      }
    }
  }

  return url;
};
