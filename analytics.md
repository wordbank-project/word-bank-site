# Analytics (PostHog)

The site uses **PostHog** (product analytics) to measure the marketing funnel — how many
visitors land, in which language, how far they scroll, and, above all, **who clicks the Android
download button** (the conversion). It runs **cookieless**, so there is **no cookie/consent
banner** and nothing is stored in the browser.

> **Scope:** this is on the marketing **site only**. The Word Bank **app** deliberately has no
> analytics ("no account, no tracking, private by design") — do not add PostHog there without an
> explicit opt-in consent flow. See the app's `AGENTS.md`.

## TL;DR

- Set `PUBLIC_POSTHOG_KEY` (and optionally `PUBLIC_POSTHOG_HOST`) to turn analytics on.
- Leave `PUBLIC_POSTHOG_KEY` unset → **completely disabled**, the site builds and behaves exactly
  the same (same graceful-degradation pattern as `PUBLIC_WORDS_API_URL`).
- Cookieless (`persistence: "memory"`): no cookies, no `localStorage`, no `sessionStorage`.
- EU-hosted by default (`https://eu.i.posthog.com`).

## Setup

### 1. Create the PostHog project
Create a project on **PostHog EU Cloud** (https://eu.posthog.com) and copy its **Project API key**
(starts with `phc_`). The key is public/client-side by design — it can only *write* events.

### 2. Local development
Add the key to a root `.env` (gitignored; see `.env.example`):

```bash
PUBLIC_POSTHOG_KEY=phc_your_real_key
PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com   # optional, this is the default
```

Astro only exposes client env prefixed **`PUBLIC_`**. Restart `npm run dev` after changing it.
Leave `PUBLIC_POSTHOG_KEY` empty to keep dev quiet (no events sent).

### 3. Production (Netlify)
Set the env vars in the **Netlify dashboard** → Site settings → Environment variables:
`PUBLIC_POSTHOG_KEY` (required) and `PUBLIC_POSTHOG_HOST` (optional). They're read at build time
and inlined into the client bundle, so **trigger a redeploy** after adding them.

## What gets tracked

Generic **autocapture** is on (baseline: every click/pageview is recorded), and **exception
autocapture** (`capture_exceptions`) reports uncaught JS errors real visitors hit. Plus these named
events for clean funnels. Each locale (`/`, `/nl/`, `/fr/`) is its own URL, and every event carries
a `locale` super-property so you can segment by language.

| Event | Fires when | Properties | Tier |
|---|---|---|---|
| _(pageview)_ | Any page loads | `locale` (super-prop) | autocapture |
| _(`$exception`)_ | An uncaught JS error occurs | (posthog error props) | autocapture |
| `download_click` | Hero "Download Android" button clicked | `platform: "android"`, `location: "hero"` | **1 – conversion** |
| `cta_get_app_click` | Nav "Get the app" button clicked | — | **1 – conversion** |
| `dictionary_lookup` | A word is submitted in the `#dictionary` "try it" box | `query`, `result` (`found`/`not_found`/`error`), `is_example` | 2 – engagement |
| `section_view` | A section scrolls into view (features / how-it-works / dictionary / faq) | `section` | 2 – engagement |
| `faq_open` | An FAQ `<details>` is opened | `question` | 2 – engagement |
| `repo_click` | A GitHub/repo link is clicked | `location` (`footer`/`tech_blurb`) | 3 – nice-to-have |
| `language_change` | A locale is picked in the language dropdown | `from`, `to` | 3 – nice-to-have |
| `theme_change` | The light/dark/system toggle is cycled | `theme` | 3 – nice-to-have |

> **`dictionary_lookup.query` captures the searched term** — intentionally, so you can see what
> vocabulary interests visitors. It's a public English dictionary word (the input is `maxlength=40`),
> sent cookielessly with no identity attached. `is_example: true` marks an empty submit (which looks
> up the demo word), so real searches are easy to separate.

**The north-star metric** is `download_click`. The Hero button is currently a placeholder
(`href="#"`); the event already fires, so conversion data is ready the moment the button is wired
to a real APK/store link.

## How it works (code)

| File | Role |
|---|---|
| [src/lib/analytics.ts](src/lib/analytics.ts) | The whole integration: `initAnalytics(locale)` + `track(event, props)`. No-ops when no key is set. |
| [src/layouts/Layout.astro](src/layouts/Layout.astro) | Mounts it — a bundled `<script>` calls `initAnalytics(document.documentElement.lang)`. |
| [src/components/Hero.astro](src/components/Hero.astro) | `download_click` via declarative `data-ph-*` attributes. |
| [src/components/Header.astro](src/components/Header.astro) | `cta_get_app_click` (declarative) + `section_view` / `language_change` / `theme_change` (imperative `track()` calls in the existing script). |
| [src/components/Faq.astro](src/components/Faq.astro) | `faq_open` on the `<details>` toggle (open only). |

### Two ways to fire an event

1. **Declarative (no JS)** — add attributes to any element. It fires on click, with `data-ph-*`
   (minus the event name) as properties:
   ```html
   <a data-ph-event="download_click" data-ph-platform="android" data-ph-location="hero">…</a>
   ```
   A single delegated listener in `analytics.ts` handles all of these. Use this for simple clicks.

2. **Imperative** — import `track` into a component's `<script>` and call it inside existing
   handlers when you need dynamic properties:
   ```ts
   import { track } from "../lib/analytics";
   track("theme_change", { theme: next });
   ```

`track()` is a no-op until `initAnalytics()` has run with a key, so early calls are safe.

### Why no cookies / why it reads `<html lang>`
- `persistence: "memory"` keeps everything **in memory only — no cookies, no `localStorage`, no
  `sessionStorage`** — so no GDPR consent banner is needed (fits the "private" brand). Trade-off:
  a returning visitor or a cross-page navigation can be counted as a new person, so unique-visitor
  counts run high — acceptable for a marketing landing page where visit → download is the metric.
- We deliberately do **not** use PostHog's `cookieless_mode` here: in testing its events reached the
  Live stream but were **dropped before persisting** to the warehouse (Web analytics / Events stayed
  empty). `persistence: "memory"` gives the same no-storage guarantee and persists reliably.
- The mount script reads the locale from `document.documentElement.lang` rather than an Astro
  `define:vars`, because `define:vars` forces a `<script>` inline and would break the `posthog-js`
  ESM import. (Proven pattern — `Stats.astro` reads `import.meta.env` the same bundled way.)

## Configuration reference

Init options set in [src/lib/analytics.ts](src/lib/analytics.ts):

```ts
posthog.init(KEY, {
  api_host: HOST,                      // PUBLIC_POSTHOG_HOST ?? https://eu.i.posthog.com
  persistence: "memory",               // in-memory only → no cookies/storage, no consent banner
  capture_pageview: true,
  capture_pageleave: true,             // bounce / time-on-page
  disable_session_recording: true,     // lightweight + privacy-first
  cross_subdomain_cookie: false,
  person_profiles: "identified_only",
});
```

To add a new event: prefer declarative `data-ph-event` for a plain click; otherwise `import { track }`
and call it from the relevant handler. Keep event names `snake_case` and consistent with the table
above.

## Verifying

1. Put a real key in `.env`, run `npm run dev`, open the site.
2. **DevTools → Network:** confirm `POST https://eu.i.posthog.com/e/` requests return `200`.
3. **DevTools → Application:** Cookies **empty**, no PostHog `localStorage`/`sessionStorage` keys.
4. **PostHog → Activity / Live events:** a pageview arrives with a `locale` property; clicking the
   Hero button fires `download_click`; scrolling fires `section_view`; opening an FAQ fires
   `faq_open`; language/theme toggles fire their events.
5. Visit `/nl/` and `/fr/` — confirm `locale` is `nl` / `fr`.
6. **Disabled path:** unset `PUBLIC_POSTHOG_KEY`, reload → no PostHog network calls, page fully
   functional.

> Verified end-to-end during implementation: with a test key, events post to the EU host (200) and
> **no** cookies/`localStorage`/`sessionStorage` are created. Note posthog-js **batches** events
> fired close together into a single `/e/` request — that's expected, not a bug.

## Conventions
- Run `npm run build` (or `npm run check`) before considering an analytics change done — it
  type-checks the whole project, including `analytics.ts` and the config passed to `posthog.init`.
- Don't track anything personally identifying — this stays consistent with the brand's privacy
  promise. Event names + coarse properties (locale, section, platform) only.
