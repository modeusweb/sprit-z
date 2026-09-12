import type { MetadataRoute } from 'next';

// Keep in sync with metadataBase in src/app/layout.tsx
const BASE_URL = 'https://sprit-z.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      images: [`${BASE_URL}/og-image.png`],
    },
  ];
}