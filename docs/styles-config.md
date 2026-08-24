# Config, Pages & Styles

> Part of the [AGENTS.md](../AGENTS.md) file-by-file code walkthrough — build/deploy config,
> the thin page-routing wrappers, the single stylesheet, and the other docs in this repo.

## Config & tooling

### `package.json`
Declares the project as an Astro app (`type: "module"`, private, MIT). Scripts: `dev`/`build`/
`preview`/`check` wrap the equivalent `astro` CLI commands; `gen:favicons` runs
`scripts/gen-favicons.mjs`. Dependencies are deliberately few: `astro` itself, `@astrojs/netlify`
(the deploy adapter), `@astrojs/sitemap` (sitemap generation), `@fontsource-variable/fraunces`
(self-hosted display font), and `posthog-js` (analytics). Dev-only: `@tailwindcss/vite` + 
`tailwindcss` (styling) and `@astrojs/check` + `typescript` (type-checking). There is no React,
no test runner, no linter configured — type-checking via `astro check` is the only automated gate.

### `astro.config.mjs`
The Astro build configuration, four things:
1. **`site`** — the canonical absolute URL, read from Netlify's `URL` env var at build time
   (falls back to `http://localhost:4321` locally). Astro needs this to turn relative paths into
   absolute URLs for `og:image`, `canonical`, and sitemap entries — without it social previews
   would point at `localhost`.
2. **`integrations: [sitemap(...)]`** — generates `sitemap-index.xml` with per-locale `hreflang`
   alternates, configured with the three registered locales (`en`/`nl`/`fr`). This list must be
   kept in sync by hand with `src/i18n/index.ts`'s `LANGS`/`LANG_META` when a language is added.
3. **`vite.plugins: [tailwindcss()]`** — wires the Tailwind v4 Vite plugin (Tailwind v4 has no
   separate config file; everything is CSS-driven from `src/styles/global.css`).
4. **`adapter: netlify()`** — target platform for `astro build`, producing Netlify-specific
   output (functions/edge config) even though every page here is static/prerendered.

The comment at the top explains why there's no `// @ts-check` pragma: the Tailwind Vite plugin and
Astro bundle slightly different versions of Vite's `PluginOption` type, which produces a spurious
type conflict even though the plugin works fine at runtime.

### `tsconfig.json`
Extends Astro's `strict` preset (strict TypeScript across `.ts` and `.astro` files) and includes
the generated `.astro/types.d.ts` (content-collection / asset types Astro writes on `astro sync`/
`dev`/`build`) plus everything else in the project, excluding `dist/`.

### `netlify.toml`
One `[build]` block (`npm run build` → publish `dist/`) plus three `[[redirects]]` rules that
implement the **PostHog reverse proxy**: any request to `/ingest/*` on this domain is rewritten
(status 200, i.e. proxied rather than redirected) to PostHog's EU ingestion hosts. This exists so
ad blockers — which match hostnames like `*.i.posthog.com` — don't silently drop analytics
requests; from the browser's point of view, analytics traffic looks like same-origin traffic. Two
more specific rules for `/ingest/static/*` and `/ingest/array/*` must stay **above** the general
`/ingest/*` catch-all (Netlify evaluates redirects top-to-bottom, first match wins) because
PostHog's remote-config and lazy-loaded exception-capture chunk are served from those subpaths.
The extensive comments explain a subtle gotcha: PostHog's own Netlify recipe includes a `host =
"..."` key on each rule, but Netlify's redirect schema doesn't have that field and silently drops
it — so it's omitted here entirely (a proxy rewrites the `Host` header to the destination
automatically, no explicit config needed). Full context: [analytics.md](../analytics.md).

### `.env.example`
Documents the two optional environment variables the site reads (both must be prefixed `PUBLIC_`
because Astro only inlines `PUBLIC_`-prefixed vars into client-side code):
- `PUBLIC_WORDS_API_URL` — base URL of the word-bank-server feed; powers live floating words.
  Unset → degrades gracefully (fallback word list).
- `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` — analytics; unset → analytics is fully disabled.

Copy this to a real `.env` (gitignored) for local development.

### `scripts/gen-favicons.mjs`
A one-off Node script (`npm run gen:favicons`), not run automatically during build. Reads
`public/favicon.svg` (the single source-of-truth brand mark) and uses `sharp` to rasterize it into
the three brand images the site actually ships:
- `public/favicon.png` — 512×512, transparent background, for browsers that don't support SVG
  favicons.
- `public/apple-touch-icon.png` — 180×180, background *flattened* to the accent color (`#208AEF`)
  because iOS ignores alpha channels on touch icons and applies its own rounded-corner mask, so a
  transparent PNG would show a hard square edge.
