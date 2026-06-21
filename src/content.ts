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

export type Feature = {
    icon: IconName;
    title: string;
    description: string;
};

export const FEATURES: Feature[] = [
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
];

export type Step = {
    title: string;
    description: string;
};

export const STEPS: Step[] = [
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
];

export type Faq = {
    question: string;
    answer: string;
};

export const FAQS: Faq[] = [
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
];

// Word Bank is open source — link the repo from the "Built with" section.
export const REPO_URL = 'https://github.com/jensrot/word-bank';

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

export type ReadStatus = 'want' | 'reading' | 'read';

export const STATUS_LABELS: Record<ReadStatus, string> = {
    want: 'Want to read',
    reading: 'Currently reading',
    read: 'Have read',
};

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
