import { MetadataRoute } from 'next';
import { newsArticles } from '@/lib/news-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://gdmiami.com';

    // Base routes
    const routes = ['', '/news', '/contact', '/privacy', '/terms'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // News routes
    const newsRoutes = newsArticles.map((article) => ({
        url: `${baseUrl}/news/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...newsRoutes];
}
