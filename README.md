# Word Bank — site

**The marketing site for Word Bank — multilingual, static, fast.**

The landing page that showcases the Word Bank app, with a live "word wall" and "words the users have currently saved" fed by [word-bank-server](https://github.com/wordbank-project/word-bank-server). Live at **[word-bank-vault.netlify.app](https://word-bank-vault.netlify.app)**.

_Part of the [Word Bank](https://github.com/wordbank-project/word-bank) project._

## Tech

Astro (static output) · Tailwind CSS v4 · TypeScript · **no React** (the few interactive bits are plain `<script>`). Deployed on Netlify.

## Run it

```bash
npm install
npm run dev       # dev server (hot reload)
npm run build     # static build → dist/
npm run preview   # serve the built dist/
npm run check     # astro check (type-checks .astro + TS)
```

## Configuration

Set `PUBLIC_WORDS_API_URL` in a `.env` to power the live floating words + stats from the word-bank-server feed. Leave it unset and the page still builds and renders — the floating words fall back to a curated list and the stats section stays hidden.

```bash
echo 'PUBLIC_WORDS_API_URL=http://localhost:4000/v1' > .env
```

## Languages

The site supports **English, Dutch, and French** via build-time locale routes: `/` (English), `/nl/` (Dutch), and `/fr/` (French), each fully translated into static HTML. All copy lives in `src/i18n/en.ts`, `src/i18n/nl.ts`, and `src/i18n/fr.ts` (a shared `Copy` type keeps them in sync); a language dropdown in the nav switches between them.

## Deploy

`npm run build` emits a static `dist/` — host it anywhere. The production deploy is Netlify (the site URL is injected at build time so `og:image`/canonical resolve correctly). See [`AGENTS.md`](./AGENTS.md) for structure, content conventions, and theming details.

## License

Released under the MIT License — see the [Word Bank project](https://github.com/wordbank-project/word-bank).
