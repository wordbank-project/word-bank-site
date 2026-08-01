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

---

# File-by-file code walkthrough

The section above is the quick-reference for making changes. This section explains **every file**
in detail — what it does, why it's written the way it is, and how it connects to the rest of the
site. Read it top-to-bottom once and you'll understand the whole codebase; use it afterwards as a
per-file reference.

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
automatically, no explicit config needed). Full context: [analytics.md](analytics.md).

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

## Content & internationalisation

### `src/content.ts`
The **language-invariant data** file — anything that isn't translated copy. Exports:
- `IconName` — union of the icon keys `Features.astro`'s `ICONS` map understands.
- `Feature` type (legacy shape; the actual feature copy now lives per-locale, see below).
- `REPO_URL` — the GitHub repo, used by the footer, tech marquee blurb, and support page.
- `SupportPlatformId` + `SUPPORT_PLATFORMS` — the four donation platforms (GitHub Sponsors,
  Liberapay, Ko-fi, Buy Me a Coffee) with their URLs; the per-platform *blurb* text lives in
  `Copy.supportPage.platforms` so it can be translated, keyed by the same `id`.
- `Tech` type + `TECH` array — the technologies listed in the scrolling marquee, each with a name,
  a link to its GitHub repo, and an optional `highlight` flag for visual emphasis.
- `ReadStatus` ('want' | 'reading' | 'read') and `MockBook` type + `MOCK_BOOKS` — the four books
  shown in the phone mockup's static "Read List" view (title, author, status, word count, cover
  color). `MOCK_BOOKS[0]` (1984) doubles as the book the animated demo story searches for and
  opens.
- `PHONE_DEMO` — the scripted data for the animated phone story: the search query, the three
  search results, the word being added ("doublethink", with IPA and part-of-speech), and the
  three words already present before it's added. Declared `as const` so its literal string types
  (like `pos: 'noun'`) are preserved rather than widened to `string`, which lets
  `PhoneMockup.astro` index `t.phone.wordPos[PHONE_DEMO.pos]` type-safely. The *translatable*
  demo text (definition, sentence, note) lives in `Copy.phone.demo` instead.
- `MAX_FLOATING_WORDS` — single knob controlling how many words float in the hero background.
- `HERO_WORDS` — 40 curated vocabulary words, the build-time/no-backend fallback for the floating
  word layer.
- `GlossaryWord` type + `GLOSSARY_FALLBACK` — 8 curated words with full dictionary data (part of
  speech, phonetic, definition), the fallback content for the "words people are saving" glossary
  modal (`WordWall.astro`) before the live feed loads.

The recurring pattern: **proper nouns and structural data here, translated strings in
`src/i18n/*.ts`.** A component typically imports both — data arrays from `content.ts` to `.map()`
over, and matching translated strings from `getCopy(lang)` to label them.

### `src/i18n/index.ts`
The internationalisation registry and the `Copy` interface — the single contract every locale
file must satisfy. Key exports:
- `Lang` — `'en' | 'nl' | 'fr'`; `LANGS` — the ordered array of registered locales; `DEFAULT_LANG`
  — `'en'` (served at `/`, not `/en/`).
- `LANG_META` — per-locale display metadata (uppercase code for narrow screens, native name,
  English name, and the `og:locale` value like `en_US`) driving the language-dropdown UI in
  `Header.astro`.
- **`Copy`** — a large interface describing every translatable string on the site, organised by
  section (`nav`, `hero`, `features`, `howItWorks`, `dictionary`, `faq`, `tech`, `footer`,
  `supportPage`, `phone`, `wordWall`, `statusLabels`). Because `en.ts`/`nl.ts`/`fr.ts`
  each assert `: Copy`, TypeScript (and `npm run check`) fails the build if any locale file is
  missing a key, has a typo in a nested key, or a wrong type — this is what keeps translations in
  sync without a runtime i18n framework.
- `getCopy(lang)` — looks up the right `Copy` object from the `COPY` record; every component calls
  this once with its `lang` prop.
- `localeRoot(lang)` — returns `/` for the default language or `/xx/` otherwise; used to build
  links between locales and to compute where the "remembered language" redirect should send a
  returning visitor.

