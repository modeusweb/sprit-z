import type { Metadata, Viewport } from 'next';
import './globals.css';

const SITE_NAME = 'Sprit-Z';
const SITE_URL = 'https://sprit-z.vercel.app';
const PAGE_TITLE =
  'Free SVG Sprite Generator — Combine Icons into Sprites | Sprit-Z';
const PAGE_DESCRIPTION =
  'Free online SVG sprite generator. Turn multiple icons into one reusable sprite, minify the markup, and speed up your web project in the browser.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: PAGE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: PAGE_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/`,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: 'en_US',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Sprit-Z — Free SVG Sprite Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: 'technology',
  classification: 'DeveloperApplication',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  other: {
    'msapplication-TileColor': '#9333ea',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#9333ea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['WebApplication', 'SoftwareApplication'],
              '@id': `${SITE_URL}/#webapp`,
              name: 'Sprit-Z — SVG Sprite Generator',
              url: `${SITE_URL}/`,
              image: `${SITE_URL}/og-image.png`,
              screenshot: `${SITE_URL}/og-image.png`,
              logo: `${SITE_URL}/favicon.svg`,
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web',
              browserRequirements: 'Requires JavaScript',
              softwareVersion: '1.0.0',
              inLanguage: 'en',
              isAccessibleForFree: true,
              description:
                'Free online SVG sprite generator. Combine multiple SVG icons into a single reusable sprite, optimize the markup, and speed up your web project.',
              offers: {
                '@type': 'Offer',
                url: `${SITE_URL}/`,
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
              author: {
                '@type': 'Organization',
                name: 'Sprit-Z',
                url: `${SITE_URL}/`,
                logo: `${SITE_URL}/favicon.svg`,
              },
              publisher: {
                '@type': 'Organization',
                name: 'Sprit-Z',
                url: `${SITE_URL}/`,
                logo: `${SITE_URL}/favicon.svg`,
              },
              sameAs: ['https://github.com/modeusweb/sprit-z'],
              featureList: [
                'Upload SVG files',
                'Combine icons into sprite',
                'Auto-resolve ID conflicts',
                'currentColor support',
                'Minify output',
                'Download optimized sprites',
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-white focus:text-gray-900 focus:font-semibold focus:shadow-md"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
