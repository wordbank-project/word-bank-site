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
  pages/index.astro        # the page: Nav → Hero → Features → HowItWorks
                           #           → DictionaryShowcase → Faq → TechMarquee → Footer
  layouts/Layout.astro     # <html>/<head>, imports global.css, holds the scroll-reveal script
  content.ts               # ALL copy/data (single source of truth) — edit this first
  styles/global.css        # Tailwind import + design tokens + component styles
  components/
    Header.astro           # top nav + mobile-toggle <script>
    Hero.astro             # headline + FloatingWords + PhoneMockup
    FloatingWords.astro    # decorative drifting words; build-time fallback + live fetch <script>
    PhoneMockup.astro      # fake phone rendering MOCK_BOOKS with STATUS_LABELS
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
  marquee + `@keyframes marquee-scroll`, the FAQ `summary` +/– marker, and the `.reveal` fade. All
  token-driven, so they theme too. Reach for utilities first; add to `global.css` only for
  animations, pseudo-elements, or genuinely-reused primitives.

### ⚠️ Element defaults belong in `@layer base`

Bare-element rules in `global.css` (`p`, `h1`–`h3`, …) **must** stay inside the `@layer base { … }`
block. **Unlayered CSS beats every layered rule regardless of specificity**, and Tailwind emits
utilities into `@layer utilities` — so an unlayered `p { margin: 0 0 1em }` silently overrides
`mb-0`/`m-0` written on a `<p>` in the markup. The class is in the HTML, DevTools shows it
matching, and it does nothing.

That is exactly what happened: every card's `<p class="m-0">` computed to `margin-bottom: 14.88px`,
giving each card ~15px more space below its text than above it. Moving the element block into
`@layer base` fixed all of them at once.

The same trap bit `a { color: var(--accent) }`: the footer's `text-ink-soft hover:text-accent`
links rendered permanently accent-blue, so their hover did nothing. `a` now lives in
`@layer base` too.

`.section-sub` is in **`@layer components`** for the same reason — its `max-width: 540px` was
overriding `max-w-[62ch]` on the support page intro. Put a primitive there whenever a utility on
the same element should be able to win.

The remaining class primitives (`.section`, `.button*`, `.nav*`, `.phone*`, `.faq-item`,
`.marquee*`, `.stat*`, `.hero`) are still **unlayered**, so they beat utilities. That is load-
bearing in places — e.g. `.tech-chip`'s own `color` intentionally wins over the inherited link
color. If you add a class there and a utility on the same element mysteriously does nothing,
this is why: move the rule into `@layer components`.

### Vertical rhythm

One value per relationship — reuse these rather than inventing a new number:

| Relationship | Value |
|---|---|
| Section top/bottom padding | `.section` → `clamp(64px, 8vw, 88px)` |
| Heading block → its content | **48px** (`.section-sub`'s margin, or `mt-12`/`mb-12` where there's no sub-line) |
| Group → next heading (support page) | **80px** (`mb-20`) |
| Card padding | `p-6.5` (26px), with `m-0` on the last `<p>` so top == bottom |
| Card icon → title | `mb-3.5` on the icon, **no `mt-*` on the `<h3>`** (both sides would stack — they don't collapse across the icon's anonymous block) |

## Interactivity (vanilla `<script>`, no framework)

- **Mobile nav** — `Header.astro` toggles `.open` on the menu.
- **Theme toggle** — `Header.astro` has a button cycling **light → dark → system**, saved in
  `localStorage` under `theme`; it sets `<html data-theme>` and, while on `system`, follows the OS
  live. `Layout.astro`'s inline `<head>` script applies the saved theme before paint (no flash).
- **Scroll reveal** — one IntersectionObserver in `Layout.astro` adds `revealed` to `.reveal`.
- **Floating words** — `FloatingWords.astro` renders the `HERO_WORDS` fallback at build, then a
  script fetches `${PUBLIC_WORDS_API_URL}/words?order=top` and polls every ~30s, re-rendering with
  live words (stable per-word layout via a string hash). Falls back silently.

## Backend / env

The live floating words read from the **word-bank-server** feed. Set the base URL via the
**`PUBLIC_WORDS_API_URL`** env var (Astro only exposes client env prefixed `PUBLIC_`). Put it in a
root `.env` (see `.env.example`); leave it unset to disable the feature gracefully — the page still
builds and renders (floating words use `HERO_WORDS`).

## Analytics

The site uses **PostHog** (cookieless — no cookie/consent banner) to measure the marketing funnel,
above all the Android **download-click conversion**. It's fully off unless `PUBLIC_POSTHOG_KEY` is
set (same graceful no-op as `PUBLIC_WORDS_API_URL`). The whole integration is
[src/lib/analytics.ts](src/lib/analytics.ts) (`initAnalytics` + `track`), mounted in `Layout.astro`;
events are wired in `Hero.astro` (download), `Header.astro` (CTA / section / language / theme),
`Faq.astro`, `SupportPage.astro` (donate / share) and `PhoneMockup.astro` (demo completion + replay). **Full setup, event list, and how to add events: [analytics.md](analytics.md).** Do
**not** add analytics to the app — it's "no tracking" by design.

## Keeping it in sync with the app

This site should reflect what the app actually does (see `../word-bank/AGENTS.md`). When the app
gains/renames a feature, update `content.ts` (and `DictionaryShowcase`/`PhoneMockup` if visual).

## Conventions

- Marketing copy: clear and honest — don't promise features the app doesn't ship.
- Run `npm run build` (or `npm run check`) before considering a change done — it type-checks the
  whole project.

### Code style

Shared with the sibling `word-bank-app` / `word-bank-server` repos, scoped here to `.ts` files
and `.astro` frontmatter (component `<script>` blocks are dense, already-narrated vanilla-JS glue
— their small local closures like `closeMenu`/`applyFilter` stay as plain `//`-commented code,
not individually JSDoc'd):

- **Guard clauses, not nested conditionals.** Validate/reject early and return, rather than
  nesting the "happy path" inside `if`/`else`. See `posClass` in
  [`src/components/WordWall.astro`](src/components/WordWall.astro) for the canonical shape: one
  `if (...) { return ...; }` per rule, all at the same indentation level.
- **Every `if`/`for`/`while` body is braced**, even single-statement ones — no one-liners like
  `if (x) return y;`. Not ESLint-enforced here (no ESLint in this project), just the convention;
  keep it manually.
- **JSDoc on every named function in `.ts` files and `.astro` frontmatter** — `/**` alone on its
  opening line, description on the next line, a blank `*` line, then `@param {Type} name
  Description.` per parameter (type in braces even though TS already has it — mirrors
  `word-bank-server`) and `@returns {Type} Description.` (plural, type in braces), then another
  blank `*` line before the closing `*/`. See
  [`src/lib/analytics.ts`](src/lib/analytics.ts)'s `track`/`initAnalytics` for the canonical shape.

---

## File-by-file code walkthrough

The section above is the quick-reference for making changes. The docs below explain **every file**
in detail — what it does, why it's written the way it is, and how it connects to the rest of the
site — split by area so each is a manageable read. Go through them once top-to-bottom and you'll
understand the whole codebase; use them afterwards as a per-file reference. (They're plain
`docs/*.md` files, not nested `AGENTS.md` — this site is one Astro app, not several packages, so
there's no per-directory context to scope them to.)

@docs/components.md

@docs/content-i18n.md

@docs/lib-layout.md

@docs/styles-config.md
