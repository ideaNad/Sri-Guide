import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/api/',
        '/_next/',
        '/static/',
      ],
    },
    sitemap: 'https://sriguide.com/sitemap.xml', // User to update with actual domain
  };
}
