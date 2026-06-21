import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

// https://astro.build/config
// Note: no `// @ts-check` here — @tailwindcss/vite and Astro bundle slightly
// different Vite type versions, which makes the PluginOption types disagree even
// though the plugin works correctly at build time.
export default defineConfig({
  vite: {
      plugins: [tailwindcss()],
  },

  adapter: netlify(),
});