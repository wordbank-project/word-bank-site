// Regenerate the raster favicons from the single SVG source (public/favicon.svg).
// favicon.svg is the source of truth for the brand mark; run this whenever it
// changes:  npm run gen:favicons
//
// Outputs:
//   public/favicon.png        512x512, transparent rounded corners (browser tab)
//   public/apple-touch-icon.png 180x180, corners filled accent, no alpha (iOS
//                               rejects alpha and applies its own corner mask)
//
// `sharp` is available transitively (via Astro/Netlify deps); it's only used at
// generation time, so it isn't a declared project dependency.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ACCENT = '#208AEF';
const root = fileURLToPath(new URL('..', import.meta.url));
const svg = readFileSync(root + 'public/favicon.svg');

// density renders the SVG large enough to downscale crisply to either size.
await sharp(svg, { density: 512 })
    .resize(512, 512)
    .png()
    .toFile(root + 'public/favicon.png');

await sharp(svg, { density: 512 })
    .resize(180, 180)
    .flatten({ background: ACCENT })
    .png()
    .toFile(root + 'public/apple-touch-icon.png');

console.log('Generated public/favicon.png + public/apple-touch-icon.png from public/favicon.svg');
