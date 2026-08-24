import type { NextConfig } from 'next';

/**
 * Static export for GitHub Pages (project site):
 * https://<user>.github.io/Project-Adobo-Website/
 *
 * - output: 'export'        → `next build` emits a fully static `out/` directory
 * - basePath                → repository sub-path; Next prefixes its own assets/links
 * - NEXT_PUBLIC_BASE_PATH   → exposed to client code so hand-written <img>/<audio>
 *                             sources can be prefixed via asset() (Next does NOT
 *                             rewrite arbitrary public/ URLs)
 * - images.unoptimized      → required for static export (site uses pre-generated
 *                             responsive WebP chains instead of next/image anyway)
 */
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Project-Adobo-Website',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: '/Project-Adobo-Website',
  },
};

export default nextConfig;
