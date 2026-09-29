/**
 * GitHub Pages deployment config.
 *
 * The site is served from the repository sub-path
 * https://modeusweb.github.io/sprit-z, so a basePath is required.
 * Set NEXT_PUBLIC_BASE_PATH='' to build without it (e.g. for local preview).
 *
 * @type {import('next').NextConfig}
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/sprit-z';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath,
  // Static hosting has no image optimization server.
  images: {
    unoptimized: true,
  },
  // Emit directory-style URLs (/about/index.html) for reliable GitHub Pages hosting.
  trailingSlash: true,
  poweredByHeader: false,
};

export default nextConfig;
