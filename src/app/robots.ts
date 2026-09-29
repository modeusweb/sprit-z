import type { MetadataRoute } from 'next';

// Keep in sync with SITE_URL in src/app/layout.tsx
const BASE_URL = 'https://modeusweb.github.io/sprit-z';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}