import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sprit-z.vercel.app'),
  title: 'Sprit-Z - Free SVG Sprite Generator | Combine Icons into Reusable Sprites',
  description: 'Free online SVG sprite generator. Combine multiple SVG icons into a single reusable sprite. Optimize your web project\'s performance with Sprit-Z\'s easy-to-use tool. Upload, configure, and download optimized SVG sprites instantly.',
  keywords: ['SVG sprite generator', 'SVG icons', 'sprite generator', 'icon optimization', 'web performance', 'SVG tool', 'icon sprite', 'free SVG tool', 'combine SVG icons', 'sprite optimization'],
  authors: [{ name: 'Sprit-Z' }],
  creator: 'Sprit-Z',
  publisher: 'Sprit-Z',
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://sprit-z.vercel.app/',
    title: 'Sprit-Z - Free SVG Sprite Generator | Combine Icons into Reusable Sprites',
    description: 'Free online SVG sprite generator. Combine multiple SVG icons into a single reusable sprite. Optimize your web project\'s performance with Sprit-Z\'s easy-to-use tool.',
    siteName: 'Sprit-Z',
    locale: 'en_US',
    images: [
      {
        url: 'https://sprit-z.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sprit-Z - Free SVG Sprite Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sprit-Z - Free SVG Sprite Generator | Combine Icons into Reusable Sprites',
    description: 'Free online SVG sprite generator. Combine multiple SVG icons into a single reusable sprite. Optimize your web project\'s performance with Sprit-Z\'s easy-to-use tool.',
    images: ['https://sprit-z.vercel.app/og-image.png'],
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
              '@type': 'WebApplication',
              name: 'Sprit-Z',
              url: 'https://sprit-z.vercel.app/',
              description: 'Free online SVG sprite generator. Combine multiple SVG icons into a single reusable sprite.',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
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
        {children}
      </body>
    </html>
  );
}
