import type { APIRoute } from 'astro';

// Every crawler is welcome; point them at the sitemap that @astrojs/sitemap writes at build time.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`);
