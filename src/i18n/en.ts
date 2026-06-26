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
                icon: 'search',
                title: 'Search millions of books',
                description:
                    'Find any title or author through Open Library, complete with covers — and keep scrolling, results load as you go.',
            },
            {
                icon: 'list',
                title: 'One read list, three statuses',
                description:
                    'Every book lives in a single list as Want to read, Currently reading, or Have read. Filter by status with one tap, and books sort by how many words each has taught you.',
            },
            {
                icon: 'stack',
                title: 'A word bank for every book',
                description:
                    'Each book carries its own vocabulary. See at a glance how many words a book has taught you.',
            },
            {
                icon: 'bolt',
                title: 'Instant definitions',
                description:
                    'Type a word and get its meaning right away — including part of speech and IPA pronunciation.',
            },
            {
                icon: 'layers',
                title: 'Choose the right definition',
                description:
                    'Most words have several meanings. Word Bank fetches them all and lets you search and pick the exact one — with parts of speech colour-coded so noun, verb and adjective stand apart.',
            },
            {
                icon: 'sort',
                title: 'All your words in one place',
                description:
                    'The Words List gathers every word from every book. Search instantly, filter to just nouns or adjectives, and sort A–Z, by book, or by most recently added.',
            },
            {
                icon: 'pencil',
                title: 'Sentences & notes',
                description:
                    'Make words stick: save the sentence where you found them and add your own notes and associations.',
            },
            {
                icon: 'star',
                title: 'Reviews & notes per book',
                description:
                    'Beyond per-word notes, write a review and general notes for each book — tap the text to edit any time.',
            },
            {
                icon: 'globe',
                title: 'Read in your preferred language',
                description:
                    'Definitions in the language you read in — powered by Wiktionary data with support for 100+ languages. English and Dutch today, more coming.',
            },
            {
                icon: 'camera',
                title: 'Custom books',
                description:
                    'Reading something that is not in any catalog? Add your own book and snap a cover with your camera or photo library.',
            },
            {
                icon: 'lock',
                title: 'Private by design',
                description:
                    'No account, no cloud, no tracking. Your books and words are stored on your device and work offline.',
            },
            {
                icon: 'moon',
                title: 'Dark mode included',
                description:
                    'A proper dark theme for late-night reading sessions — toggle it any time from inside the app.',
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
            'Look a word up the moment you meet it. Word Bank shows the definition, part of speech, and IPA pronunciation — then lets you anchor it with the sentence you found it in and your own notes.',
            'Words rarely mean just one thing, so every meaning is fetched at once. Search and pick the definition that fits, with parts of speech colour-coded at a glance.',
            'Lookups are powered by Wiktionary data through a dedicated dictionary engine, with support for over a hundred languages. English and Dutch are live today; more are on the way.',
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
