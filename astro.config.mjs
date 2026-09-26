// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  // User site (repo "jonasahlers.github.io"), so no `base` path is needed.
  site: 'https://jonasahlers.github.io',
  devToolbar: { enabled: false },
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
      // Display serif for the name, echoing the serif name on the PDF CV.
      provider: fontProviders.fontsource(),
      name: 'Instrument Serif',
      cssVariable: '--font-display',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],
});
