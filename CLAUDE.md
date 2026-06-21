# Word Bank — Marketing / Showcase Site

A static landing page that showcases the **Word Bank** mobile app (the Expo/React Native
app in the sibling `word-bank/` directory). Its job is to explain the app's features and
link to the beta download — it is **not** the app itself and shares no code with it.

## Stack

- **Vite 7** + **React 19** + **TypeScript**, plain **CSS** (no Tailwind / UI library).
- Single-page site, no router — `App.tsx` stacks one section per screenful.
- Styling lives entirely in [src/index.css](src/index.css) with design tokens at the top
  (`--accent: #208aef` matches the app's splash color). Keep new styles there.

## Scripts

```bash
npm run dev       # vite dev server (hot reload)
npm run build     # tsc -b && vite build  → outputs dist/
npm run preview   # serve the built dist/ locally
```
Deploy = build and host the static `dist/` on any static host.

## Structure

```
index.html              # Vite entry
src/
  main.tsx              # React root
  App.tsx              # composes the page: Nav → Hero → Features → HowItWorks
                       #                    → DictionaryShowcase → Faq → TechMarquee → Footer
  content.ts           # ALL copy/data (single source of truth) — edit this first
  index.css            # all styles + design tokens
  components/
    Nav.tsx            # top nav
    Hero.tsx           # headline + PhoneMockup
    PhoneMockup.tsx    # fake phone rendering MOCK_BOOKS with STATUS_LABELS
    Features.tsx       # FEATURES grid; maps IconName → inline SVG (ICONS map)
    HowItWorks.tsx     # STEPS
    DictionaryShowcase.tsx  # hand-written sample "word card" (not data-driven)
    Faq.tsx            # FAQS accordion/list
    TechMarquee.tsx    # "Built with open source" — continuously scrolling TECH chips + GitHub repo link
    Section.tsx        # wrapper that fades sections in via useReveal
    Footer.tsx
  hooks/
    useReveal.ts       # IntersectionObserver scroll-reveal hook used by Section
```

## How to update content (the common task)

**Almost all copy is data in [src/content.ts](src/content.ts)** — edit there and the
components render it:

- `FEATURES: Feature[]` — the features grid. Each has `{ icon, title, description }`.
- `STEPS: Step[]` — the "How it works" steps.
- `FAQS: Faq[]` — the FAQ entries.
- `STATUS_LABELS: Record<ReadStatus, string>` — reading-status display names
  (must mirror the app: **Want to read / Currently reading / Have read**).
- `MOCK_BOOKS: MockBook[]` — the fake books shown in the phone mockup.
- `TECH: Tech[]` — the technologies shown in the scrolling `TechMarquee` (`{ name, highlight? }`; `highlight` accent-styles a chip, e.g. **NativeWind**).
- `REPO_URL` — the open-source GitHub repo, linked from `TechMarquee`.

### Adding a feature with a new icon
Icons are inline SVGs, not an icon font. To use a new icon you must update **two** places:
1. Add the name to the `IconName` union in [content.ts](src/content.ts).
2. Add a matching entry to the `ICONS` map in [Features.tsx](src/components/Features.tsx)
   (reuse the `icon(<>…</>)` helper; 24×24 viewBox, `stroke="currentColor"`).
Reusing an existing icon needs neither.

### Non-data sections
`DictionaryShowcase.tsx` is hand-written JSX (a sample word card), not driven by
`content.ts` — edit it directly (and add any styles to `index.css`). Same for Hero/Nav/Footer.

## Keeping it in sync with the app

This site should reflect what the app actually does. The app's architecture and feature
set are documented in `../word-bank/AGENTS.md`. When the app gains/renames a feature,
update `content.ts` (and `DictionaryShowcase`/`PhoneMockup` if visual) to match — e.g. the
read statuses, the multiple-definitions picker, the Words List (search / part-of-speech
filter / sort), and per-book review & notes.

## Platforms advertised

The site lists the app's availability in two places that must stay consistent:
- the **Hero** download row ([Hero.tsx](src/components/Hero.tsx)) — "Download for Android",
  plus disabled "iOS — coming soon" and "Web — coming soon" chips, and
- the **"Which platforms…" FAQ** in [content.ts](src/content.ts).

A **browser-based web version** of the app is planned (it can be exported from the Expo
app via `npx expo export -p web` — see `../word-bank/web.md`). It's advertised as
"coming soon"; once it ships, flip the Hero chip to a real link and update that FAQ.

## Conventions

- Marketing copy: clear and honest — don't promise features the app doesn't ship
  (e.g. "Pro"/provider-switching in the app is a placeholder; don't advertise it).
- Run `npm run build` (or `npx tsc -p tsconfig.app.json --noEmit`) before considering a
  change done — the build type-checks the whole project.
