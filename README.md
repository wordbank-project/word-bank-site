# Word Bank — site

**The marketing site for Word Bank — multilingual, static, fast.**

The landing page that showcases the Word Bank app, with a live "word wall" of words people have saved — fed by [word-bank-server](https://github.com/wordbank-project/word-bank-server) — and an interactive dictionary demo backed by [wiktapi.dev](https://github.com/jensrot/wiktapi.dev). Live at **[wordbankapp.com](https://wordbankapp.com)**.

_Part of the [Word Bank](https://github.com/wordbank-project/word-bank) project._

## Tech

Astro (static output) · Tailwind CSS v4 · TypeScript · **no React** (the few interactive bits are plain `<script>`). Deployed on Netlify.

## Run it

```bash
npm install
npm run dev            # dev server (hot reload)
npm run build          # static build → dist/
npm run preview        # serve the built dist/
npm run check          # astro check (type-checks .astro + TS)
npm run gen:favicons   # regenerate favicons/og-image from public/favicon.svg
```

## Configuration

Every variable is optional and every one degrades gracefully — the site builds and renders with none of them set. Copy `.env.example` to `.env` (gitignored) for local development.

| Variable | Purpose | Unset behaviour |
| --- | --- | --- |
| `PUBLIC_WORDS_API_URL` | The word-bank-server feed behind the floating words and word wall. **Include `/v1`.** | Both fall back to a curated word list |
| `PUBLIC_DICT_API_URL` | The dictionary API behind the showcase — build-time lookup and live in-page search. **No `/v1`**, the component appends it. | Defaults to `https://dict.wordbankapp.com` |
| `PUBLIC_POSTHOG_KEY` | Enables analytics | Analytics fully off |
| `PUBLIC_POSTHOG_HOST` | Where the browser sends events | Defaults to `/ingest`, the same-origin proxy — correct for production |

```bash
cp .env.example .env
```

Two things that catch people out:

- **The `/v1` is not symmetric.** `PUBLIC_WORDS_API_URL` carries it because call sites append a bare `/words`; `PUBLIC_DICT_API_URL` must not, because the showcase appends `/v1/{edition}/...` itself.
- **A placeholder value is worse than no value.** The defaults only trigger on an unset or empty variable, so leaving `PUBLIC_DICT_API_URL=PUBLIC_DICT_API_URL` from the example file produces a relative URL that 404s against the site's own origin. Set it properly or delete the line.

Astro only exposes client-side variables prefixed `PUBLIC_`, and it inlines them at **build time** — changing one means rebuilding, not just reloading.

## Languages

The site supports **English, Dutch, and French** via build-time locale routes: `/` (English), `/nl/` (Dutch), and `/fr/` (French), each fully translated into static HTML, plus a `/support` page per locale. All copy lives in `src/i18n/en.ts`, `src/i18n/nl.ts`, and `src/i18n/fr.ts` — a shared `Copy` interface keeps them in sync, so `npm run check` fails if a locale is missing a key. A language dropdown in the nav switches between them and remembers the choice.

## Analytics

[PostHog](https://posthog.com), cookieless — no cookie banner, no consent flow. It measures the marketing funnel, above all the Android download-click conversion, and is entirely off unless `PUBLIC_POSTHOG_KEY` is set.

In production, events route through `/ingest` — a same-origin reverse proxy declared in `netlify.toml` — so ad blockers matching PostHog's hostnames don't silently drop them. That proxy is a Netlify rewrite, which the Astro dev server does not apply, so locally `PUBLIC_POSTHOG_HOST` must point at the direct EU host instead. See [`analytics.md`](./analytics.md) for the full event list and setup.

## Deploy

`npm run build` emits a static `dist/` you can host anywhere. Production is Netlify, building on push.

**Production environment variables come from the Netlify dashboard, not from `.env`** — that file is gitignored and never reaches the build. Since `PUBLIC_*` values are inlined at build time, adding or changing one in the dashboard does nothing until the next deploy. `PUBLIC_WORDS_API_URL` is the one to check: it has no code default, so if it is missing there, the word wall quietly shows the curated fallback on the live site with no error anywhere.

The canonical site URL is read from Netlify's `URL` variable at build time so `og:image` and `canonical` resolve absolutely.

See [`AGENTS.md`](./AGENTS.md) for structure, content conventions, styling and theming, plus the per-area walkthroughs in [`docs/`](./docs).

## License

Released under the MIT License — see the [Word Bank project](https://github.com/wordbank-project/word-bank).
