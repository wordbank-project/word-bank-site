import type { Copy } from './index';

// Dutch copy — mirrors the shape of `en.ts` (enforced by the `Copy` type).
export const nl: Copy = {
    meta: {
        title: 'Word Bank — jouw persoonlijke woordenkluis',
        description:
            'Word Bank is een leesmetgezel: houd bij wat je leest en bewaar elk nieuw woord met de definitie, je eigen zin en je notities — in de taal die jij leest.',
    },
    nav: {
        links: [
            { href: '#features', label: 'Functies' },
            { href: '#how-it-works', label: 'Hoe het werkt' },
            { href: '#dictionary', label: 'Woordenboek' },
            { href: '#faq', label: 'FAQ' },
        ],
        cta: 'Download de app',
        backToTop: 'Word Bank — terug naar boven',
        openMenu: 'Menu openen',
        closeMenu: 'Menu sluiten',
        theme: { prefix: 'Thema', light: 'licht', dark: 'donker', system: 'systeem' },
        langSwitch: 'View in English',
    },
    hero: {
        headlinePre: 'Verander de boeken die je leest in ',
        headlineLink: 'woordenschat',
        headlinePost: ' die je bijblijft',
        sub: ' is een leesmetgezel. Houd bij wat je wilt lezen, aan het lezen bent of hebt gelezen — en telkens als een woord je tegenhoudt, bewaar je het met de definitie, je eigen zin en je persoonlijke notities.',
        badges: 'Gratis tijdens de bèta · Geen account · Werkt offline',
        downloadAndroid: 'Download voor Android',
        androidBeta: '(bèta)',
        iosSoon: 'iOS — binnenkort',
        webSoon: 'Web — binnenkort',
    },
    features: {
        heading: 'Alles wat een leesgewoonte nodig heeft',
        sub: 'Eén app voor de boeken die je leest en de woorden die ze je leren.',
        items: [
            {
                icon: 'search',
                title: 'Doorzoek miljoenen boeken',
                description:
                    'Vind elke titel of auteur via Open Library, compleet met covers — en blijf scrollen, resultaten laden terwijl je gaat.',
            },
            {
                icon: 'list',
                title: 'Eén leeslijst, drie statussen',
                description:
                    'Elk boek staat in één lijst als Wil ik lezen, Aan het lezen of Gelezen. Filter met één tik op status, en boeken sorteren op hoeveel woorden ze je hebben geleerd.',
            },
            {
                icon: 'stack',
                title: 'Een woordbank voor elk boek',
                description:
                    'Elk boek heeft zijn eigen woordenschat. Zie in één oogopslag hoeveel woorden een boek je heeft geleerd.',
            },
            {
                icon: 'bolt',
                title: 'Directe definities',
                description:
                    'Typ een woord en krijg meteen de betekenis — inclusief woordsoort en IPA-uitspraak.',
            },
            {
                icon: 'layers',
                title: 'Kies de juiste definitie',
                description:
                    'De meeste woorden hebben meerdere betekenissen. Word Bank haalt ze allemaal op en laat je de juiste zoeken en kiezen — met woordsoorten in kleur, zodat zelfstandig naamwoord, werkwoord en bijvoeglijk naamwoord opvallen.',
            },
            {
                icon: 'sort',
                title: 'Al je woorden op één plek',
                description:
                    'De Woordenlijst verzamelt elk woord uit elk boek. Zoek direct, filter op alleen zelfstandige of bijvoeglijke naamwoorden, en sorteer A–Z, op boek of op meest recent toegevoegd.',
            },
            {
                icon: 'pencil',
                title: 'Zinnen & notities',
                description:
                    'Laat woorden beklijven: bewaar de zin waarin je ze vond en voeg je eigen notities en associaties toe.',
            },
            {
                icon: 'star',
                title: 'Recensies & notities per boek',
                description:
                    'Naast notities per woord schrijf je voor elk boek een recensie en algemene notities — tik op de tekst om ze altijd te bewerken.',
            },
            {
                icon: 'globe',
                title: 'Lees in jouw voorkeurstaal',
                description:
                    'Definities in de taal waarin je leest — mogelijk gemaakt door Wiktionary-data met ondersteuning voor 100+ talen. Engels en Nederlands nu, meer volgt.',
            },
            {
                icon: 'camera',
                title: 'Eigen boeken',
                description:
                    'Lees je iets dat in geen enkele catalogus staat? Voeg je eigen boek toe en maak een cover met je camera of fotobibliotheek.',
            },
            {
                icon: 'lock',
                title: 'Privé van nature',
                description:
                    'Geen account, geen cloud, geen tracking. Je boeken en woorden staan op je toestel en werken offline.',
            },
            {
                icon: 'moon',
                title: 'Donkere modus inbegrepen',
                description:
                    'Een volwaardig donker thema voor leessessies laat op de avond — schakel het op elk moment in de app in.',
            },
        ],
    },
    howItWorks: {
        heading: 'Hoe het werkt',
        sub: 'Drie stappen, daarna wordt het een gewoonte.',
        steps: [
            {
                title: 'Vind een boek',
                description:
                    'Zoek op titel of auteur — of maak een eigen boek met een eigen coverfoto voor al het andere dat je leest.',
            },
            {
                title: 'Bewaar het met een status',
                description:
                    'Wil ik lezen, Aan het lezen of Gelezen. Tik op een status en het wordt meteen opgeslagen; wijzig het wanneer het leven daarom vraagt.',
            },
            {
                title: 'Voeg woorden toe terwijl je leest',
                description:
                    'Kom je een woord tegen dat je niet kent? Typ het in, kies de passende definitie en veranker het met je eigen zin en notities.',
            },
        ],
    },
    dictionary: {
        heading: 'Een woordenboek dat jouw taal spreekt',
        paragraphs: [
            'Zoek een woord op zodra je het tegenkomt. Word Bank toont de definitie, woordsoort en IPA-uitspraak — en laat je het verankeren met de zin waarin je het vond en je eigen notities.',
            'Woorden betekenen zelden maar één ding, dus elke betekenis wordt in één keer opgehaald. Zoek en kies de definitie die past, met woordsoorten in kleur voor een snel overzicht.',
            'Opzoekingen draaien op Wiktionary-data via een eigen woordenboekmotor, met ondersteuning voor meer dan honderd talen. Engels en Nederlands zijn nu beschikbaar; meer volgt.',
        ],
        chipsAria: 'Beschikbare talen',
        chips: { english: 'Engels', dutch: 'Nederlands', more: 'meer binnenkort' },
        sentenceLabel: 'Zin',
        notesLabel: 'Notities',
        demoSentence: 'Ze ondertekende de brief met een sierlijke pennenstreek.',
        demoNotesHtml:
            'Van het Latijnse <span class="italic">florere</span>, “bloeien” — dezelfde stam als <span class="italic">flora</span> en <span class="italic">floreren</span>.',
        chooseOther: 'Kies een andere definitie',
        chooseOtherAriaPre: 'Kies een andere definitie van ',
        dialogAria: 'Kies een definitie',
        searchPlaceholder: 'Definities zoeken...',
        emptyPre: 'Geen definities komen overeen met “',
        emptyPost: '”.',
        close: 'Sluiten',
        definitionsForPre: 'Definities voor: ',
    },
    faq: {
        heading: 'Veelgestelde vragen',
        items: [
            {
                question: 'Op welke platformen draait Word Bank?',
                answer:
                    'Vandaag op Android, als bèta-APK die je rechtstreeks installeert. Een iOS-versie via TestFlight staat als volgende gepland — en een webversie in de browser is onderweg, zodat je Word Bank kunt gebruiken zonder iets te installeren.',
            },
            {
                question: 'Hoeveel kost het?',
                answer: 'Niets — Word Bank is gratis tijdens de bèta.',
            },
            {
                question: 'Welke talen worden ondersteund?',
                answer:
                    'De Engelse en Nederlandse woordenboeken zijn vandaag beschikbaar. De woordenboekmotor draait op Wiktionary-data met 100+ talen, dus er volgen er meer.',
            },
            {
                question: 'Waar worden mijn gegevens bewaard?',
                answer:
                    'Volledig op je toestel. Er is geen account en geen server die je leeslijst bewaart — de app werkt offline en je woorden blijven van jou.',
            },
            {
                question: 'Kan ik alle woorden bekijken die ik heb bewaard?',
                answer:
                    'Ja. De Woordenlijst verzamelt elk woord uit elk boek op één plek. Doorzoek ze, filter op zelfstandige of bijvoeglijke naamwoorden, en sorteer A–Z, op boek of op meest recent toegevoegd — tik op een woord om terug te springen naar het boek waar het vandaan komt.',
            },
            {
                question: 'Kan ik boeken bijhouden die niet in de catalogus staan?',
                answer:
                    'Ja. Maak een eigen boek met een eigen titel, auteur en jaar, en geef het een cover rechtstreeks vanuit je camera of fotobibliotheek.',
            },
        ],
    },
    tech: {
        heading: 'Gebouwd met open source',
        blurbLink: 'Word Bank is gratis en open source.',
        blurbRest: 'Meld gerust problemen en draag bij.',
    },
    footer: {
        tagline: 'Jouw persoonlijke woordenkluis',
    },
    phone: {
        aria: 'Word Bank-app met een leeslijst met statussen en woordtellingen',
        readList: 'Leeslijst',
        filters: { all: 'Alle', want: 'Wil ik lezen', reading: 'Aan het lezen', read: 'Gelezen' },
        tabs: { search: 'Zoeken', readList: 'Leeslijst', wordList: 'Woordenlijst' },
        wordSingular: 'woord',
        wordPlural: 'woorden',
    },
    wordWall: {
        trigger: 'Bekijk de woorden die gebruikers nu bewaren',
        title: 'Woorden die gebruikers nu bewaren:',
        panelAria: 'Woorden die gebruikers bewaren',
        close: 'Sluiten',
    },
    stats: {
        aria: 'Live woordstatistieken',
        collected: 'woorden die lezers hebben verzameld',
        topWord: 'meest bewaarde woord',
        perDay: 'woorden per dag toegevoegd',
    },
    statusLabels: { want: 'Wil ik lezen', reading: 'Aan het lezen', read: 'Gelezen' },
};
