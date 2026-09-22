// @ts-check
import { defineConfig } from 'astro/config';

/**
 * The canonical site URL is used for Open Graph tags and the sitemap-style
 * canonical links. It is read from the environment so the same config works
 * locally, on Vercel preview deployments, and on the production domain.
 *
 *   SITE_URL=https://example.com npm run build
 *
 * Vercel exposes VERCEL_PROJECT_PRODUCTION_URL automatically.
 */
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

export default defineConfig({
  site,
  output: 'static',
  // Astro 7 defaults to JSX-style whitespace collapsing, which removes the
  // space between adjacent inline elements. HTML-aware compression keeps it.
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  devToolbar: {
    enabled: false,
  },
});
