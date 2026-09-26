// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  // User site (repo "jonasahlers.github.io"), so no `base` path is needed.
  site: 'https://jonasahlers.github.io',
  devToolbar: { enabled: false },
  integrations: [
    // sitemap-index.xml for search engines, with each page's other-language version linked.
    sitemap({
      filter: (page) => page.endsWith('/'),
      i18n: { defaultLocale: 'da', locales: { da: 'da', en: 'en' } },
    }),
  ],
  // Danish at /, English at /en/.
  i18n: {
    locales: ['da', 'en'],
    defaultLocale: 'da',
    routing: { prefixDefaultLocale: false },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      // Display face for the name, monogram, About lede, and project initials.
      provider: fontProviders.fontsource(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-display',
      weights: [500, 800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
