import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nssunitvit.vercel.app';
  const currentDate = new Date();

  const routes = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/activities', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/gallery', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/initiatives/annual-camp', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/initiatives/tree-plantation', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/initiatives/blood-donation', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/achievements', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/team', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/alumni', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/volunteers', priority: 0.6, changeFrequency: 'weekly' as const },
    { url: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