- `public/og-image.png` — 1200×630 social share card, built from a hand-written SVG string (not
  the favicon SVG) that lays out the accent square mark next to a "WordBank" wordmark and tagline,
  matching `Logo.astro`'s markup. `sharp` is available only transitively (pulled in by Astro/
  Netlify's own dependencies) — it isn't a declared dependency of this project, so this script
  could break if an upstream dependency drops it.

Rerun this whenever `favicon.svg` changes, and bump the `?v=` cache-buster on `og-image.png` in
`Layout.astro` afterwards so link-preview crawlers (Discord, Slack, etc.) don't serve a stale
cached image.

## Pages (`src/pages`)

Every page file is intentionally a thin one- or two-line wrapper — all real markup lives in the
`components/Page.astro` / `components/SupportPage.astro` composition components described above,
so the routing layer can never drift from the actual page structure:
- `src/pages/index.astro` → `<Page lang="en" />` (served at `/`, the default locale).
- `src/pages/nl/index.astro` → `<Page lang="nl" />` (served at `/nl/`).
- `src/pages/fr/index.astro` → `<Page lang="fr" />` (served at `/fr/`).
- `src/pages/support.astro` / `nl/support.astro` / `fr/support.astro` → the same pattern with
  `<SupportPage lang="xx" />`, served at `/support`, `/nl/support`, `/fr/support`.

Adding a fourth language means adding one more `xx/index.astro` and `xx/support.astro` pair (per
the recipe in `src/i18n/index.ts`), not touching any of these existing files.

## Styles

### `src/styles/global.css`
The single stylesheet, structured top-to-bottom as: Tailwind import → design tokens → base element
resets → reused layout/animation primitives → buttons → nav → hero → phone mockup → FAQ →
tech marquee → responsive overrides. Key ideas (see also the "Styling" and "⚠️ Element defaults
belong in `@layer base`" sections above, which cover the CSS-layering gotchas in depth and aren't
repeated here):
- **Design tokens** (`:root` custom properties: `--accent`, `--bg`, `--text`, etc.) are kept in
  sync by hand with the mobile app's own color constants
  (`word-bank/src/styles/global.ts`) — comments next to each token note which app color it
  mirrors. Dark-mode values live under `:root[data-theme="dark"]` (set by `Layout.astro`'s
  pre-paint script) with a `@media (prefers-color-scheme: dark)` fallback scoped to
  `:root:not([data-theme])`, i.e. only when JS hasn't run yet or storage was blocked.
- **`@theme inline`** maps those raw tokens onto Tailwind v4's theme variables, which is what
  makes utilities like `bg-accent`, `text-ink-soft`, `border-line` exist and re-theme live when
  `data-theme` flips — no Tailwind `dark:` variant classes anywhere in the codebase. It also
  defines the `text-pos-*` (part-of-speech color) and `font-sans`/`font-serif`/`font-mono`/
  `font-display` utilities used throughout the dictionary/phone-mockup components.
- **Animations** are grouped by feature and each has a matching `@media (prefers-reduced-motion:
  reduce)` override near the bottom of the file that either disables the animation outright or
  swaps it for an instant/static equivalent: scroll-reveal + stagger, the hero's one-time entrance
  fade and its gradient-link glow, floating words, the phone-mockup story's every transition, the
  FAQ's expand/collapse, and the tech marquee (which additionally *drops the duplicated chip list*
  and wraps to a static grid under reduced motion, since the scrolling loop has no purpose without
  motion).
- A few interactions are deliberately *not* utility classes because they need to win the cascade
  over inline Tailwind utilities on the same element, or because they're pure-CSS mechanisms with
  no sensible utility equivalent (pseudo-elements, `@keyframes`, `interpolate-size`) — these stay
  as hand-written classes: `.button*`, `.nav*`, `.hero`/`.text-gradient-accent`, `.floating-word`,
  `.phone*`, `.faq-item`, `.marquee*`, `.stat*`, `.section`/`.section-sub`. A one-line rule of
  thumb from the "Vertical rhythm" table above: reach for a utility first, and only add here when
  you hit one of those two reasons.

## Documentation files

### `analytics.md`
The deep-dive companion to the "Analytics" section above: full PostHog setup steps (creating the
project, local `.env`, Netlify dashboard config), a plain-language explanation of what a reverse
proxy is and why this site has one (ad-blocker evasion of the *analytics-blocking* kind — not
anything hiding information from visitors), the complete tracked-event table with properties and
priority tier, the two ways to fire an event (declarative `data-ph-*` vs. imperative `track()`),
why `persistence: "memory"` was chosen over PostHog's built-in `cookieless_mode`, and a
verification checklist. Read this before touching anything analytics-related; don't duplicate its
content in `AGENTS.md`.

### `README.md`
The public-facing repo README (tech summary, run/deploy commands, a short note on the language
setup) — kept intentionally brief and points here (`AGENTS.md`) for structural/content/theming
detail.
