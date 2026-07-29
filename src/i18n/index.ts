// Internationalisation layer for the site.
//
// The site is built as static per-locale routes: `/` (English), `/nl/` (Dutch),
// `/fr/` (French). Each `.astro` component takes a `lang` prop and resolves its
// copy via `getCopy(lang)` — so the HTML is fully translated at build time (no
// runtime text-swapping, no flash, SEO-friendly). The `Copy` interface is the
// single shape every locale must satisfy, so `npm run check` fails if a
// translation key is missing.
//
// ── Adding a language ────────────────────────────────────────────────────────
// Everything (the header dropdown, hreflang alternates, og:locale, the
// remembered-choice redirect) derives from the registry below, so a new
// language needs exactly four touches:
//   1. Create `src/i18n/xx.ts` exporting a `Copy` object (copy en.ts and
//      translate — the type guarantees you can't miss a key).
//   2. Register it here: add to the `Lang` union, `LANGS`, `LANG_META`, `COPY`.
//   3. Create `src/pages/xx/index.astro` containing `<Page lang="xx" />`.
//   4. Add the locale to the sitemap config in `astro.config.mjs`.
// Fields typed `Record<Lang, string>` (e.g. `dictionary.chips.names`) will
// type-error in every existing locale file until the new language's translated
// name is added there — that's the sync guarantee, not a chore to skip.
import type { IconName, SupportPlatformId } from '../content';
import { en } from './en';
import { nl } from './nl';
import { fr } from './fr';

export type Lang = 'en' | 'nl' | 'fr';
export const LANGS: Lang[] = ['en', 'nl', 'fr'];
export const DEFAULT_LANG: Lang = 'en';

// Display metadata per locale — drives the language dropdown (native name bold,
// English name muted below), plus the `og:locale` meta tag.
export const LANG_META: Record<
    Lang,
    { code: string; native: string; english: string; ogLocale: string }
> = {
    en: { code: 'EN', native: 'English', english: 'English', ogLocale: 'en_US' },
    nl: { code: 'NL', native: 'Nederlands', english: 'Dutch', ogLocale: 'nl_NL' },
    fr: { code: 'FR', native: 'Français', english: 'French', ogLocale: 'fr_FR' },
};

export interface Copy {
    meta: { title: string; description: string };
    nav: {
        links: { href: string; label: string }[];
        cta: string;
        backToTop: string; // aria
        openMenu: string; // aria
        closeMenu: string; // aria
        theme: { prefix: string; light: string; dark: string; system: string }; // aria pieces
        language: { label: string; search: string; noResults: string }; // dropdown: trigger aria, search placeholder, empty state
        skipToContent: string; // keyboard-only skip link
    };
    hero: {
        headlinePre: string;
        headlineLink: string;
        headlinePost: string;
        sub: string; // rendered immediately after the italic "Word Bank" brand
        badges: string;
        downloadAndroid: string;
        androidBeta: string;
        iosSoon: string;
        webSoon: string;
    };
    features: { heading: string; sub: string; items: { icon: IconName; title: string; description: string }[] };
    howItWorks: { heading: string; sub: string; steps: { title: string; description: string }[] };
    dictionary: {
        heading: string;
        paragraphs: string[];
        chipsAria: string;
        // One translated name per registered locale (rendered as the "available
        // languages" chips, in LANGS order) + the muted "more soon" chip.
        chips: { names: Record<Lang, string>; more: string };
        tryLabel: string; // label above the live-lookup input in the demo card
        tryPlaceholder: string;
        tryButton: string;
        tryLoading: string;
        tryError: string;
        tryNotFoundPre: string; // "No entry found for “" — query — tryNotFoundPost
        tryNotFoundPost: string;
        tryHint: string; // shown instead of the baked-in Sentence/Notes after a live lookup
        sentenceLabel: string;
        notesLabel: string;
        demoSentence: string;
        demoNotesHtml: string; // trusted inline HTML (italic Latin roots)
        chooseOther: string;
        chooseOtherAriaPre: string;
        dialogAria: string;
        searchPlaceholder: string;
        emptyPre: string;
        emptyPost: string;
        close: string;
        definitionsForPre: string;
    };
    faq: { heading: string; items: { question: string; answer: string }[] };
    tech: { heading: string; blurbLink: string; blurbRest: string };
    footer: { tagline: string; support: string };
    supportPage: {
        meta: { title: string; description: string };
        heading: string;
        intro: string;
        donateHeading: string;
        donateSub: string;
        platforms: Record<SupportPlatformId, string>; // one blurb per donation platform
        otherHeading: string;
        otherSub: string;
        other: Record<'star' | 'issues' | 'share', { title: string; description: string }>;
        // The social share row inside the "share" card: nav aria label, the
        // prefilled share message, and the copy-link button's two states.
        shareLinks: { aria: string; message: string; copy: string; copied: string };
        thanks: string;
    };
    phone: {
        aria: string;
        readList: string;
        filters: { all: string; want: string; reading: string; read: string };
        tabs: { search: string; readList: string; wordList: string };
        // Part-of-speech chips on the Words List view (the "All" chip reuses filters.all).
        wordPos: { noun: string; verb: string; adjective: string };
        // Placeholder in the Words List search bar (decorative in the demo).
        wordSearch: string;
        wordSingular: string;
        wordPlural: string;
        // Copy for the animated mockup story (search → add word → sentence/note
        // → Words List). Proper nouns (titles, the word, IPA) live in
        // content.ts PHONE_DEMO.
        demo: {
            searchPlaceholder: string;
            addPlaceholder: string;
            addButton: string;
            pos: string; // "noun", localized
            definition: string;
            sentenceLabel: string;
            sentence: string;
            noteLabel: string;
            note: string;
            plusOne: string; // the "✓ +1" celebration pill
            replay: string; // replay button label + aria
        };
    };
    wordWall: { trigger: string; title: string; panelAria: string; close: string };
    stats: { aria: string; collected: string; topWord: string; perDay: string };
    statusLabels: { want: string; reading: string; read: string };
}

const COPY: Record<Lang, Copy> = { en, nl, fr };

export function getCopy(lang: Lang): Copy {
    return COPY[lang];
}

/** Root path for a locale: `/` for the default language, `/xx/` otherwise. */
export function localeRoot(lang: Lang): string {
    return lang === DEFAULT_LANG ? '/' : `/${lang}/`;
}
