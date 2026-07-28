/**
 * Helper to resolve image URLs properly.
 * Replaces localhost origins with production backend API origin if applicable.
 */
export const getImageUrl = (url?: string | null): string => {
  if (!url) return '/images/nss-logo.png';

  // If the image URL contains localhost or 127.0.0.1 (from local development or local seed)
  if (url.includes('localhost:') || url.includes('127.0.0.1:')) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
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