The doc comment at the top spells out the four-step recipe for adding a new language (create
`src/i18n/xx.ts`, register it in the four constants here, create `src/pages/xx/index.astro` and
`.../support.astro`, add the locale to `astro.config.mjs`'s sitemap config) — follow it verbatim
when asked to add a language, since skipping the registry step leaves the new file unused, and
skipping the `Record<Lang, string>` fields (like `dictionary.chips.names`) type-errors on purpose.

### `src/i18n/en.ts`, `src/i18n/nl.ts`, `src/i18n/fr.ts`
Each exports a single `const` object (`en`, `nl`, `fr`) typed as `Copy`, containing the actual UI
strings for that locale — English is the source of truth; `nl.ts`/`fr.ts` mirror its structure
exactly (same nesting, same key names) with translated values. There's no logic here at all, just
data — literally every visible string on the site (nav labels, hero headline pieces, feature
copy, FAQ question/answer pairs, the phone-mockup demo script's text, the support page's donation
blurbs, aria-labels for accessibility, etc.). A few fields carry **trusted inline HTML** rather
than plain text (e.g. `dictionary.demoNotesHtml`, rendered via `set:html` in
`DictionaryShowcase.astro`) so a locale can italicize a word inline (`<span class="italic">…`) —
because this is developer-authored copy (not user input), there's no XSS concern.

Because `Copy` is one flat interface, editing a piece of UI copy is always: find the key in
`en.ts`, edit it, then make the equivalent edit in `nl.ts` and `fr.ts` (or leave a TODO — a
missing translation is a content gap, not a type error, since the field still exists with the old
value).

## Library code (`src/lib`)

### `src/lib/analytics.ts`
The entire PostHog integration, two public functions:
- **`initAnalytics(locale)`** — called once per page load from `Layout.astro`. No-ops if already
  initialized or if `PUBLIC_POSTHOG_KEY` is unset (this is *the* graceful-degradation switch for
  the whole analytics feature). Otherwise calls `posthog.init` with: `api_host` = `HOST`
  (`PUBLIC_POSTHOG_HOST` if set, else `/ingest`, the Netlify reverse-proxy path — see
  `netlify.toml`); `ui_host` pinned to PostHog's real EU app URL so its toolbar/links don't try to
  resolve against this site's own domain; `persistence: "memory"` (deliberately *not*
  `cookieless_mode` — the code comment explains that mode dropped events in practice, appearing in
  PostHog's Live view but never persisting to the data warehouse); `capture_pageview` and
  `capture_pageleave` for basic funnel/bounce data; `capture_exceptions` to auto-report uncaught
  JS errors. It then calls `posthog.register({ locale })` so every subsequent event — including
  autocaptured ones — carries the page's language as a property, and installs **one delegated
  click listener** on `document` that looks for the nearest ancestor with a `data-ph-event`
  attribute and fires that event with its other `data-ph-*` attributes turned into properties.
  This is what lets components declare analytics purely in markup (see `phProps` below) instead of
  writing a handler per button.
- **`track(event, props?)`** — no-ops until `initAnalytics` has run with a real key; otherwise
  calls `posthog.capture`. Imported directly by components that need to fire an event with
  *dynamic* data computed in a handler (e.g. `Header.astro`'s theme toggle reporting which theme
  was just selected) rather than the declarative `data-ph-event` path.
- **`phProps(dataset)`** (private) — converts an element's `DOMStringMap` (i.e. all its
  `data-*` attributes, camelCased by the browser) into event properties: it keeps everything
  prefixed `ph` except `data-ph-event` itself, and strips the `ph` prefix and lowercases the next
  character (`data-ph-platform="android"` → `dataset.phPlatform` → `{ platform: "android" }`).

`ready` is a module-level boolean shared across every `<script>` that imports this module — Astro/
Vite dedupe the module so there's really only one copy of this state per page, which is what makes
`track()` reliably see whether `initAnalytics` has already run regardless of which component's
script runs first.

