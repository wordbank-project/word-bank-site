import type { Copy } from './index';

// French copy — mirrors the shape of `en.ts` (enforced by the `Copy` type).
export const fr: Copy = {
    meta: {
        title: 'Word Bank — votre coffre à mots personnel',
        description:
            'Word Bank est un compagnon de lecture : suivez vos lectures et enregistrez chaque nouveau mot avec sa définition, votre phrase et vos notes — dans la langue de votre choix.',
    },
    nav: {
        links: [
            { href: '#features', label: 'Fonctionnalités' },
            { href: '#how-it-works', label: 'Comment ça marche' },
            { href: '#dictionary', label: 'Dictionnaire' },
            { href: '#faq', label: 'FAQ' },
        ],
        cta: 'Obtenir l’app',
        backToTop: 'Word Bank — retour en haut',
        openMenu: 'Ouvrir le menu',
        closeMenu: 'Fermer le menu',
        theme: { prefix: 'Thème', light: 'clair', dark: 'sombre', system: 'système' },
        language: { label: 'Changer de langue', search: 'Rechercher une langue...', noResults: 'Aucune langue trouvée' },
        skipToContent: 'Aller au contenu',
    },
    hero: {
        headlinePre: 'Transformez les livres que vous lisez en ',
        headlineLink: 'vocabulaire',
        headlinePost: ' qui vous reste',
        sub: ' est un compagnon de lecture. Suivez ce que vous voulez lire, lisez ou avez lu — et chaque fois qu’un mot vous arrête, enregistrez-le avec sa définition, votre phrase et vos notes personnelles.',
        badges: 'Gratuit pendant la bêta · Sans compte · Fonctionne hors ligne',
        downloadAndroid: 'Télécharger pour Android',
        androidBeta: '(bêta)',
        iosSoon: 'iOS — bientôt disponible',
        webSoon: 'Web — bientôt disponible',
    },
    features: {
        heading: 'Tout ce qu’il faut pour une habitude de lecture',
        sub: 'Une seule app pour les livres que vous lisez et les mots qu’ils vous apprennent.',
        items: [
            {
                icon: 'list',
                title: 'Suivez chaque livre que vous lisez',
                description:
                    'Cherchez parmi des millions de livres et classez-les en À lire, En cours de lecture ou Lu.',
            },
            {
                icon: 'layers',
                title: 'Des définitions instantanées et précises',
                description:
                    'Tous les sens d’un coup, avec la nature du mot et la prononciation API — cherchez et choisissez le bon.',
            },
            {
                icon: 'pencil',
                title: 'Retenez les mots durablement',
                description:
                    'Enregistrez chaque mot avec la phrase où vous l’avez trouvé et vos propres notes.',
            },
            {
                icon: 'sort',
                title: 'Tous vos mots au même endroit',
                description:
                    'La liste de mots rassemble chaque mot de chaque livre — cherchez, filtrez et triez instantanément.',
            },
        ],
    },
    howItWorks: {
        heading: 'Comment ça marche',
        sub: 'Trois étapes, puis ça devient une habitude.',
        steps: [
            {
                title: 'Trouvez un livre',
                description:
                    'Cherchez par titre ou auteur — ou créez un livre personnalisé avec sa propre photo de couverture pour tout le reste de vos lectures.',
            },
            {
                title: 'Enregistrez-le avec un statut',
                description:
                    'À lire, En cours de lecture ou Lu. Touchez un statut et c’est enregistré ; changez-le au gré de vos lectures.',
            },
            {
                title: 'Ajoutez des mots en lisant',
                description:
                    'Un mot inconnu ? Saisissez-le, choisissez la définition qui convient et enregistrez-le avec votre propre phrase et vos notes.',
            },
        ],
    },
    dictionary: {
        heading: 'Un dictionnaire qui parle votre langue',
        paragraphs: [
            'Les mots ont rarement un seul sens. Word Bank récupère chaque signification et vous laisse choisir la bonne — avec la nature du mot, la prononciation API et un code couleur.',
            'Propulsé par les données de Wiktionary, avec plus de 100 langues. L’anglais, le néerlandais et le français sont disponibles aujourd’hui ; d’autres arrivent.',
        ],
        chipsAria: 'Langues disponibles',
        chips: { names: { en: 'Anglais', nl: 'Néerlandais', fr: 'Français' }, more: 'bientôt plus' },
        tryLabel: 'Essayez — cherchez n’importe quel mot anglais',
        tryPlaceholder: 'p. ex. petrichor',
        tryButton: 'Chercher',
        tryLoading: 'Recherche…',
        tryError: 'Impossible de joindre le dictionnaire — veuillez réessayer.',
        tryNotFoundPre: 'Aucune entrée anglaise trouvée pour « ',
        tryNotFoundPost: ' ».',
        tryHint:
            'Dans l’application, vous enregistreriez maintenant ce mot avec la phrase où vous l’avez trouvé, puis ajouteriez vos notes personnelles.',
        sentenceLabel: 'Phrase',
        notesLabel: 'Notes',
        demoSentence: 'Elle termina la lettre d’un élégant trait de plume.',
        demoNotesHtml:
            'Du latin <span class="italic">florere</span>, « fleurir » — même racine que <span class="italic">flora</span> et <span class="italic">fleur</span>.',
        chooseOther: 'Choisir une autre définition',
        chooseOtherAriaPre: 'Choisir une autre définition de ',
        dialogAria: 'Choisir une définition',
        searchPlaceholder: 'Rechercher des définitions...',
        emptyPre: 'Aucune définition ne correspond à « ',
        emptyPost: ' ».',
        close: 'Fermer',
        definitionsForPre: 'Définitions de : ',
    },
    faq: {
        heading: 'Questions fréquentes',
        items: [
            {
                question: 'Sur quelles plateformes Word Bank fonctionne-t-il ?',
                answer:
                    'Sur Android aujourd’hui, sous forme d’APK bêta à installer directement. Une version iOS via TestFlight est prévue ensuite — et une version web arrive, pour utiliser Word Bank sans rien installer.',
            },
            {
                question: 'Combien ça coûte ?',
                answer: 'Rien — Word Bank est gratuit pendant la bêta.',
            },
            {
                question: 'Quelles langues sont prises en charge ?',
                answer:
                    'Les dictionnaires anglais, néerlandais et français sont disponibles aujourd’hui. Le moteur repose sur les données de Wiktionary, qui couvrent plus de 100 langues — d’autres arrivent donc.',
            },
            {
                question: 'Où sont stockées mes données ?',
                answer:
                    'Entièrement sur votre appareil. Pas de compte ni de serveur qui détient votre liste de lecture — l’application fonctionne hors ligne et vos mots restent à vous.',
            },
            {
                question: 'Puis-je parcourir tous les mots que j’ai enregistrés ?',
                answer:
                    'Oui. La liste de mots rassemble chaque mot de chaque livre au même endroit. Cherchez, filtrez par nature de mot et triez de A à Z, par livre ou par ajout récent — touchez un mot pour revenir au livre d’où il vient.',
            },
            {
                question: 'Puis-je suivre des livres absents du catalogue ?',
                answer:
                    'Oui. Créez un livre personnalisé avec son titre, son auteur et son année, et donnez-lui une couverture depuis votre appareil photo ou votre photothèque.',
            },
        ],
    },
    tech: {
        heading: 'Construit avec de l’open source',
        blurbLink: 'Word Bank est gratuit et open source.',
        blurbRest: 'N’hésitez pas à signaler des problèmes et à contribuer.',
    },
    footer: {
        tagline: 'Votre coffre à mots personnel',
    },
    phone: {
        aria: 'Application Word Bank montrant une liste de lecture avec statuts et nombres de mots',
        readList: 'Liste de lecture',
        filters: { all: 'Tous', want: 'À lire', reading: 'En cours', read: 'Lu' },
        tabs: { search: 'Recherche', readList: 'Liste de lecture', wordList: 'Liste de mots' },
        wordSingular: 'mot',
        wordPlural: 'mots',
    },
    wordWall: {
        trigger: 'Voir les mots que les utilisateurs enregistrent en ce moment',
        title: 'Mots enregistrés par les utilisateurs :',
        panelAria: 'Mots que les utilisateurs enregistrent',
        close: 'Fermer',
    },
    stats: {
        aria: 'Statistiques de mots en direct',
        collected: 'mots collectés par les lecteurs',
        topWord: 'mot le plus enregistré',
        perDay: 'mots ajoutés par jour',
    },
    statusLabels: { want: 'À lire', reading: 'En cours de lecture', read: 'Lu' },
};
