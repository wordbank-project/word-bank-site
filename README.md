# word-bank-site

Landing page for the Word Bank app. **Astro + Tailwind CSS v4 + TypeScript** (no React).

```bash
npm install     # once
npm run dev     # local dev server
npm run build   # static build → dist/
npm run preview # serve the built dist/
```

Optional: set `PUBLIC_WORDS_API_URL` in a `.env` (see `.env.example`) to power the live
floating-words and stats sections from the word-bank-server feed. See `AGENTS.md` for details.
```bash
echo 'PUBLIC_WORDS_API_URL=http://localhost:4000' > .env
```
