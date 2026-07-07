export type IconName =
    | 'search'
    | 'list'
    | 'stack'
    | 'bolt'
    | 'layers'
    | 'sort'
    | 'pencil'
    | 'star'
    | 'globe'
    | 'camera'
    | 'lock'
    | 'moon';

// Feature/Step/Faq copy now lives per-locale in src/i18n/{en,nl}.ts (the
// `Copy` interface in src/i18n/index.ts defines their shape). This file keeps
// only language-invariant data (proper nouns, structural/demo data, config).
export type Feature = {
    icon: IconName;
    title: string;
    description: string;
};

// Word Bank is open source — link the repo from the "Built with" section.
export const REPO_URL = 'https://github.com/wordbank-project/word-bank';

export type Tech = {
    name: string;
    /** Official GitHub repository — chips link here (opens in a new tab). */
    url: string;
    /** Visually emphasise this chip in the marquee. */
    highlight?: boolean;
};

// Major technologies the app is built on, shown in the scrolling marquee.
// Each links to its open-source GitHub repo.
export const TECH: Tech[] = [
    { name: 'Expo SDK 55', url: 'https://github.com/expo/expo' },
    { name: 'React Native', url: 'https://github.com/facebook/react-native' },
    { name: 'React 19', url: 'https://github.com/facebook/react' },
    { name: 'TypeScript', url: 'https://github.com/microsoft/TypeScript' },
    { name: 'NativeWind', url: 'https://github.com/nativewind/nativewind' },
    { name: 'Expo Router', url: 'https://github.com/expo/expo/tree/main/packages/expo-router' },
    { name: 'Reanimated', url: 'https://github.com/software-mansion/react-native-reanimated' },
    { name: 'AsyncStorage', url: 'https://github.com/react-native-async-storage/async-storage' },
    { name: 'Wiktionary · wiktapi.dev', url: 'https://github.com/TheAlexLichter/wiktapi.dev' },
    { name: 'Open Library', url: 'https://github.com/internetarchive/openlibrary' },
];

// Status labels (Want to read / Currently reading / Have read) are translated —
// see `statusLabels` in src/i18n/{en,nl}.ts.
export type ReadStatus = 'want' | 'reading' | 'read';

export type MockBook = {
    title: string;
    author: string;
    status: ReadStatus;
    wordCount: number;
    coverColor: string;
};

export const MOCK_BOOKS: MockBook[] = [
    { title: '1984', author: 'George Orwell', status: 'reading', wordCount: 12, coverColor: '#c0533e' },
    { title: 'De Avonden', author: 'Gerard Reve', status: 'want', wordCount: 0, coverColor: '#3e6ec0' },
    { title: 'Moby Dick', author: 'Herman Melville', status: 'read', wordCount: 47, coverColor: '#2f7d5c' },
    { title: 'Pride and Prejudice', author: 'Jane Austen', status: 'reading', wordCount: 8, coverColor: '#8d5fb0' },
];

// Data for the animated phone-mockup story (search 1984 → add "doublethink" →
// sentence + note → Words List). Proper nouns / untranslatable bits live here;
// the translatable strings (definition, sentence, note, labels) are in the
// per-locale Copy under `phone.demo`. The searched book is MOCK_BOOKS[0], so
// the story ends on the Read List with its badge bumping 12 → 13.
export const PHONE_DEMO = {
    query: '1984',
    results: [
        { title: '1984', author: 'George Orwell', coverColor: '#c0533e' },
        { title: 'Animal Farm', author: 'George Orwell', coverColor: '#3e8f6b' },
        { title: 'Homage to Catalonia', author: 'George Orwell', coverColor: '#b0863e' },
    ],
    word: 'doublethink',
    ipa: '/ˈdʌbəlˌθɪŋk/',
    // Words already in the Words List view before "doublethink" is added.
    existingWords: [
        { word: 'thoughtcrime', ipa: '/ˈθɔːtkraɪm/' },
        { word: 'memory hole', ipa: '/ˈmɛməri hoʊl/' },
    ],
} as const;

// The single knob for how many words float in the Hero. Change this number.
export const MAX_FLOATING_WORDS = 36;

// Fallback list of evocative vocabulary words shown floating behind the Hero
// when the words server is unreachable or VITE_WORDS_API_URL is unset.
export const HERO_WORDS: string[] = [
    'serendipity',
    'ephemeral',
    'melancholy',
    'resilience',
    'eloquent',
    'ambiguous',
    'tenacious',
    'vivid',
    'profound',
    'meticulous',
    'candid',
    'perseverance',
    'whimsical',
    'diligent',
    'luminous',
    'ineffable',
    'petrichor',
    'solitude',
    'nostalgia',
    'wanderlust',
    'euphoria',
    'mellifluous',
    'quintessence',
    'ethereal',
    'sonder',
    'halcyon',
    'labyrinth',
    'cascade',
    'lucid',
    'verdant',
    'zephyr',
    'aurora',
    'ephemera',
    'reverie',
    'cadence',
    'oblivion',
    'paradox',
    'sublime',
    'tranquil',
    'vestige',
];

// Curated word + definition list for the "words people are saving" glossary.
// Shown as a build-time / no-backend fallback; the live feed (with real saved
// words + their dictionary definitions) replaces it when available. Covers each
// part of speech so the colour-coded `text-pos-*` utilities are all generated.
export type GlossaryWord = {
    word: string;
    partOfSpeech: string;
    phonetic?: string;
    definition: string;
};

export const GLOSSARY_FALLBACK: GlossaryWord[] = [
    { word: 'serendipity', partOfSpeech: 'noun', phonetic: '/ˌsɛɹ.ənˈdɪp.ɪ.ti/', definition: 'The occurrence of events by chance in a happy or beneficial way.' },
    { word: 'ephemeral', partOfSpeech: 'adjective', phonetic: '/ɪˈfɛm.ər.əl/', definition: 'Lasting for a very short time.' },
    { word: 'saunter', partOfSpeech: 'verb', phonetic: '/ˈsɔːn.tər/', definition: 'To walk in a slow, relaxed manner, without hurry or effort.' },
    { word: 'deftly', partOfSpeech: 'adverb', phonetic: '/ˈdɛft.li/', definition: 'In a neatly skilful and quick way.' },
    { word: 'petrichor', partOfSpeech: 'noun', phonetic: '/ˈpɛt.rɪ.kɔːr/', definition: 'The pleasant, earthy smell after rain falls on dry ground.' },
    { word: 'mellifluous', partOfSpeech: 'adjective', phonetic: '/məˈlɪf.lu.əs/', definition: 'Sweet or musical; pleasant to hear.' },
    { word: 'reverie', partOfSpeech: 'noun', phonetic: '/ˈrɛv.ər.i/', definition: "A state of being pleasantly lost in one's thoughts; a daydream." },
    { word: 'halcyon', partOfSpeech: 'adjective', phonetic: '/ˈhæl.si.ən/', definition: 'Denoting a past period that was idyllically happy and peaceful.' },
];
