import type { MetadataRoute } from 'next';

// Keep in sync with SITE_URL in src/app/layout.tsx
const BASE_URL = 'https://modeusweb.github.io/sprit-z';

export const dynamic = 'force-static';

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