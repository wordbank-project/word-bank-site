import type { Copy } from './index';

// English copy — the source-of-truth wording. `nl.ts` mirrors this shape.
export const en: Copy = {
    meta: {
        title: 'Word Bank — your personal words vault',
        description:
            'Word Bank is a reading companion: track what you read and save every new word with its definition, your sentence, and your notes — in your preferred language.',
    },
    nav: {
        links: [
            { href: '#features', label: 'Features' },
            { href: '#how-it-works', label: 'How it works' },
            { href: '#dictionary', label: 'Dictionary' },
            { href: '#faq', label: 'FAQ' },
        ],
        cta: 'Get the app',
        backToTop: 'Word Bank — back to top',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        theme: { prefix: 'Theme', light: 'light', dark: 'dark', system: 'system' },
        langSwitch: 'Bekijk in het Nederlands',
    },
    hero: {
        headlinePre: 'Turn the books you read into ',
        headlineLink: 'vocabulary',
        headlinePost: ' you keep',
        sub: ' is a reading companion. Track what you want to read, are reading, or have read — and every time a word stops you, save it with its definition, your sentence, and your personal notes.',
        badges: 'Free during beta · No account · Works offline',
        downloadAndroid: 'Download for Android',
        androidBeta: '(beta)',
        iosSoon: 'iOS — coming soon',
        webSoon: 'Web — coming soon',
    },
    features: {
        heading: 'Everything a reading habit needs',
        sub: 'One app for the books you read and the words they teach you.',
        items: [
            {
                icon: 'list',
                title: 'Track every book you read',
                description:
                    'Search millions of books and sort them into Want to read, Currently reading, or Have read.',
            },
            {
                icon: 'layers',
                title: 'Instant, precise definitions',
                description:
                    'Every meaning at once, with part of speech and IPA — search and pick the one that fits.',
            },
            {
                icon: 'pencil',
                title: 'Make words stick',
                description:
                    'Save each word with the sentence you found it in and your own notes.',
            },
            {
                icon: 'sort',
                title: 'All your words in one place',
                description:
                    'The Words List gathers every word from every book — search, filter, and sort instantly.',
            },
        ],
    },
    howItWorks: {
        heading: 'How it works',
        sub: 'Three steps, then it becomes a habit.',
        steps: [
            {
                title: 'Find a book',
                description:
                    'Search by title or author — or create a custom book with its own cover photo for anything else you read.',
            },
            {
                title: 'Save it with a status',
                description:
                    'Want to read, Currently reading, or Have read. Tap a status and it saves instantly; change it whenever life happens.',
            },
            {
                title: 'Add words as you read',
                description:
                    'Hit a word you do not know? Type it in, pick the definition that fits, and anchor it with your own sentence and notes.',
            },
        ],
    },
    dictionary: {
        heading: 'A dictionary that speaks your language',
        paragraphs: [
            'Words rarely mean just one thing. Word Bank fetches every meaning and lets you pick the right one — with part of speech, IPA pronunciation, and colour-coding.',
            'Powered by Wiktionary data with support for 100+ languages. English and Dutch are live today; more on the way.',
        ],
        chipsAria: 'Available languages',
        chips: { english: 'English', dutch: 'Nederlands', more: 'more soon' },
        sentenceLabel: 'Sentence',
        notesLabel: 'Notes',
        demoSentence: 'She ended the letter with a flourish of the pen.',
        demoNotesHtml:
            'From Latin <span class="italic">florere</span>, “to bloom” — same root as <span class="italic">flora</span> and <span class="italic">flower</span>.',
        chooseOther: 'Choose other definition',
        chooseOtherAriaPre: 'Choose another definition of ',
        dialogAria: 'Choose a definition',
        searchPlaceholder: 'Search definitions...',
        emptyPre: 'No definitions match “',
        emptyPost: '”.',
        close: 'Close',
        definitionsForPre: 'Definitions for: ',
    },
    faq: {
        heading: 'Frequently asked questions',
        items: [
            {
                question: 'Which platforms does Word Bank run on?',
                answer:
                    'Android today, as a beta APK you install directly. An iOS version via TestFlight is planned next — and a browser-based web version is on the way, so you will be able to use Word Bank without installing anything.',
            },
            {
                question: 'How much does it cost?',
                answer: 'Nothing — Word Bank is free while in beta.',
            },
            {
                question: 'Which languages are supported?',
                answer:
                    'English and Dutch dictionaries are live today. The dictionary engine is built on Wiktionary data covering 100+ languages, so more are on the way.',
            },
            {
                question: 'Where is my data stored?',
                answer:
                    'Entirely on your device. There is no account and no server holding your reading list — the app works offline and your words stay yours.',
            },
            {
                question: 'Can I browse all the words I have saved?',
                answer:
                    'Yes. The Words List collects every word from every book in one place. Search across them, filter to nouns or adjectives, and sort A–Z, by book, or by most recently added — tap any word to jump back to the book it came from.',
            },
            {
                question: 'Can I track books that are not in the catalog?',
                answer:
                    'Yes. Create a custom book with its own title, author, and year, and give it a cover straight from your camera or photo library.',
            },
        ],
    },
    tech: {
        heading: 'Built with open source',
        blurbLink: 'Word Bank is free and open source.',
        blurbRest: 'Feel free to report issues and contribute.',
    },
    footer: {
        tagline: 'Your personal words vault',
    },
    phone: {
        aria: 'Word Bank app showing a read list with statuses and word counts',
        readList: 'Read List',
        filters: { all: 'All', want: 'Want to read', reading: 'Currently Reading', read: 'Have read' },
        tabs: { search: 'Search', readList: 'Read List', wordList: 'Word list' },
        wordSingular: 'word',
        wordPlural: 'words',
    },
    wordWall: {
        trigger: 'See the words users have currently saved',
        title: 'Words users have currently saved:',
        panelAria: 'Words users are saving',
        close: 'Close',
    },
    stats: {
        aria: 'Live word stats',
        collected: 'words readers have collected',
        topWord: 'most-saved word',
        perDay: 'words added per day',
    },
    statusLabels: { want: 'Want to read', reading: 'Currently reading', read: 'Have read' },
};
