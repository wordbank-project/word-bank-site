import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import netlify from '@astrojs/netlify';

// https://astro.build/config
// Note: no `// @ts-check` here — @tailwindcss/vite and Astro bundle slightly
// different Vite type versions, which makes the PluginOption types disagree even
// though the plugin works correctly at build time.
export default defineConfig({
  // Absolute base URL — needed so og:image/canonical resolve to real URLs (not
  // localhost) for link previews. Netlify injects `URL` (production address) at
  // build time; fall back to the dev server origin locally.
  site: process.env.URL || 'http://localhost:4321',

  // sitemap-index.xml + per-page entries with hreflang alternates, so search
  // engines pair / (en), /nl/, and /fr/ the same way the <head> alternates do.
  // Add new locales here when registering a language in src/i18n/index.ts.
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', nl: 'nl', fr: 'fr' },
      },
    }),
  ],

  vite: {
      plugins: [tailwindcss()],
  },

  adapter: netlify(),
});