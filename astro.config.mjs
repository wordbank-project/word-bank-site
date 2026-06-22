import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

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

  vite: {
      plugins: [tailwindcss()],
  },

  adapter: netlify(),
});