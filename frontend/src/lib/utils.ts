/**
 * Helper to resolve image URLs properly.
 * Fallbacks missing, "undefined", unsplash or broken links to local public gallery assets.
 * Replaces localhost origins with production backend API origin if applicable.
 */
export const getImageUrl = (url?: string | null): string => {
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
