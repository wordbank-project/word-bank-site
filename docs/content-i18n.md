# Content & internationalisation

> Part of the [AGENTS.md](../AGENTS.md) file-by-file code walkthrough — the language-invariant
> data file and the i18n registry/locale files.

## `src/content.ts`
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

## `src/i18n/index.ts`
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

## `src/i18n/en.ts`, `src/i18n/nl.ts`, `src/i18n/fr.ts`
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
