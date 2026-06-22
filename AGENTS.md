# Word Bank — Marketing / Showcase Site (Astro)

A static landing page that showcases the **Word Bank** mobile app (the Expo/React Native app in
the sibling `word-bank/` directory). It explains the app's features and links to the beta
download — it is **not** the app and shares no code with it.

## Stack

- **Astro** (static output) + **Tailwind CSS v4** (via the `@tailwindcss/vite` plugin) + TypeScript.
- **No React.** Components are `.astro`; the few interactive bits use plain `<script>` (Astro
  bundles them). Single page — `src/pages/index.astro` stacks one component per section.

## Scripts

```bash
npm install
npm run dev       # astro dev server (hot reload)
npm run build     # astro build → static dist/
npm run preview   # serve the built dist/
npm run check     # astro check (type-checks .astro + TS)
```
Deploy = build and host the static `dist/` on any static host.

## Structure

```
astro.config.mjs           # Astro config; registers the Tailwind Vite plugin
src/
  pages/index.astro        # the page: Nav → Hero → Stats → Features → HowItWorks
                           #           → DictionaryShowcase → Faq → TechMarquee → Footer
  layouts/Layout.astro     # <html>/<head>, imports global.css, holds the scroll-reveal script
  content.ts               # ALL copy/data (single source of truth) — edit this first
  styles/global.css        # Tailwind import + design tokens + component styles
  components/
    Header.astro           # top nav + mobile-toggle <script>
    Hero.astro             # headline + FloatingWords + PhoneMockup
    FloatingWords.astro    # decorative drifting words; build-time fallback + live fetch <script>
    PhoneMockup.astro      # fake phone rendering MOCK_BOOKS with STATUS_LABELS
    Stats.astro            # live total / word-of-week / sparkline from /stats (hidden until data)
    Features.astro         # FEATURES grid; ICONS = inline SVG strings via set:html
    HowItWorks.astro       # STEPS
    DictionaryShowcase.astro # hand-written sample word card (not data-driven)
    Faq.astro              # FAQS as native <details>
    TechMarquee.astro      # "Built with open source" — scrolling TECH chips + repo link
    Footer.astro
    Section.astro          # wrapper: <section class="section reveal …"><div class="container"><slot/></div>
```

## How to update content (the common task)

**Almost all copy is data in [src/content.ts](src/content.ts)** — edit there and the components
render it: `FEATURES`, `STEPS`, `FAQS`, `STATUS_LABELS`, `MOCK_BOOKS`, `TECH` (`{ name, url,
highlight? }`), `REPO_URL`, `HERO_WORDS` (floating-words fallback), `MAX_FLOATING_WORDS` (how many
float). `content.ts` is plain TS imported by `.astro` frontmatter — kept verbatim from the old
React site.

### Adding a feature with a new icon
Icons are inline SVGs (not an icon font). Two edits: add the name to the `IconName` union in
[content.ts](src/content.ts), and add a matching entry to the `ICONS` map in
[Features.astro](src/components/Features.astro) (use the `svg(...)` helper; 24×24 viewBox,
`stroke="currentColor"`). Reusing an existing icon needs neither.

### Non-data sections
`DictionaryShowcase.astro` (sample word card) and `Hero.astro`/`Nav.astro`/`Footer.astro` are
hand-written — edit them directly.

## Styling

- Tailwind v4 is the styling system; **markup uses utility classes**. Most layout / spacing /
  typography / color lives in the `.astro` files as utilities — colors go through token utilities
  so they follow the theme: `bg-accent`/`text-accent`/`bg-accent-soft`, `bg-surface` (= `--bg`),
  `bg-surface-soft`, `bg-card`, `border-line` (= `--border`), `text-ink`/`text-ink-soft`/`text-ink-muted`.
- Design tokens are CSS custom properties at the top of [global.css](src/styles/global.css)
  (`--accent`, `--bg`, `--text`, …). An `@theme inline` block maps them onto the Tailwind utilities
  above. **Theming is driven by `data-theme` on `<html>`** (light/dark), set pre-paint by the inline
  script in `Layout.astro` from the saved preference; dark tokens are overridden under
  `:root[data-theme="dark"]` with a `prefers-color-scheme` fallback for no-JS. Because the token
  utilities resolve to these live vars, flipping `data-theme` re-themes the page — **no Tailwind
  `dark:` variants needed**.
- `global.css` also keeps the irreducible bits that aren't expressible as utilities (and the few
  reused primitives): the `.container`/`.section`/`.section-sub` wrappers, `.button*`, the nav bar +
  mobile dropdown, the phone mockup (`.phone*`), floating-words + `@keyframes float-drift`, the
  marquee + `@keyframes marquee-scroll`, the FAQ `summary` +/– marker, the `.reveal` fade, and the
  stats classes (built by JS). All token-driven, so they theme too. Reach for utilities first; add
  to `global.css` only for animations, pseudo-elements, or genuinely-reused primitives.

## Interactivity (vanilla `<script>`, no framework)

- **Mobile nav** — `Header.astro` toggles `.open` on the menu.
- **Theme toggle** — `Header.astro` has a button cycling **light → dark → system**, saved in
  `localStorage` under `theme`; it sets `<html data-theme>` and, while on `system`, follows the OS
  live. `Layout.astro`'s inline `<head>` script applies the saved theme before paint (no flash).
- **Scroll reveal** — one IntersectionObserver in `Layout.astro` adds `revealed` to `.reveal`.
- **Floating words** — `FloatingWords.astro` renders the `HERO_WORDS` fallback at build, then a
  script fetches `${PUBLIC_WORDS_API_URL}/words?order=top` and polls every ~30s, re-rendering with
  live words (stable per-word layout via a string hash). Falls back silently.
- **Stats** — `Stats.astro` renders hidden; a script fetches `${PUBLIC_WORDS_API_URL}/stats` and
  unhides only when `total > 0`.

## Backend / env

The live floating words + stats read from the **word-bank-server** feed. Set the base URL via the
**`PUBLIC_WORDS_API_URL`** env var (Astro only exposes client env prefixed `PUBLIC_`). Put it in a
root `.env` (see `.env.example`); leave it unset to disable both features gracefully — the page
still builds and renders (floating words use `HERO_WORDS`, stats stays hidden).

## Keeping it in sync with the app

This site should reflect what the app actually does (see `../word-bank/AGENTS.md`). When the app
gains/renames a feature, update `content.ts` (and `DictionaryShowcase`/`PhoneMockup` if visual).

## Conventions

- Marketing copy: clear and honest — don't promise features the app doesn't ship.
- Run `npm run build` (or `npm run check`) before considering a change done — it type-checks the
  whole project.
