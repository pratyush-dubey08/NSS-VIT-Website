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
  const DEFAULT_PLACEHOLDER = '/images/gallery/events_2025/image1.webp';

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

export const getActivityFallbackBanner = (title?: string): string => {
  if (!title) return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792709236/nss_vit_website/pk6gzqkhszn69cu8biyk.jpg';
  const t = title.toLowerCase();
  if (t.includes('bird') || t.includes('water and food')) {
    return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792794315/nss_vit_website/g2vqq8ae2tixpk3wk2iz.jpg';
  }
  if (t.includes('blood')) {
    return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792794754/nss_vit_website/ax7sfirvqlqaxamqpypn.jpg';
  }
  if (t.includes('plant') || t.includes('tree')) {
    return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792790514/nss_vit_website/ej5vnzcva3mygt8vj2t3.jpg';
  }
  if (t.includes('camp')) {
    return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792709886/nss_vit_website/fqqcfgdawuyvznsulndo.png';
  }
  if (t.includes('parliament') || t.includes('youth')) {
    return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792795056/nss_vit_website/hizw5gnkyhn0vzehoriv.jpg';
  }
  if (t.includes('vibgyor') || t.includes('nirvana') || t.includes('cultural')) {
    return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792800085/nss_vit_website/a0kgaifiufoplgl9fm1q.jpg';
  }
  if (t.includes('cloth')) {
    return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792798667/nss_vit_website/v27yotsykzmzgnrzecuj.jpg';
  }
  if (t.includes('clean') || t.includes('swachh') || t.includes('hostel')) {
    return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792799593/nss_vit_website/emu7fraotij0ihnycbqe.jpg';
  }
  if (t.includes('eye') || t.includes('health') || t.includes('dental')) {
    return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792798570/nss_vit_website/z3frd4t5rjkd3upzzeyj.jpg';
  }
  if (t.includes('cooler')) {
    return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792978943/nss_vit_website/jjsghg8qlxmi3azfkth2.jpg';
  }
  return 'https://res.cloudinary.com/lrsgx9ti/image/upload/f_auto,q_auto/v1792709236/nss_vit_website/pk6gzqkhszn69cu8biyk.jpg';
};
