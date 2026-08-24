# Components (`src/components`)

> Part of the [AGENTS.md](../AGENTS.md) file-by-file code walkthrough — what each component
> does, why it's written the way it is, and how it connects to the rest of the site.

## `Page.astro`
The full homepage body for one locale — composes `Layout` + `Header` + the section components in
the fixed order: Hero → Features → HowItWorks → DictionaryShowcase → Faq → TechMarquee,
then `Footer` outside `<main>`. Also renders the keyboard-only "skip to content" link
(`t.nav.skipToContent`) as the very first focusable element, pointing at `<main id="main">`.
`src/pages/index.astro`, `src/pages/nl/index.astro`, and `src/pages/fr/index.astro` are each a
one-line wrapper: `<Page lang="xx" />`. Keeping the entire composition in this single component
(rather than duplicating it per route file) is what guarantees the three locale homepages never
drift out of structural sync.

## `SupportPage.astro`
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

## `Header.astro`
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

## `Hero.astro`
The above-the-fold section (`id="top"`). Renders the gradient headline (with a live link to
`#dictionary` styled via `global.css`'s `.text-gradient-accent`), the sub-line, a row of
check-marked "badge" pills built by splitting `t.hero.badges` on `·` (so the badges are just
plain translated text with a separator, not a structured array — keeps the `Copy` type simpler),
the download/CTA buttons (`Download for Android` wired to `data-ph-event="download_click"`; iOS
and Web are inert "coming soon" pills via `aria-disabled`), the `WordWall` trigger button, and the
`PhoneMockup` widget on the right. Also renders `FloatingWords` as a background layer. This
component itself has no `<script>` — all its interactivity lives in the child components.

## `FloatingWords.astro`
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

## `PhoneMockup.astro`
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
   would fire twice, once via the delegated listener. See [analytics.md](../analytics.md).

## `Features.astro`
Renders the "Everything a reading habit needs" grid. The `ICONS` record maps each `IconName` (from
`content.ts`) to an inline SVG string built by a small `svg(inner)` helper (fixed 24×24 viewBox,
`stroke="currentColor"` so it inherits the surrounding `text-accent` color) — injected via
`set:html` rather than as literal JSX/Astro markup because the icons are looked up dynamically by
key. Iterates `t.features.items` (translated per locale) to render one card per feature, with a
`data-stagger` wrapper on the grid so `global.css`'s staggered fade-in animation applies once the
section scrolls into view.

## `HowItWorks.astro`
The 3-step "How it works" list — structurally identical to `Features.astro` but numbered (`{i +
1}` in a circular accent badge) instead of icon-based, iterating `t.howItWorks.steps`.

## `DictionaryShowcase.astro`
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

## `Faq.astro`
Renders `t.faq.items` as native `<details>`/`<summary>` accordions (no custom JS needed for the
open/close behavior itself — the browser handles it, styled via `global.css`'s `.faq-item` rules
including the animated +/× marker and the smooth height transition using `interpolate-size`/
`::details-content`). The one bit of script listens for each `<details>`'s native `toggle` event
and fires a `faq_open` analytics event *only* when it just opened (the event also fires on close,
which is ignored) — capturing which question text was expanded.

## `TechMarquee.astro`
The "Built with open source" strip. A short intro blurb links to `REPO_URL` (note the nested-
anchor caveat in the comment: the outer element has to be a `<p>`-like non-anchor wrapper, not an
`<a>`, because an `<a>` can't validly contain another `<a>` — the HTML parser would otherwise split
the outer tag apart), then renders `TECH` twice in a row inside `.marquee-track` — the duplication
is what makes the CSS `translateX(-50%)` scroll animation (`global.css`'s `marquee-scroll`
keyframes) loop seamlessly, since translating by exactly half the (double-length) track's width
lands back where the single-length original started. The second copy is `aria-hidden="true"` and
`tabindex="-1"` so screen readers and keyboard tab order only ever see one set of chips.

## `Footer.astro`
Static site-wide footer: logo + copyright year (computed live via `new Date().getFullYear()`, so
it never needs manual updating), a tagline, a GitHub link (inline SVG octocat icon,
`data-ph-event="repo_click"`), and a "Support" link to `localeRoot(lang) + "support"`
(`data-ph-event="support_click"`).

## `Logo.astro`
The brand mark, ported as inline SVG (not an `<img>`) specifically so its fill colors reference
`var(--accent)` and theme correctly, and so it can be reused at any size via the `size` prop. Kept
byte-for-byte in sync with the mobile app's own logo asset
(`word-bank/assets/logo.svg`) — an accent-colored rounded square containing a white open-book
glyph with a bookmark. The optional `withWordmark` prop additionally renders the two-tone "Word"
(ink) / "Bank" (accent) text logotype beside the mark, matching the app logo's own two-tone fill
classes. Has its own scoped `<style>` block (one of only two components with inline `<style>`,
alongside none other — everything else styles via Tailwind utilities or `global.css`) since it's a
tiny, fully self-contained widget.

## `Section.astro`
The generic section wrapper reused by `Features`, `HowItWorks`, `DictionaryShowcase`, `Faq`, and
`SupportPage`: takes an optional `id` (for anchor/nav-link targeting) and `class`, and wraps the
slot in `<section class="section reveal {class}"><div class="mx-auto max-w-270 px-6"><slot
/></div></section>` — i.e. it supplies the standard page-width container and hooks the section
into the scroll-reveal system (`.reveal`, toggled to `.revealed` by `Layout.astro`'s
`IntersectionObserver`) for free. `Hero.astro` and `TechMarquee.astro` don't use it because they
need bespoke top-level markup (the hero needs the floating-words layer as a sibling inside the
section; the marquee needs an un-padded full-bleed track).

## `WordWall.astro`
The "words users have currently saved" glossary — a trigger button (dropped into the Hero) that
opens a bottom-sheet modal, structurally almost identical to `DictionaryShowcase.astro`'s
definition sheet (same `backDismiss` wiring, same open/close animation classes). Renders
`GLOSSARY_FALLBACK` server-side as the default content; the `<script>` then, if
`PUBLIC_WORDS_API_URL` is set, fetches `${base}/words?order=top&limit=120` once and, if any
returned word has both a `word` and a `definition`, wholesale-replaces the fallback rows with
live ones built via `document.createElement` (word, phonetic, POS chip, definition paragraph) —
otherwise it silently keeps showing the curated fallback list.
