# Library code & Layout

> Part of the [AGENTS.md](../AGENTS.md) file-by-file code walkthrough — the shared `src/lib`
> utilities and the outer `src/layouts/Layout.astro` shell every page renders through.

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
