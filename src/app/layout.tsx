import type { Metadata, Viewport } from 'next';
import './globals.css';

const SITE_NAME = 'Sprit-Z';
const AUTHOR_NAME = 'modeusweb';
const SITE_URL = 'https://sprit-z.vercel.app';
const PAGE_TITLE =
  'Sprit-Z — Free SVG Sprite Generator — Combine Icons Online';
const PAGE_DESCRIPTION =
  'Sprit-Z is a free online SVG sprite generator. Turn multiple icons into one reusable sprite, minify the markup, and speed up your web project in the browser.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: PAGE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: PAGE_DESCRIPTION,
  keywords: [
    'SVG sprite generator',
    'combine SVG icons',
    'SVG sprite tool',
    'icon sprite creator',
    'optimize SVG',
    'SVG minifier',
    'web performance',
    'icon management',
    'SVG optimizer',
    'sprite sheet generator',
  ],
  authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,
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
  verification: {
    google: 'w_s1YAdGDmNMm19tV4F6fl_4o15nDgnZGLM8ledX-f8',
    yandex: '71b9d9fa4a37e15a',
  },
  category: 'technology',
  classification: 'DeveloperApplication',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'msapplication-TileColor': '#9333ea',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Sprit-Z',
    'application-name': 'Sprit-Z',
    'theme-color': '#9333ea',
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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16 32x32" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
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
                'Sprit-Z is a free online SVG sprite generator. Combine multiple SVG icons into a single reusable sprite, optimize the markup, and speed up your web project.',
              offers: {
                '@type': 'Offer',
                url: `${SITE_URL}/`,
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
              author: {
                '@type': 'Organization',
                name: AUTHOR_NAME,
                url: `${SITE_URL}/`,
                logo: `${SITE_URL}/favicon.svg`,
              },
              publisher: {
                '@type': 'Organization',
                name: AUTHOR_NAME,
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
