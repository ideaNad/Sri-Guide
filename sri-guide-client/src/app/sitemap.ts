import { MetadataRoute } from 'next';
import apiClient from '@/services/api-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sriguide.com'; // User to update with actual domain

  // Static routes
  const staticRoutes = [
    '',
    '/guides',
    '/agencies',
    '/tours',
    '/adventures',
    '/places',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes (Slugs)
  try {
      const resp = await apiClient.get<{ guides: string[], tours: string[], trips: string[], places: string[], agencies: string[] }>('/discovery/all-slugs');
      const { guides, tours, trips, places, agencies } = resp.data;
      
      const guideUrls = guides.map(slug => ({
        url: `${baseUrl}/profile/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

      const tourUrls = tours.map(slug => ({
        url: `${baseUrl}/tours/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

      const tripUrls = trips.map(slug => ({
        url: `${baseUrl}/adventures/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

      const placeUrls = places.map(slug => ({
        url: `${baseUrl}/places/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));

      // For agencies/hotels
      const agencyUrls = agencies.map(slug => ({
        url: `${baseUrl}/profile/${slug}?type=agency`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

      return [
          ...staticRoutes,
          ...guideUrls,
          ...tourUrls,
          ...tripUrls,
          ...placeUrls,
          ...agencyUrls,
      ];
  } catch (error) {
      console.error('Sitemap generation failed', error);
      return staticRoutes;
  }
}
