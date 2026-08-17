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
- EU-hosted (`eu.i.posthog.com`), reached in production through a **same-origin reverse proxy**
  at `/ingest` so ad blockers don't drop events — see [Reverse proxy](#reverse-proxy).

## Setup

### 1. Create the PostHog project
Create a project on **PostHog EU Cloud** (https://eu.posthog.com) and copy its **Project API key**
(starts with `phc_`). The key is public/client-side by design — it can only *write* events.

### 2. Local development
Add the key to a root `.env` (gitignored; see `.env.example`):

```bash
PUBLIC_POSTHOG_KEY=phc_your_real_key
PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com   # required locally — see below
```

Astro only exposes client env prefixed **`PUBLIC_`**. Restart `npm run dev` after changing it.
Leave `PUBLIC_POSTHOG_KEY` empty to keep dev quiet (no events sent).

`PUBLIC_POSTHOG_HOST` **must** be set locally. It defaults to `/ingest`, and `npm run dev` is the
Astro dev server, which does not apply `netlify.toml` rewrites — so the default would 404. Point it
at the direct EU host, or run `npx netlify dev` to exercise the real proxy.

### 3. Production (Netlify)
Set **`PUBLIC_POSTHOG_KEY`** in the **Netlify dashboard** → Site configuration → Environment
variables. Read at build time and inlined into the client bundle, so **trigger a redeploy** after
adding it.

**Leave `PUBLIC_POSTHOG_HOST` unset in the dashboard** so production falls back to the `/ingest`
proxy. If it's set to `https://eu.i.posthog.com`, events go direct and blockers can drop them.

## Reverse proxy

### What is a reverse proxy?

A middleman that sits in front of a server and forwards requests to it, so the visitor only ever
talks to **one** address — yours.

Without one, the browser talks to PostHog directly. The request has PostHog's name on it, so an ad
blocker recognises it and cancels it before it is ever sent:

```
  browser ──► eu.i.posthog.com     ✗ blocked: that name is on a tracker list
```

With one, the browser asks *our own site* for `/ingest/...`. Netlify's CDN fetches the answer from
PostHog behind the scenes and hands it back. Nothing the browser sends mentions PostHog, so there
is no third-party name left to match against:

```
  browser ──► our-domain/ingest/... ──► eu.i.posthog.com
              ^^^^^^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^
              all the browser sees      Netlify calls this
              — and it's first-party    server-side; the
                                        browser never knows
```

Think of it like a mail-forwarding address: people write to your PO box, and the post office
quietly relays it to where you actually live. Senders never learn the real address.

**Why "reverse"?** A normal (forward) proxy sits in front of the *client* and hides **who is
asking** — that's what a VPN does. A reverse proxy sits in front of the *server* and hides **who is
answering**. Same relaying trick, opposite end of the conversation.

**What it does not do:** it is not a privacy trick against the visitor. The same events still reach
PostHog, and the site stays cookieless either way (see *Why no cookies* below). It only stops
blocklists from silently deleting analytics for the sizeable share of visitors running a blocker —
which otherwise makes the download-conversion numbers quietly wrong in a way you cannot see.

**The cost:** the requests now flow through Netlify, so they count toward your bandwidth, and if
Netlify is down analytics is down with it. Both are negligible at this traffic level.

### Why we have one

PostHog's Installation Health flags a missing reverse proxy: blocker lists match `*.i.posthog.com`,
so a direct integration loses events from anyone running uBlock Origin et al. Routing through our
own origin makes the requests first-party.

**Server half — [netlify.toml](netlify.toml).** Three `status = 200` rewrites (proxied by Netlify's
CDN, so the browser only ever sees our domain):

| Path | Upstream |
|---|---|
| `/ingest/static/*` | `eu-assets.i.posthog.com/static/:splat` |
| `/ingest/array/*` | `eu-assets.i.posthog.com/array/:splat` |
| `/ingest/*` | `eu.i.posthog.com/:splat` |

Order matters — both asset rules must precede the catch-all. The two asset rules are not optional
even though posthog-js is bundled from npm: remote config comes from `/array/<token>/config`, and
`capture_exceptions` lazy-loads its chunk from `/static/`.

PostHog's own Netlify recipe adds `host = "eu-assets.i.posthog.com"` to each rule. That key is not
in Netlify's redirect schema (`netlify-redirect-parser` destructures only
`from`/`to`/`status`/`force`/`query`/`conditions`/`signed`/`headers`/`rate_limit`) so it is silently
dropped — omitted here, since a proxy rewrites the `Host` header to the destination anyway.

**Client half — [src/lib/analytics.ts](src/lib/analytics.ts).** `api_host` defaults to `/ingest`,
and `ui_host` is pinned to `https://eu.posthog.com` so the toolbar and every "view in PostHog" link
resolve to the real app rather than our domain.

**Moving region** (EU → US) means changing the three upstreams in `netlify.toml` *and* `UI_HOST`
in `analytics.ts` together.

### Verifying the proxy

