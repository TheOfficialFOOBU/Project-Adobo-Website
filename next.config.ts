import type { NextConfig } from 'next';

const isVercel = process.env.VERCEL === '1';

/**
 * Static export for both GitHub Pages and Vercel:
 *
 * - output: 'export'        → `next build` emits a fully static `out/` directory
 * - basePath                → repository sub-path on GitHub Pages; empty on Vercel
 * - NEXT_PUBLIC_BASE_PATH   → exposed to client code so hand-written <img>/<audio>
 *                             sources can be prefixed via asset() (Next does NOT
 *                             rewrite arbitrary public/ URLs)
 * - images.unoptimized      → required for static export (site uses pre-generated
 *                             responsive WebP chains instead of next/image anyway)
 */
const nextConfig: NextConfig = {
  output: 'export',
  basePath: isVercel ? '' : '/Project-Adobo-Website',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: isVercel ? '' : '/Project-Adobo-Website',
  },
};

export default nextConfig;