### `src/lib/back-dismiss.ts`
A small utility used by every full-screen modal on the site (`DictionaryShowcase.astro`'s
definition sheet, `WordWall.astro`'s glossary) to make the **phone/browser Back button close the
modal instead of navigating away from the page** — matching how a native app's back gesture would
behave, which matters because this is a mobile-app's marketing site and many visitors will be on
phones. The trick: when a modal opens, push a synthetic history entry (`pushOnOpen`). A Back press
pops that entry, firing a `popstate` event, which the hook is listening for — and calls the
caller's `close()`. A *manual* close (✕ button, backdrop click, Esc, selecting a row) must go
through `requestClose()` rather than calling `close()` directly: `requestClose()` checks whether
the pushed history entry is still on top and, if so, calls `history.back()` — which naturally
triggers the same `popstate` → `close()` path — keeping the history stack balanced (no orphaned
entry left behind if the user closes manually and then presses Back once, which would otherwise
just replay the close or take them one page too far back).

`backDismiss({ key, isOpen, close })` returns `{ pushOnOpen, requestClose }`; `key` is just a
unique property name stamped into `history.state` (e.g. `{ dictOpen: true }`) so `requestClose`
can tell "is *my* modal's entry the one on top" apart from some other history state.

## Layout

### `src/layouts/Layout.astro`
The outer HTML shell every page renders through (via `Page.astro` or `SupportPage.astro`, never
directly). Responsibilities, in order:

**Frontmatter (build-time):**
- Imports `global.css` and self-hosts the Fraunces variable font (used for the display/serif
  headline typeface, mapped to `--font-display`).
- Resolves `lang`, `title`, `description` (with `Copy`-derived defaults) and an optional `subpath`
  prop — the latter lets a subpage like `/support` say "my hreflang/locale-redirect targets should
  be `/support` and `/nl/support`, not the homepage" so the language switcher and remembered-
  locale redirect keep visitors on the same logical page across languages.
- Computes absolute URLs for `og:image` (with a `?v=2` cache-buster — bump this whenever
  `og-image.png` changes, see `gen-favicons.mjs`) and `canonical`, falling back to `Astro.url` if
  `Astro.site` isn't configured (i.e. no `URL` env var yet).
- Builds `alternates` — one `{ lang, href }` per registered locale, used both for `<link
  rel="alternate" hreflang>` tags (SEO: tells search engines the pages are translations of each
  other) and, as a lookup table (`localeRoots`), by the client-side "remembered language" redirect
  script.
- Builds two **JSON-LD structured-data blocks**: a `MobileApplication` schema (so Google can show
  rich app info) and, homepage-only (`subpath` is falsy), a `FAQPage` schema built directly from
  `t.faq.items` — Google can render FAQ accordions directly in search results. Skipped on subpages
  so the support page doesn't emit duplicate/misleading FAQ structured data for content it doesn't
  actually show.

**`<head>` markup:** the usual meta tags, favicons, canonical/hreflang links, Open Graph + Twitter
Card tags, then the two JSON-LD `<script>` tags, then **two inline pre-paint scripts**:
1. **Language redirect** — reads `localStorage.getItem("lang")`; if it differs from the current
   page's language and is a known locale, `window.location.replace`s to that locale's version of
   the *same* page (preserving the URL hash). This only fires on an actual mismatch, so a shared
   link or a search-engine crawler landing directly on `/nl/` is never redirected away — only a
   returning visitor who previously chose a different language via the header dropdown (which
   writes this key) gets bounced to their preference.
2. **Theme pre-paint** — reads `localStorage.getItem("theme")` (`"light" | "dark" | "system"`,
   default `"system"`), resolves it against `matchMedia("(prefers-color-scheme: dark)")` if
   `"system"`, and sets `document.documentElement.dataset.theme` accordingly — synchronously,
   before first paint, so there's no flash of the wrong theme. Both scripts wrap their
   `localStorage` access in `try/catch` because some browsers throw when storage is blocked
   (private browsing, embedded iframes, etc.) — the catch just leaves the page on its default.

**`<body>`:** a `<slot />` for the page content, followed by two more `<script>` tags (this time
regular *module* scripts, not `is:inline`, so they can `import`):
- Analytics bootstrap — imports `initAnalytics` and calls it with `document.documentElement.lang`
  (read from the DOM rather than passed via `define:vars`, because `define:vars` would force this
  script to be inlined, which breaks the `posthog-js` package import — see `analytics.md`'s "Why
  no cookies / why it reads `<html lang>`" section for the full reasoning).
- Scroll-reveal — a single `IntersectionObserver` (shared across the whole page) that adds a
  `revealed` class to any `.reveal` element once it's 15% visible, then stops observing it (each
  element only reveals once). Falls back to instantly revealing everything if
  `IntersectionObserver` isn't supported. This is what `Section.astro`'s wrapper class hooks into,
  and what `global.css`'s `.reveal`/`.reveal.revealed` rules animate.

## Components (`src/components`)

### `Page.astro`
The full homepage body for one locale — composes `Layout` + `Header` + the section components in
the fixed order: Hero → Features → HowItWorks → DictionaryShowcase → Faq → TechMarquee,
then `Footer` outside `<main>`. Also renders the keyboard-only "skip to content" link
(`t.nav.skipToContent`) as the very first focusable element, pointing at `<main id="main">`.
`src/pages/index.astro`, `src/pages/nl/index.astro`, and `src/pages/fr/index.astro` are each a
one-line wrapper: `<Page lang="xx" />`. Keeping the entire composition in this single component
(rather than duplicating it per route file) is what guarantees the three locale homepages never
drift out of structural sync.

### `SupportPage.astro`
The equivalent full-page composition for `/support`, `/nl/support`, `/fr/support`. Renders
`Layout` (with `subpath="support"` so hreflang/locale-redirect target the support page, not the
homepage) + `Header` (also told `subpath="support"` so its nav links point back to
`{home}#section` instead of assuming it's already on the homepage) + one `Section` containing:
an intro paragraph, a 2-column grid of `SUPPORT_PLATFORMS` cards (each linking out to the
donation platform, tracked via `data-ph-event="donate_click"`), a 3-column grid of "other ways to
help" cards (Star / Report issues / a "Tell a fellow reader" card with a row of pre-filled social
share intent links for X, Bluesky, Facebook, WhatsApp, Reddit, Telegram, built by
URL-encoding the localized share message + this locale's homepage URL), and a closing thanks line.
A small inline `<script>` wires the "Copy link" pill: copies `shareUrl` via
`navigator.clipboard.writeText`, flashes the localized "Copied!" label for two seconds, and
silently no-ops if the clipboard API throws (e.g. insecure context or permission denied).

### `Header.astro`
The sticky top nav, rendered on every page. Frontmatter takes `lang` and an optional `subpath`
(see above) and renders: the logo/wordmark (links to `#top` on the homepage, or back to the
locale's homepage from a subpage — `data-scroll-top` marks it for the smooth-scroll handler
below), the section nav links + "Get the app" CTA (hidden behind the hamburger below 900px), a
**language dropdown** (a button showing the current locale, toggling a searchable popover/sheet
listing every `LANGS` entry with native + English names and a checkmark on the active one), a
**theme toggle** button (cycles light → dark → system, showing a different icon per state), and
the mobile hamburger toggle.

The `<script>` block is the largest bit of imperative JS on the site, organized into clearly
commented sections:
- **Mobile menu** — toggles an `.open` class on the nav-links container, keeps the hamburger's
  icon/label/`aria-expanded` in sync, closes on any link click or outside click.
- **Language links** — each language-dropdown row carries `data-base` (that locale's URL) and
  `data-lang`; a `syncLangHref` function keeps every row's actual `href` equal to `data-base +
  location.hash`, so switching language while scrolled to `#faq` lands you on the same section in
  the new language. Re-run on `hashchange` and right before navigation (belt-and-suspenders).
  Clicking a row also fires a `language_change` analytics event and writes the choice to
  `localStorage["lang"]` — which is what `Layout.astro`'s pre-paint redirect script reads on the
  *next* page load.
- **Language dropdown open/close/search** — toggles the popover, focuses the search input on
  open, and filters the locale rows by a precomputed `data-filter` string (native name + English
  name + code, lowercased) as the user types; shows a "no results" message when nothing matches.
  Closes on outside click or Escape.
- **Theme toggle** — persists the 3-state preference (`light`/`dark`/`system`) to
  `localStorage["theme"]`, resolves it against the OS media query when `"system"`, updates
  `<html data-theme>` (which is what every themed CSS custom property in `global.css` keys off),
  swaps which SVG icon is visible, updates the aria-label, and fires a `theme_change` event. Also
  listens for OS theme changes live while the preference is `"system"`.
- **Scroll to top** — intercepts clicks on any `[data-scroll-top]` element, closes the mobile
  menu, smooth-scrolls to the top (instant if `prefers-reduced-motion`), and strips any `#hash`
  from the URL via `history.replaceState` so switching language afterwards doesn't jump back into
  a section.
- **Sticky-bar shadow** — toggles a `.scrolled` class (adds a drop shadow) once
  `window.scrollY > 8`.
- **Scroll-spy** — an `IntersectionObserver` watching each section marks the corresponding nav
  link `aria-current="true"` (styled accent in CSS) as it scrolls into a band roughly in the
  upper-middle of the viewport (`rootMargin: "-20% 0px -70% 0px"`), mirrors the active section
  into the URL hash via `replaceState` (not `pushState`, so it doesn't spam browser history or
  trigger a scroll jump), and fires a `section_view` event once per real section change. A second,
  separate observer watches the hero itself so nothing is marked "current" while it's in view.
  There's a subtlety called out in a comment: on a fresh load with a `#fragment` already in the
  URL (e.g. arriving from a language switch mid-page), the script manually
  `scrollIntoView({ behavior: "instant" })`s to that target *before* registering the scroll-spy
  observers — because this module script would otherwise run before the browser's own native
  fragment-scroll, and the scroll-spy's hero observer would fire first (viewport still at the top),
  incorrectly clear the hash, and lose the intended scroll target.

### `Hero.astro`
The above-the-fold section (`id="top"`). Renders the gradient headline (with a live link to
`#dictionary` styled via `global.css`'s `.text-gradient-accent`), the sub-line, a row of
check-marked "badge" pills built by splitting `t.hero.badges` on `·` (so the badges are just
plain translated text with a separator, not a structured array — keeps the `Copy` type simpler),
the download/CTA buttons (`Download for Android` wired to `data-ph-event="download_click"`; iOS
and Web are inert "coming soon" pills via `aria-disabled`), the `WordWall` trigger button, and the
`PhoneMockup` widget on the right. Also renders `FloatingWords` as a background layer. This
component itself has no `<script>` — all its interactivity lives in the child components.

### `FloatingWords.astro`
Decorative word cloud drifting behind the hero copy. The frontmatter defines a small deterministic
pseudo-random layout function (`hashString` → integer hash of the word, then `seeded` → a
sine-based PRNG seeded by that integer, then `range` to map into a bounding interval) so that
**the same word always lands in the same position/size/timing** — this matters because the exact
same hash/seed/range functions are duplicated in the client `<script>` below, so when live words
replace the fallback list there's no visual "reshuffle," any word that appears in both lists stays
put. At build time it renders the first `MAX_FLOATING_WORDS` of `HERO_WORDS` as absolutely
positioned `<span>`s with inline `style` (left/top/font-size/`--delay`/`--duration` custom
properties consumed by `global.css`'s `float-drift` keyframes). The `<script>` then, if
`PUBLIC_WORDS_API_URL` is set, fetches `${base}/words?order=top&limit=80` immediately and every 30
seconds, and — if the response has at least one word — replaces all the spans with freshly laid-
out ones for the live word list (`layer.replaceChildren(...)`). Any fetch failure or empty backend
response just leaves whatever's currently shown (initially the build-time fallback) untouched.

### `PhoneMockup.astro`
The most complex component on the site: a fake phone frame containing **four swipeable views**
(`search` → `book` → `words` → `readlist`) that play out as a scripted, animated demo story the
first time the phone scrolls into view — "search 1984 → open it → type doublethink → see its
definition → add a sentence and a note → jump to the Words List and filter by noun → land on the
Read List with the badge count bumped 12→13." The **`readlist` view is also the plain, static,
server-rendered default** (`is-active` from the start) — this is deliberate degradation: with JS
disabled, a visitor just sees a normal, real Read List UI (with working status-filter pills, via
the separate always-on `<script>` near the top), never a broken half-played animation.

Structure:
- Four `<section class="phone-view" data-view="...">` blocks stacked absolutely inside a
  fixed-height `.phone-stage`, each showing the relevant app screen with realistic (but static)
  markup — search results, the book detail page with an "add word" field and word card, the words
  list with part-of-speech filter chips, and the read list with status filter chips.
- A shared `.phone-tabbar` at the bottom whose active tab the story updates as it moves between
  views.
- A hidden "↻ Replay" button that appears once the story finishes.

Two `<script>` blocks:
1. A small always-on one wiring the Read List's status-filter pills (tap a pill → show/hide rows
   by `data-status`) — this works with or without the animation, since it's independent DOM logic.
2. The **story engine** — a hand-rolled, pausable step-queue "timeline": `add(delayMs, run?)`
   pushes `{ delay, run }` steps into an array; a `scheduleNext`/`play`/`pause` runner walks
   through them with `setTimeout`, tracking elapsed time so `pause()` (triggered when the phone
   scrolls off-screen or the tab becomes hidden) can later `play()` from exactly where it left off
   rather than restarting the current step's delay. `addTyping(field, speed, lead)` is a helper
   that queues one step per character to simulate typing into a fake input (with a blinking CSS
   caret via `global.css`), or — under `prefers-reduced-motion` — collapses to a single step that
   fills the field's text instantly with no per-character animation. The story itself
   (`add(600, () => setView("search")); addTyping(...); ...`) is just a flat sequential list of
   these steps mirroring the search→book→words→readlist walkthrough described above, ending by
   incrementing the visible word-count badge. `reset()` undoes every visual change (clears typed
   text, hides revealed elements, resets filters and the badge) and jumps (not slides — via a
   temporary `.no-anim` class) back to the search view, ready for `replay` to `play()` it again.
   An `IntersectionObserver` (50% threshold) starts the story the first time the phone is at least
   half visible and pauses/resumes it as it scrolls off/on screen; a `visibilitychange` listener
   also pauses when the browser tab itself is hidden. Under `prefers-reduced-motion`, the *same*
   step sequence still runs (so no-motion users still see the full walkthrough, not nothing) but
   `global.css` strips all the CSS transitions/animations that would otherwise animate view slides,
   field typing, and the highlight flash, so everything happens as instant cuts.

   The runner also feeds PostHog: it fires `demo_complete` when the queue finishes (the denominator
   — `replay_count: 0` marks a first, unprompted completion) and `demo_replay_click` on ↻, both
   carrying `replay_count`, `interrupted` (playback was paused at least once, i.e. the visitor
   scrolled away mid-story) and `reduced_motion`. These are imperative `track()` calls rather than
   `data-ph-event` because the properties are only known at click time — and an element with both
   would fire twice, once via the delegated listener. See [analytics.md](analytics.md).

### `Features.astro`
Renders the "Everything a reading habit needs" grid. The `ICONS` record maps each `IconName` (from
`content.ts`) to an inline SVG string built by a small `svg(inner)` helper (fixed 24×24 viewBox,
`stroke="currentColor"` so it inherits the surrounding `text-accent` color) — injected via
`set:html` rather than as literal JSX/Astro markup because the icons are looked up dynamically by
key. Iterates `t.features.items` (translated per locale) to render one card per feature, with a
`data-stagger` wrapper on the grid so `global.css`'s staggered fade-in animation applies once the
section scrolls into view.

### `HowItWorks.astro`
The 3-step "How it works" list — structurally identical to `Features.astro` but numbered (`{i +
1}` in a circular accent badge) instead of icon-based, iterating `t.howItWorks.steps`.

### `DictionaryShowcase.astro`
The interactive dictionary demo card (`#dictionary`), and the second most complex component after
`PhoneMockup`. Two distinct pieces of behavior:

**Build-time word lookup.** The frontmatter does a real, unauthenticated `fetch` at *build time*
against `api.dictionaryapi.dev` for a hardcoded demo word (`"flourish"`), so the shipped static
HTML shows genuine dictionary data without needing a live API call at runtime. It flattens the
nested API response (`entries[].meanings[].definitions[].definition`) into a flat `Item[]` list,
deduplicates identical `partOfSpeech|definition` pairs, caps at 12 entries, and falls back to a
hardcoded `FALLBACK` object (also for "flourish") if the network call fails or returns nothing —
so the page always builds successfully even without network access. The resulting `items` are
grouped by part-of-speech (preserving first-appearance order) into `groups`, which is what renders
the "choose other definition" bottom sheet's sectioned list, each row keeping a stable `index`
into the flat `items` array.

**Client-side interactivity**, in the `<script>`:
- The **"choose other definition" bottom sheet** — clicking `#dict-open` opens a `backDismiss`-
  wired modal (same pattern as `WordWall.astro`) listing every definition grouped by part of
  speech, with a text/POS filter input. Selecting a row updates the visible definition + part-of-
  speech label on the card (`setSelected`) and closes the sheet.
- The **live "try it" lookup form** — a real input where a visitor can type *any* English word;
  submitting hits the same `api.dictionaryapi.dev` endpoint client-side (mirroring the app's own
  English dictionary lookup path, per the code comment), with loading/error/not-found states
  driven by translated message templates stashed in `data-msg-*` attributes on the form. A
  successful lookup rebuilds the definition-sheet's rows from scratch (`renderRows`, using the
  same flatten/dedupe/cap/group logic duplicated client-side as `parseEntries`) and swaps out the
  static baked-in "Sentence"/"Notes" example blocks for a generic hint ("In the app, you'd now
  save this word with your own sentence and notes") since those examples were written specifically
  for "flourish". An empty form submit looks up a fixed example word (`petrichor`) instead of
  doing nothing, so the button always does *something* useful. Every lookup — build-time or
  live — reports a `dictionary_lookup` analytics event with the query, whether it was
  `found`/`not_found`/an `error`, and whether it was the empty-submit example query.

`posClass(pos)` (duplicated once in frontmatter, once in the client script, since the script can't
import frontmatter helpers) maps a part-of-speech string to one of the `text-pos-*` color
utilities defined in `global.css`'s `@theme` block, mirroring the app's own `POS_COLORS`.

### `Faq.astro`
Renders `t.faq.items` as native `<details>`/`<summary>` accordions (no custom JS needed for the
open/close behavior itself — the browser handles it, styled via `global.css`'s `.faq-item` rules
including the animated +/× marker and the smooth height transition using `interpolate-size`/
`::details-content`). The one bit of script listens for each `<details>`'s native `toggle` event
and fires a `faq_open` analytics event *only* when it just opened (the event also fires on close,
which is ignored) — capturing which question text was expanded.

### `TechMarquee.astro`
The "Built with open source" strip. A short intro blurb links to `REPO_URL` (note the nested-
anchor caveat in the comment: the outer element has to be a `<p>`-like non-anchor wrapper, not an
`<a>`, because an `<a>` can't validly contain another `<a>` — the HTML parser would otherwise split
the outer tag apart), then renders `TECH` twice in a row inside `.marquee-track` — the duplication
is what makes the CSS `translateX(-50%)` scroll animation (`global.css`'s `marquee-scroll`
keyframes) loop seamlessly, since translating by exactly half the (double-length) track's width
lands back where the single-length original started. The second copy is `aria-hidden="true"` and
`tabindex="-1"` so screen readers and keyboard tab order only ever see one set of chips.

### `Footer.astro`
Static site-wide footer: logo + copyright year (computed live via `new Date().getFullYear()`, so
it never needs manual updating), a tagline, a GitHub link (inline SVG octocat icon,
`data-ph-event="repo_click"`), and a "Support" link to `localeRoot(lang) + "support"`
(`data-ph-event="support_click"`).

### `Logo.astro`
The brand mark, ported as inline SVG (not an `<img>`) specifically so its fill colors reference
`var(--accent)` and theme correctly, and so it can be reused at any size via the `size` prop. Kept
byte-for-byte in sync with the mobile app's own logo asset
(`word-bank/assets/logo.svg`) — an accent-colored rounded square containing a white open-book
glyph with a bookmark. The optional `withWordmark` prop additionally renders the two-tone "Word"
(ink) / "Bank" (accent) text logotype beside the mark, matching the app logo's own two-tone fill
classes. Has its own scoped `<style>` block (one of only two components with inline `<style>`,
alongside none other — everything else styles via Tailwind utilities or `global.css`) since it's a
tiny, fully self-contained widget.

### `Section.astro`
The generic section wrapper reused by `Features`, `HowItWorks`, `DictionaryShowcase`, `Faq`, and
`SupportPage`: takes an optional `id` (for anchor/nav-link targeting) and `class`, and wraps the
slot in `<section class="section reveal {class}"><div class="mx-auto max-w-270 px-6"><slot
/></div></section>` — i.e. it supplies the standard page-width container and hooks the section
into the scroll-reveal system (`.reveal`, toggled to `.revealed` by `Layout.astro`'s
`IntersectionObserver`) for free. `Hero.astro` and `TechMarquee.astro` don't use it because they
need bespoke top-level markup (the hero needs the floating-words layer as a sibling inside the
section; the marquee needs an un-padded full-bleed track).

### `WordWall.astro`
The "words users have currently saved" glossary — a trigger button (dropped into the Hero) that
opens a bottom-sheet modal, structurally almost identical to `DictionaryShowcase.astro`'s
definition sheet (same `backDismiss` wiring, same open/close animation classes). Renders
`GLOSSARY_FALLBACK` server-side as the default content; the `<script>` then, if
`PUBLIC_WORDS_API_URL` is set, fetches `${base}/words?order=top&limit=120` once and, if any
returned word has both a `word` and a `definition`, wholesale-replaces the fallback rows with
live ones built via `document.createElement` (word, phonetic, POS chip, definition paragraph) —
otherwise it silently keeps showing the curated fallback list.

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