Locally, with `npx netlify dev` (plain `npm run dev` will not apply the rewrites):

```bash
curl -o /dev/null -w '%{http_code} %{content_type}\n' localhost:8888/ingest/static/array.js
# 200 application/javascript  (~230 KB)

curl -o /dev/null -w '%{http_code} %{size_download}\n' "localhost:8888/ingest/array/$PUBLIC_POSTHOG_KEY/config"
# 200, same byte size as the direct https://eu-assets.i.posthog.com/... call
```

A `404` with `content_type: text/html` is Netlify's own miss (rule not matching); a `400` from
`POST /ingest/e/` is PostHog rejecting a bogus payload, which means the proxy *did* reach it.

In production, load the site and confirm the Network tab shows requests to `<your-domain>/ingest/…`
and none to `*.i.posthog.com`, then check PostHog → Web analytics → Installation Health.

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
| `donate_click` | A donation platform link is clicked on the support page | `location` (the platform id) | **1 – conversion** |
| `dictionary_lookup` | A word is submitted in the `#dictionary` "try it" box | `query`, `result` (`found`/`not_found`/`error`), `is_example` | 2 – engagement |
| `section_view` | A section scrolls into view (features / how-it-works / dictionary / faq) | `section` | 2 – engagement |
| `faq_open` | An FAQ `<details>` is opened | `question` | 2 – engagement |
| `demo_complete` | The phone-mockup story plays through to the end | `location`, `replay_count`, `interrupted`, `reduced_motion` | 2 – engagement |
| `demo_replay_click` | The phone mockup's ↻ replay button is clicked | `location`, `replay_count`, `seconds_since_complete`, `interrupted`, `reduced_motion` | 2 – engagement |
| `analyze_select` | An example sentence chip is chosen in the "Analyze a sentence" demo | `example` (index of the chosen sentence) | 2 – engagement |
| `memory_flip` | A card in the "Memory" demo is flipped to reveal its back | `index` (position in the demo deck) | 2 – engagement |
| `memory_rate` | "Still learning" / "Knew it ✓" is tapped after flipping a Memory card | `rating` (`knew`/`still_learning`), `index` | 2 – engagement |
| `memory_round_complete` | A Memory demo round finishes | `knew`, `total` | 2 – engagement |
| `share_click` | A share link/copy-link button is clicked on the support page | `location` (network name / `copy_link`) | 3 – nice-to-have |
| `memory_round_restart` | "Practice again" is clicked at the end of a Memory round | — | 3 – nice-to-have |
| `support_help_click` | A "how to help" item is clicked on the support page | `location` (the item key) | 3 – nice-to-have |
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
| [src/components/SupportPage.astro](src/components/SupportPage.astro) | `donate_click` / `support_help_click` / `share_click` (declarative). |
| [src/components/PhoneMockup.astro](src/components/PhoneMockup.astro) | `demo_complete` / `demo_replay_click` (imperative — see below). |
| [src/components/Practice.astro](src/components/Practice.astro) | `analyze_select` (declarative) + `memory_flip` / `memory_rate` / `memory_round_complete` (imperative) + `memory_round_restart` (declarative). |

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

**Don't mix the two on one element.** The delegated listener fires for any ancestor carrying
`data-ph-event`, so an element that both has the attribute *and* calls `track()` in its own handler
sends the event twice. When a click needs dynamic properties, drop the attribute — that's why
`PhoneMockup.astro`'s ↻ button is imperative.

### The phone-mockup demo

The hero mockup plays a walkthrough that pauses when scrolled off-screen or the tab is hidden, and
reveals a ↻ replay button only once it has played through. Two events come out of it:

- **`demo_complete`** — the story reached the end. This is the **denominator**: filter to
  `replay_count = 0` for first, unprompted completions, and `demo_replay_click` becomes a
  meaningful rate instead of a bare count.
- **`demo_replay_click`** — ↻ was clicked. `replay_count` is which pass this is (a *second*
  replay is the strongest pre-download interest signal on the page) and `seconds_since_complete`
  separates an immediate re-click from a deliberate scroll-back.

`interrupted` (playback was paused at least once) is the property that keeps the metric honest: a
replay after an interrupted run means *"I missed it"*, not *"I liked it"* — opposite conclusions
that are otherwise indistinguishable. `reduced_motion` flags the motion-free variant, which fills
text in one beat instead of typing; if it replays far more, that version is too fast to follow.

All counters are per-pageview, which is all `persistence: "memory"` supports — fine here, since the
demo and the `download_click` it feeds both live on the landing page.

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
  api_host: HOST,                      // PUBLIC_POSTHOG_HOST || "/ingest" (the reverse proxy)
  ui_host: UI_HOST,                    // https://eu.posthog.com — so PostHog links/toolbar work
  persistence: "memory",               // in-memory only → no cookies/storage, no consent banner
  capture_pageview: true,
  capture_pageleave: true,             // bounce / time-on-page
  capture_exceptions: true,            // uncaught JS errors real visitors hit
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
