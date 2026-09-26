// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  // User site (repo "jonasahlers.github.io"), so no `base` path is needed.
  site: 'https://jonasahlers.github.io',
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
  ],
});
