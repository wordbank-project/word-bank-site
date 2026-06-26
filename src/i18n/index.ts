// Internationalisation layer for the site.
//
// The site is built as static per-locale routes: `/` (English) and `/nl/`
// (Dutch). Each `.astro` component takes a `lang` prop and resolves its copy
// via `getCopy(lang)` — so the HTML is fully translated at build time (no
// runtime text-swapping, no flash, SEO-friendly). The `Copy` interface is the
// single shape every locale must satisfy, so `npm run check` fails if a
// translation key is missing.
import type { IconName } from '../content';
import { en } from './en';
import { nl } from './nl';

export type Lang = 'en' | 'nl';
export const LANGS: Lang[] = ['en', 'nl'];
export const DEFAULT_LANG: Lang = 'en';

// Display label for each locale — the language toggle shows the *other* one.
export const LANG_META: Record<Lang, { code: string; name: string }> = {
    en: { code: 'EN', name: 'English' },
    nl: { code: 'NL', name: 'Nederlands' },
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
        langSwitch: string; // aria-label on the language toggle (phrased in the other language)
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
        chips: { english: string; dutch: string; more: string };
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
    footer: { tagline: string };
    phone: {
        aria: string;
        readList: string;
        filters: { all: string; want: string; reading: string; read: string };
        tabs: { search: string; readList: string; wordList: string };
        wordSingular: string;
        wordPlural: string;
    };
    wordWall: { trigger: string; title: string; panelAria: string; close: string };
    stats: { aria: string; collected: string; topWord: string; perDay: string };
    statusLabels: { want: string; reading: string; read: string };
}

const COPY: Record<Lang, Copy> = { en, nl };

export function getCopy(lang: Lang): Copy {
    return COPY[lang];
}

export function otherLang(lang: Lang): Lang {
    return lang === 'en' ? 'nl' : 'en';
}

/** Root path for a locale: `/` for English, `/nl/` for Dutch. */
export function localeRoot(lang: Lang): string {
    return lang === 'en' ? '/' : '/nl/';
}
