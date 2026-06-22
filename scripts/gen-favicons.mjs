// Regenerate the brand raster assets from the single SVG mark. favicon.svg is the
// source of truth; run this whenever the mark changes:  npm run gen:favicons
//
// Outputs:
//   public/favicon.png        512x512, transparent rounded corners (browser tab)
//   public/apple-touch-icon.png 180x180, corners filled accent, no alpha (iOS
//                               rejects alpha and applies its own corner mask)
//   public/og-image.png       1200x630 social card: mark + "Word Bank" wordmark
//                               (bump ?v= in Layout.astro when this changes, so
//                                Discord/etc. re-fetch instead of serving cache)
//
// `sharp` is available transitively (via Astro/Netlify deps); it's only used at
// generation time, so it isn't a declared project dependency.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ACCENT = '#208AEF';
const INK = '#11181c';
const root = fileURLToPath(new URL('..', import.meta.url));
const svg = readFileSync(root + 'public/favicon.svg');

// The white open book, in 220-space (same paths as favicon.svg) — reused by the
// OG card so the mark stays identical across assets.
const BOOK = `
    <rect x="36" y="28" width="132" height="164" rx="22" fill="none" stroke="#fff" stroke-width="10"/>
    <rect x="166" y="72" width="18" height="54" rx="5" fill="#fff"/>
    <rect x="166" y="136" width="18" height="36" rx="5" fill="#fff"/>
    <path d="M72 82 C86 72 108 72 122 84 L122 152 C108 142 86 142 72 150Z" fill="#fff"/>
    <path d="M122 84 C136 72 158 72 172 82 L172 150 C158 142 136 142 122 152Z" fill="#EAF5FF"/>
    <path d="M122 84V152" stroke="${ACCENT}" stroke-width="2.5"/>
    <path d="M72 150C86 140 108 140 122 152 M122 152C136 140 158 140 172 150" fill="none" stroke="${ACCENT}" stroke-width="2.5"/>`;

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

// Social share card (1200x630): rounded accent mark on the left + two-tone
// "Word Bank" wordmark and a short tagline, on white. Centred as a unit.
const ogCard = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <g font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    <g transform="translate(232,165) scale(1.3636)">
      <rect width="220" height="220" rx="42" fill="${ACCENT}"/>
      ${BOOK}
    </g>
    <text x="588" y="332" font-size="104" font-weight="800" letter-spacing="-1" fill="${INK}">Word<tspan dx="18" fill="${ACCENT}">Bank</tspan></text>
    <text x="592" y="392" font-size="33" font-weight="500" fill="#555555">Your personal words vault</text>
  </g>
</svg>`;

await sharp(Buffer.from(ogCard))
    .resize(1200, 630)
    .flatten({ background: '#ffffff' })
    .png()
    .toFile(root + 'public/og-image.png');

console.log('Generated public/favicon.png, apple-touch-icon.png, og-image.png from the brand mark');
