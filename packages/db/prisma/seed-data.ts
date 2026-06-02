// Static content copied from frontend/src/data/* so the seed is self-contained
// (no cross-package imports). Keep in sync with the frontend static data.

export interface SeedProgram {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  coverUrl: string;
  programTypeSlug: string;
  modality: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
  duration: string;
  priceIndicative: string;
  disciplineSlugs: string[];
  audienceSlugs: string[];
  featured: boolean;
}

export const programs: SeedProgram[] = [
  {
    slug: 'formation-son-mao',
    title: 'Formation professionnelle son & MAO',
    description:
      'Formation intensive de 3 mois pour maîtriser la production musicale : enregistrement, mixage, mastering et MAO.',
    longDescription: `Cette formation de 3 mois est conçue pour les musiciens et producteurs souhaitant professionnaliser leur pratique. Elle couvre l'ensemble de la chaîne de production : prise de son, arrangement, mixage sur console et DAW (Ableton, Pro Tools), mastering et diffusion numérique.\n\nLa formation est dispensée par des professionnels actifs de la scène musicale tunisienne et internationale. Elle alterne ateliers techniques, sessions en studio et critiques de productions.\n\nÀ l'issue de la formation, chaque participant produit un EP ou un projet personnel finalisé, présenté lors d'une écoute publique au BSMK.`,
    coverUrl: 'https://picsum.photos/seed/prog-son/800/450',
    programTypeSlug: 'formation',
    modality: 'IN_PERSON',
    duration: '3 mois (12 semaines)',
    priceIndicative: '1 200 DT / tarifs réduits disponibles',
    disciplineSlugs: ['musique-production'],
    audienceSlugs: ['adultes', 'professionnels'],
    featured: true,
  },
  {
    slug: 'atelier-danse-contemporaine',
    title: 'Atelier hebdomadaire danse contemporaine',
    description:
      'Cours de danse contemporaine ouverts à tous, tous les mercredis et samedis matin dans la grande salle de danse.',
    longDescription: `Ces ateliers hebdomadaires sont ouverts à toute personne souhaitant pratiquer la danse contemporaine, sans prérequis technique. Animés par des chorégraphes invités, ils explorent chaque semaine un thème ou une technique différente.\n\nLe cours du mercredi soir est orienté pratique et improvisation. Le samedi matin est plus technique, avec un travail approfondi sur la composition et l'interprétation.\n\nCes ateliers sont également un espace de rencontre et de création informelle : des collaborations entre participants ont régulièrement débouché sur des projets présentés lors de nos événements.`,
    coverUrl: 'https://picsum.photos/seed/prog-danse/800/450',
    programTypeSlug: 'workshop',
    modality: 'IN_PERSON',
    duration: 'Continu (inscriptions à la session)',
    priceIndicative: '40 DT / mois',
    disciplineSlugs: ['danse-performance'],
    audienceSlugs: ['tout-public'],
    featured: false,
  },
  {
    slug: 'residence-artistique-mediterraneenne',
    title: 'Résidence artistique méditerranéenne',
    description:
      'Programme de résidence de 4 semaines pour artistes confirmés souhaitant développer un projet à dimension méditerranéenne.',
    longDescription: `La résidence artistique méditerranéenne du BSMK accueille chaque trimestre 4 à 6 artistes de disciplines et de nationalités différentes autour d'un axe thématique commun. Les résidents bénéficient d'un accès libre aux espaces du BSMK, d'un logement, et d'un budget de production.\n\nLa résidence se termine par une restitution publique : exposition, performance, projection ou concert selon les disciplines. Ces restitutions sont ouvertes au public et donnent souvent naissance à des projets plus aboutis présentés dans d'autres lieux.\n\nLes candidatures sont examinées par un comité artistique. Nous recherchons des projets qui engagent la question méditerranéenne — non comme décor, mais comme sujet de recherche.`,
    coverUrl: 'https://picsum.photos/seed/prog-residence/800/450',
    programTypeSlug: 'residency',
    modality: 'IN_PERSON',
    duration: '4 semaines',
    priceIndicative: 'Gratuit (appel à candidatures)',
    disciplineSlugs: ['arts-visuels', 'danse-performance', 'theatre-arts-vivants'],
    audienceSlugs: ['professionnels'],
    featured: true,
  },
  {
    slug: 'initiation-cinema-documentaire',
    title: 'Initiation au cinéma documentaire',
    description:
      'Stage intensif de 5 jours pour apprendre les bases de la réalisation documentaire : cadrage, son, entretien, montage.',
    longDescription: `Ce stage intensif s'adresse aux jeunes de 16 à 25 ans souhaitant découvrir la réalisation documentaire. En cinq jours, les participants apprennent à cadrer, enregistrer le son, conduire des entretiens et monter leurs images.\n\nChaque participant repart avec un court-métrage documentaire de 5 à 10 minutes, réalisé durant la semaine. Les meilleurs projets sont présentés lors d'une projection publique et peuvent être soumis à des festivals jeunesse.\n\nLe stage est encadré par deux cinéastes professionnels et limite à 10 participants pour garantir un accompagnement individuel de qualité.`,
    coverUrl: 'https://picsum.photos/seed/prog-cinema/800/450',
    programTypeSlug: 'workshop',
    modality: 'IN_PERSON',
    duration: '5 jours intensifs',
    priceIndicative: '180 DT (bourse disponibles)',
    disciplineSlugs: ['cinema-audiovisuel'],
    audienceSlugs: ['jeunes'],
    featured: false,
  },
  {
    slug: 'masterclass-design-graphique',
    title: 'Masterclass design graphique & identité visuelle',
    description:
      "Deux jours de masterclass avec une designer graphique internationale sur l'identité visuelle pour les artistes et les structures culturelles.",
    longDescription: `Cette masterclass de deux jours réunit 15 participants autour d'un sujet crucial pour les artistes d'aujourd'hui : comment construire une identité visuelle cohérente et distinctive à l'ère numérique ?\n\nAnimée par une designer graphique invitée, la masterclass alterne apports théoriques, études de cas et exercices pratiques. Les participants travaillent sur leur propre cas ou sur un cas fictif.\n\nLes thèmes abordés : typographie et mise en page, couleur et émotion, systèmes graphiques, identité numérique et print, cohérence cross-platform.`,
    coverUrl: 'https://picsum.photos/seed/prog-design/800/450',
    programTypeSlug: 'workshop',
    modality: 'IN_PERSON',
    duration: '2 jours',
    priceIndicative: '350 DT',
    disciplineSlugs: ['arts-numeriques', 'artisanat-design'],
    audienceSlugs: ['professionnels', 'adultes'],
    featured: false,
  },
  {
    slug: 'accompagnement-jeunes-artistes',
    title: "Programme d'accompagnement jeunes artistes",
    description:
      "Programme annuel d'accompagnement de 12 jeunes artistes tunisiens : mentorat, accès aux espaces, aide à la production et mise en réseau.",
    longDescription: `Chaque année, le BSMK sélectionne 12 jeunes artistes tunisiens âgés de 18 à 30 ans pour un programme d'accompagnement sur douze mois. Les critères de sélection privilégient le potentiel artistique, l'engagement et la volonté de s'inscrire dans une démarche professionnelle.\n\nLes participants bénéficient d'un accès prioritaire aux espaces du BSMK, d'un suivi individualisé par un mentor artiste, d'une aide à la production pour un projet par an, et d'une intégration dans les réseaux nationaux et méditerranéens du BSMK.\n\nLe programme se termine par une exposition collective ou une soirée de performance ouverte au public et aux professionnels.`,
    coverUrl: 'https://picsum.photos/seed/prog-jeunes/800/450',
    programTypeSlug: 'mentoring',
    modality: 'IN_PERSON',
    duration: '12 mois',
    priceIndicative: 'Gratuit (appel à candidatures)',
    disciplineSlugs: [
      'musique-production',
      'danse-performance',
      'arts-visuels',
      'theatre-arts-vivants',
      'cinema-audiovisuel',
      'arts-numeriques',
      'artisanat-design',
    ],
    audienceSlugs: ['jeunes'],
    featured: true,
  },
  {
    slug: 'kids-lab-recyclage-creatif',
    title: 'Kids Lab recyclage créatif',
    description:
      'Atelier ludique pour enfants autour du dessin, de la fabrication, du recyclage créatif et des objets à transformer.',
    longDescription: `Le Kids Lab initie les enfants à la création par la matière : carton, textile, objets récupérés, peinture, collage et petites constructions. L'objectif est de développer l'imagination, la motricité, l'attention écologique et la joie de fabriquer ensemble.\n\nChaque cycle se termine par une mini-restitution ouverte aux familles. Les enfants repartent avec leurs créations et une première compréhension de la logique circulaire portée par le BSMK.`,
    coverUrl: 'https://picsum.photos/seed/prog-kids-lab/800/450',
    programTypeSlug: 'workshop',
    modality: 'IN_PERSON',
    duration: '6 samedis',
    priceIndicative: '150 DT / cycle',
    disciplineSlugs: ['arts-visuels', 'artisanat-design'],
    audienceSlugs: ['enfants'],
    featured: false,
  },
  {
    slug: 'training-culture-urbaine',
    title: 'Training culture urbaine',
    description:
      "Sessions d'entraînement pour adolescents et jeunes autour du mouvement, de la performance physique et des cultures urbaines.",
    longDescription: `Ce programme combine entraînement physique, mouvement, danse urbaine, présence scénique et culture collective. Il s'adresse aux adolescents et jeunes qui veulent pratiquer régulièrement, rejoindre une communauté et préparer des restitutions publiques.\n\nLes sessions alternent travail corporel, ateliers avec artistes invités, préparation de battles, initiation à la scène et discussion sur les cultures urbaines à Tunis et en Méditerranée.`,
    coverUrl: 'https://picsum.photos/seed/prog-urban-training/800/450',
    programTypeSlug: 'training',
    modality: 'IN_PERSON',
    duration: 'Continu',
    priceIndicative: '60 DT / mois',
    disciplineSlugs: ['danse-performance', 'theatre-arts-vivants'],
    audienceSlugs: ['adolescents', 'jeunes'],
    featured: false,
  },
];

export type SeedEventType =
  | 'CONCERT'
  | 'EXHIBITION'
  | 'WORKSHOP'
  | 'RESIDENCY'
  | 'SCREENING'
  | 'CONFERENCE'
  | 'FESTIVAL'
  | 'OTHER';

export interface SeedEvent {
  slug: string;
  title: string;
  description: string;
  eventType: SeedEventType;
  startDate: string;
  endDate?: string;
  location: string;
  coverUrl: string;
  ticketUrl?: string;
  disciplineSlugs: string[];
}

export const events: SeedEvent[] = [
  {
    slug: 'concert-ouverture-saison',
    title: "Concert d'ouverture de saison — Collectif Médina",
    description:
      "Le Collectif Médina ouvre la saison 2026-2027 du BSMK avec un concert mêlant jazz, musique arabe et électronique, dans la grande salle du centre.",
    eventType: 'CONCERT',
    startDate: '2026-06-06T21:00:00',
    location: 'Grande salle polyvalente — BSMK',
    coverUrl: 'https://picsum.photos/seed/concert-medina/800/450',
    disciplineSlugs: ['musique-production'],
  },
  {
    slug: 'exposition-corps-territoire',
    title: 'Corps & Territoire — Exposition collective',
    description:
      "Exposition réunissant 8 artistes plasticiens tunisiens et méditerranéens autour de la relation entre le corps et l'espace habité.",
    eventType: 'EXHIBITION',
    startDate: '2026-05-20T18:00:00',
    endDate: '2026-06-20T20:00:00',
    location: "Atelier arts visuels & Espace d'exposition — BSMK",
    coverUrl: 'https://picsum.photos/seed/expo-corps/800/450',
    disciplineSlugs: ['arts-visuels'],
  },
  {
    slug: 'projection-cinema-maghreb',
    title: 'Cycle Cinéma Maghrébin Contemporain — Séance 1',
    description:
      'Premier volet du cycle de projections consacré au cinéma maghrébin contemporain. Au programme : "Les Enfants de la mer" de Kaouther Ben Hania.',
    eventType: 'SCREENING',
    startDate: '2026-05-23T20:30:00',
    location: 'Salle de projection — BSMK',
    coverUrl: 'https://picsum.photos/seed/cinema-cycle/800/450',
    disciplineSlugs: ['cinema-audiovisuel'],
  },
  {
    slug: 'atelier-poterie-sejnane',
    title: 'Atelier poterie — Traditions de Sejnane',
    description:
      'Initiation aux techniques de poterie de Sejnane avec la maître artisane Fatma Hamdi. Séances ouvertes à tous niveaux.',
    eventType: 'WORKSHOP',
    startDate: '2026-05-25T10:00:00',
    endDate: '2026-05-25T13:00:00',
    location: 'Atelier arts visuels — BSMK',
    coverUrl: 'https://picsum.photos/seed/poterie/800/450',
    disciplineSlugs: ['artisanat-design'],
  },
  {
    slug: 'conference-art-engagement',
    title: 'Conférence : Art, engagement et responsabilité en 2026',
    description:
      "Table ronde réunissant des artistes, commissaires et théoriciens autour de la question de l'engagement artistique dans le contexte méditerranéen actuel.",
    eventType: 'CONFERENCE',
    startDate: '2026-05-30T17:00:00',
    endDate: '2026-05-30T19:30:00',
    location: 'Salle de conférence — BSMK',
    coverUrl: 'https://picsum.photos/seed/conference/800/450',
    disciplineSlugs: [],
  },
  {
    slug: 'performance-danse-stambali',
    title: 'Nuit du Stambali — Performance & conférence gestuelle',
    description:
      'Soirée exceptionnelle autour du Stambali, musique et danse de transe tunisienne. Performance du Groupe El Farah, conférence de Nadia Bouzid.',
    eventType: 'CONCERT',
    startDate: '2026-06-13T20:00:00',
    location: 'Grande salle polyvalente — BSMK',
    coverUrl: 'https://picsum.photos/seed/stambali/800/450',
    disciplineSlugs: ['musique-production', 'danse-performance'],
  },
  {
    slug: 'festival-arts-numeriques',
    title: 'BSMK Digital Fest — 3ème édition',
    description:
      "Trois jours de créations numériques, installations interactives, ateliers et conférences au carrefour de l'art et de la technologie.",
    eventType: 'FESTIVAL',
    startDate: '2026-06-19T10:00:00',
    endDate: '2026-06-21T22:00:00',
    location: 'BSMK — tous espaces',
    coverUrl: 'https://picsum.photos/seed/digital-fest/800/450',
    disciplineSlugs: ['arts-numeriques'],
  },
  {
    slug: 'projection-restitution-residence',
    title: 'Restitution de résidence — Compagnie Espace Libre',
    description:
      "Présentation du travail de la Compagnie Espace Libre après 3 semaines de résidence au BSMK. Performance suivie d'une discussion avec l'équipe artistique.",
    eventType: 'OTHER',
    startDate: '2026-06-27T19:00:00',
    location: 'Salle de répétition théâtre — BSMK',
    coverUrl: 'https://picsum.photos/seed/restitution/800/450',
    disciplineSlugs: ['theatre-arts-vivants'],
  },
  {
    slug: 'concert-fin-formation-son',
    title: 'Concert de fin de formation — Promotion Son & MAO 2026',
    description:
      "Les diplômés de la formation Son & MAO présentent leurs projets musicaux finaux lors d'une soirée de concert ouverte au public.",
    eventType: 'CONCERT',
    startDate: '2026-07-04T20:00:00',
    location: 'Grande salle polyvalente — BSMK',
    coverUrl: 'https://picsum.photos/seed/concert-diplome/800/450',
    disciplineSlugs: ['musique-production'],
  },
  {
    slug: 'exposition-vetrinart-printemps',
    title: 'VetrinArt x BSMK — Printemps des artistes',
    description:
      'Première exposition physique VetrinArt : 20 artistes de la plateforme présentent leurs œuvres dans les espaces du BSMK pendant deux semaines.',
    eventType: 'EXHIBITION',
    startDate: '2026-06-01T18:00:00',
    endDate: '2026-06-14T20:00:00',
    location: "BSMK — Espaces d'exposition",
    coverUrl: 'https://picsum.photos/seed/vetrinart-expo/800/450',
    disciplineSlugs: ['arts-visuels', 'artisanat-design', 'arts-numeriques'],
  },
  {
    slug: 'atelier-ecriture-dramaturgique',
    title: 'Atelier écriture dramaturgique — Week-end intensif',
    description:
      'Deux jours pour écrire, lire et critiquer des textes dramatiques. Animé par la dramaturge Sonia Chamkhi.',
    eventType: 'WORKSHOP',
    startDate: '2026-07-11T10:00:00',
    endDate: '2026-07-12T17:00:00',
    location: 'Salle de conférence — BSMK',
    coverUrl: 'https://picsum.photos/seed/ecriture/800/450',
    disciplineSlugs: ['theatre-arts-vivants'],
  },
  {
    slug: 'nuit-blanche-creation',
    title: 'Nuit blanche de la création — Portes ouvertes BSMK',
    description:
      'Une nuit entière pour explorer le BSMK, rencontrer ses artistes, assister à des performances et ateliers nocturnes dans tous les espaces du centre.',
    eventType: 'FESTIVAL',
    startDate: '2026-07-18T20:00:00',
    endDate: '2026-07-19T06:00:00',
    location: 'BSMK — tous espaces',
    coverUrl: 'https://picsum.photos/seed/nuit-blanche/800/450',
    disciplineSlugs: [
      'musique-production',
      'danse-performance',
      'arts-visuels',
      'theatre-arts-vivants',
    ],
  },
];

export interface SeedSpace {
  slug: string;
  name: string;
  description: string;
  floor: string;
  surfaceSqm: number;
  capacity: number;
  equipment: string[];
  imageUrls: string[];
  disciplineSlugs: string[];
}

export const spaces: SeedSpace[] = [
  {
    slug: 'studio-musique-a',
    name: 'Studio A — Production',
    description:
      "Studio de musique professionnel avec régie de son, traitement acoustique complet et instruments disponibles. Idéal pour l'enregistrement, le mixage et la MAO.",
    floor: 'Niveau 1',
    surfaceSqm: 65,
    capacity: 12,
    equipment: [
      'Console Neve 8078',
      'Pro Tools HDX',
      'Monitors Genelec',
      'Piano Steinway',
      'Batterie Pearl',
      'Amplis Fender & Marshall',
      'Large parc de micros',
    ],
    imageUrls: [
      'https://picsum.photos/seed/studio-a-1/800/500',
      'https://picsum.photos/seed/studio-a-2/800/500',
      'https://picsum.photos/seed/studio-a-3/800/500',
    ],
    disciplineSlugs: ['musique-production'],
  },
  {
    slug: 'studio-musique-b',
    name: 'Studio B — Répétition',
    description:
      'Studio de répétition acoustiquement traité, équipé pour les groupes et les formations musicales. Disponible à la demi-journée ou à la journée.',
    floor: 'Niveau 1',
    surfaceSqm: 40,
    capacity: 8,
    equipment: [
      'Batterie complète',
      'Amplis basse & guitare',
      'Piano électrique',
      'Système PA',
      'Backline complet',
    ],
    imageUrls: [
      'https://picsum.photos/seed/studio-b-1/800/500',
      'https://picsum.photos/seed/studio-b-2/800/500',
    ],
    disciplineSlugs: ['musique-production'],
  },
  {
    slug: 'salle-danse',
    name: 'Grande salle de danse',
    description:
      'Espace de danse lumineux avec sol semi-souple de 120m², barres, miroirs et système son intégré. La plus grande salle de pratique de la danse à Tunis.',
    floor: 'Niveau 2',
    surfaceSqm: 120,
    capacity: 30,
    equipment: [
      'Sol semi-souple Harlequin',
      'Barres fixes et mobiles',
      'Miroirs pleine hauteur',
      'Système son Bose',
      'Éclairage scénique',
      'Sono portable',
    ],
    imageUrls: [
      'https://picsum.photos/seed/danse-1/800/500',
      'https://picsum.photos/seed/danse-2/800/500',
    ],
    disciplineSlugs: ['danse-performance'],
  },
  {
    slug: 'salle-repetition-theatre',
    name: 'Salle de répétition théâtre',
    description:
      'Salle modulable pour les répétitions et les représentations de petite jauge. Noir intégral, gradins amovibles, régie légère et son.',
    floor: 'Niveau 2',
    surfaceSqm: 80,
    capacity: 40,
    equipment: [
      'Sol de scène noir',
      'Gradins amovibles 40 places',
      'Console lumière Avolites',
      'Projecteurs LEDs',
      'Système son Nexo',
      'Penderie costumes',
    ],
    imageUrls: [
      'https://picsum.photos/seed/theatre-1/800/500',
      'https://picsum.photos/seed/theatre-2/800/500',
    ],
    disciplineSlugs: ['theatre-arts-vivants'],
  },
  {
    slug: 'salle-projection',
    name: 'Salle de projection',
    description:
      'Cinéma de 100 places avec projection 4K laser, système Dolby Atmos et écran panoramique. Disponible pour projections publiques, privées et festivals.',
    floor: 'Niveau 0',
    surfaceSqm: 180,
    capacity: 100,
    equipment: [
      'Projecteur Sony 4K Laser',
      'Écran 8m × 4m',
      'Son Dolby Atmos 7.1',
      'Cabine de traduction simultanée',
      'Régie de diffusion',
    ],
    imageUrls: [
      'https://picsum.photos/seed/cinema-1/800/500',
      'https://picsum.photos/seed/cinema-2/800/500',
    ],
    disciplineSlugs: ['cinema-audiovisuel'],
  },
  {
    slug: 'atelier-arts-visuels',
    name: 'Atelier arts visuels',
    description:
      'Atelier de création ouvert, éclairé à la lumière naturelle, équipé pour la peinture, le dessin, la gravure et la sculpture.',
    floor: 'Niveau 3',
    surfaceSqm: 90,
    capacity: 15,
    equipment: [
      "Tables d'artiste réglables",
      'Éclairage naturel + LED',
      'Presse à graver',
      'Tour de potier',
      'Four à céramique',
      'Stockage matériaux',
    ],
    imageUrls: [
      'https://picsum.photos/seed/visuels-1/800/500',
      'https://picsum.photos/seed/visuels-2/800/500',
    ],
    disciplineSlugs: ['arts-visuels', 'artisanat-design'],
  },
  {
    slug: 'fablab-numerique',
    name: 'FabLab numérique',
    description:
      'Espace de fabrication et de création numérique : impression 3D, découpe laser, électronique, design graphique et réalité augmentée.',
    floor: 'Niveau 3',
    surfaceSqm: 70,
    capacity: 12,
    equipment: [
      '3 imprimantes 3D Ultimaker',
      'Découpe laser Trotec',
      '10 stations iMac Pro',
      'Tablettes Wacom',
      'Découpe vinyle',
      'Arduino & Raspberry Pi',
    ],
    imageUrls: [
      'https://picsum.photos/seed/fablab-1/800/500',
      'https://picsum.photos/seed/fablab-2/800/500',
    ],
    disciplineSlugs: ['arts-numeriques'],
  },
  {
    slug: 'grande-salle',
    name: 'Grande salle polyvalente',
    description:
      'Espace événementiel de 300 places en configuration concert ou 200 places en configuration théâtre. Accueille concerts, spectacles, vernissages et événements professionnels.',
    floor: 'Niveau 0',
    surfaceSqm: 500,
    capacity: 300,
    equipment: [
      'Scène 12m × 8m',
      'Son Line Array L-Acoustics',
      'Éclairage scénique complet',
      'Régie mobile',
      'Loges artistes',
      'Espace presse',
    ],
    imageUrls: [
      'https://picsum.photos/seed/grande-salle-1/800/500',
      'https://picsum.photos/seed/grande-salle-2/800/500',
      'https://picsum.photos/seed/grande-salle-3/800/500',
    ],
    disciplineSlugs: ['musique-production', 'danse-performance', 'theatre-arts-vivants'],
  },
  {
    slug: 'salle-conference',
    name: 'Salle de conférence',
    description:
      'Salle de conférence et de formation équipée, disponible pour séminaires, ateliers académiques et rencontres professionnelles.',
    floor: 'Niveau 1',
    surfaceSqm: 60,
    capacity: 50,
    equipment: [
      'Vidéoprojecteur 4K',
      'Système de visioconférence',
      'Tableau blanc interactif',
      'Micros de conférence',
      'WiFi haut débit',
    ],
    imageUrls: ['https://picsum.photos/seed/conference-1/800/500'],
    disciplineSlugs: [],
  },
  {
    slug: 'coworking-artistes',
    name: 'Espace coworking artistes',
    description:
      'Espace de travail partagé dédié aux artistes et créatifs : postes de travail équipés, zone lounge, petite bibliothèque artistique.',
    floor: 'Niveau 2',
    surfaceSqm: 80,
    capacity: 25,
    equipment: [
      '25 postes équipés',
      'Zone réunion 8 personnes',
      'Bibliothèque artistique',
      'Casiers sécurisés',
      'Cafétéria',
      'Terrasse',
    ],
    imageUrls: [
      'https://picsum.photos/seed/coworking-1/800/500',
      'https://picsum.photos/seed/coworking-2/800/500',
    ],
    disciplineSlugs: [],
  },
];

export interface SeedArticle {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  categorySlug: string;
  categoryName: string;
  disciplineSlugs: string[];
  readingTime: number;
  publishedAt: string;
  featured: boolean;
}

export const articles: SeedArticle[] = [
  {
    slug: 'mediterranee-territoire-art',
    title: "La Méditerranée comme territoire d'art partagé",
    excerpt:
      "À l'heure où les frontières se ferment, la Méditerranée reste un espace de circulation des formes, des corps et des imaginaires. Comment les artistes contemporains habitent-ils ce territoire commun ?",
    body: `La Méditerranée n'est pas une mer — c'est une conversation. Depuis des millénaires, ses rives échangent épices, langues, mythes et techniques. Aujourd'hui, alors que les politiques migratoires érigent de nouveaux murs, les artistes continuent de traverser, de dialoguer, de créer ensemble.\n\nAu BSMK, cette conviction est fondatrice. Nous croyons que l'art méditerranéen n'est pas un style ni une esthétique : c'est une méthode. Une façon de travailler qui accepte l'hybridation, qui cherche le commun sans effacer les différences.\n\nLes résidences que nous accueillons chaque année réunissent des artistes de Tunis, Marseille, Beyrouth, Barcelone, Naples. Ils partagent un espace, des repas, des débats. Ils fabriquent ensemble des œuvres qui n'auraient pas pu naître ailleurs.\n\nCette dynamique, nous voulons la rendre visible et accessible. C'est le sens du BSMK : être un passage, une membrane, un lieu où la Méditerranée se pense et se crée.`,
    coverUrl: 'https://picsum.photos/seed/med-art/1200/600',
    categorySlug: 'reflexions',
    categoryName: 'Réflexions',
    disciplineSlugs: ['arts-visuels', 'danse-performance'],
    readingTime: 6,
    publishedAt: '2026-04-12',
    featured: true,
  },
  {
    slug: 'rencontre-selma-baccar',
    title: 'Selma Baccar : «Le cinéma est le seul art qui capte le temps qui passe»',
    excerpt:
      'Pionnière du cinéma tunisien, Selma Baccar revient sur une carrière de plus de cinquante ans et parle de son dernier projet, un documentaire sur la mémoire des femmes du Sahel.',
    body: `Dans le hall du BSMK, Selma Baccar attend, assise face à une fenêtre qui donne sur les jardins. À 78 ans, elle garde cette précision du regard qui caractérise ses films : rien ne lui échappe, tout devient matière.\n\n"Le cinéma, c'est ma façon d'être au monde," dit-elle d'emblée. "Je ne peux pas imaginer ne pas filmer. Même quand je ne tourne pas, je cadre mentalement ce que je vois."\n\nSon nouveau projet l'a ramenée dans le Sahel tunisien, région dont elle est originaire. Pendant deux ans, elle a collecté les témoignages de femmes âgées — mères, grands-mères, arrière-grands-mères — sur leur rapport au temps, au corps, à la transmission.\n\n"Ce qui m'intéresse, c'est ce que la mémoire fait au présent. Ces femmes ne parlent pas du passé pour nostalgier. Elles parlent du passé pour comprendre maintenant."`,
    coverUrl: 'https://picsum.photos/seed/selma/1200/600',
    categorySlug: 'portrait',
    categoryName: 'Portrait',
    disciplineSlugs: ['cinema-audiovisuel'],
    readingTime: 9,
    publishedAt: '2026-04-28',
    featured: true,
  },
  {
    slug: 'nouveaux-espaces-creation-tunis',
    title: 'Les nouveaux espaces de création à Tunis : une géographie en mouvement',
    excerpt:
      'En dix ans, Tunis a vu émerger une nouvelle cartographie culturelle. Des espaces hybrides, autogérés ou institutionnels, transforment le rapport à la création artistique dans la capitale.',
    body: `En 2015, il n'existait qu'une poignée de lieux dédiés à la création contemporaine à Tunis. Aujourd'hui, la ville compte plusieurs dizaines d'espaces — petits ou grands, publics ou privés, associatifs ou commerciaux — qui offrent aux artistes des conditions de travail et de diffusion inédites.\n\nLe phénomène n'est pas uniquement quantitatif. Ces nouveaux espaces ont inventé de nouvelles formes d'organisation : gouvernance collective, résidences courtes, programmation pluridisciplinaire, ancrage territorial fort. Ils ont créé un écosystème qui n'existait pas.\n\nLe BSMK fait partie de cette nouvelle génération. Mais comme ses pairs, il doit faire face à des défis communs : modèles économiques précaires, dépendance aux subventions, turn-over des équipes. La question de la pérennité reste ouverte.`,
    coverUrl: 'https://picsum.photos/seed/tunis-espaces/1200/600',
    categorySlug: 'reportage',
    categoryName: 'Reportage',
    disciplineSlugs: ['arts-visuels'],
    readingTime: 7,
    publishedAt: '2026-05-02',
    featured: false,
  },
  {
    slug: 'danse-memoire-maghreb',
    title: 'Danse et mémoire collective au Maghreb',
    excerpt:
      'Le corps qui danse au Maghreb est toujours un corps historique. Un corps qui porte des mémoires de résistance, de fête, de deuil. Comment les chorégraphes contemporains négocient-ils avec cet héritage ?',
    body: `La danse au Maghreb ne commence pas dans les studios. Elle commence dans les rues, dans les maisons, dans les cérémonies. Elle commence dans les corps qui ont appris à bouger avant d'apprendre à parler.\n\nLes chorégraphes contemporains maghrébins héritent de cette densité. Quand ils créent, ils négocient avec des formes qui ont des siècles — ou des millénaires — d'histoire. La ahidous berbère. Le guedra saharien. Le stambali tunisien. Ces formes ne sont pas des folklores à réactiver : elles sont des savoirs vivants.\n\nComment les intégrer dans une écriture chorégraphique contemporaine sans les trahir ? Comment les transformer sans les vider de sens ? C'est la question que se posent les artistes de notre résidence de danse ce printemps.`,
    coverUrl: 'https://picsum.photos/seed/danse-maghreb/1200/600',
    categorySlug: 'essai',
    categoryName: 'Essai',
    disciplineSlugs: ['danse-performance'],
    readingTime: 8,
    publishedAt: '2026-03-15',
    featured: false,
  },
  {
    slug: 'son-image-convergence',
    title: 'Son et image : la convergence des arts au cœur du BSMK',
    excerpt:
      'Quand le Studio A et la salle de projection se rencontrent, de nouvelles formes artistiques émergent. Retour sur trois projets hybrides nés de la collaboration entre musiciens et cinéastes.',
    body: `Trois projets, trois histoires de collision créative. C'est ce que nous avons souhaité documenter dans ce reportage interne, en suivant les résidents du BSMK qui travaillent à l'intersection de la musique et de l'image.\n\nLe premier projet est né d'une résidence de deux semaines. Le musicien électronique Adel Mejri et la réalisatrice Sonia Gamha se sont rencontrés autour d'un thème commun : les mémoires sonores de Médina. L'un collectait des sons, l'autre filmait les textures visuelles. Le résultat : un film-concert de 45 minutes présenté en avant-première dans notre grande salle.\n\nLe deuxième projet est plus intime. Une compositrice et un photographe ont exploré ensemble la représentation du deuil dans la culture tunisienne contemporaine. Leur œuvre, "Quarante jours", est une série de vingt photographies accompagnées d'une partition pour piano préparée.`,
    coverUrl: 'https://picsum.photos/seed/son-image/1200/600',
    categorySlug: 'reportage',
    categoryName: 'Reportage',
    disciplineSlugs: ['musique-production', 'cinema-audiovisuel'],
    readingTime: 5,
    publishedAt: '2026-05-08',
    featured: true,
  },
  {
    slug: 'vetrinart-presence-ligne',
    title: "VetrinArt : construire sa présence en ligne sans perdre son identité artistique",
    excerpt:
      'Comment présenter son travail en ligne sans se soumettre aux algorithmes ? VetrinArt propose une réponse : des portfolios pensés pour les artistes, par les artistes.',
    body: `La question est simple mais radicale : comment un artiste peut-il exister en ligne sans devenir un produit ? Les plateformes dominant aujourd'hui le marché de la visibilité — Instagram, Behance, LinkedIn — ont leurs propres logiques, leurs propres formats, leurs propres définitions du succès.\n\nVetrinArt est né de la conviction que les artistes méritent mieux. Un espace qui ne dicte pas la fréquence des publications, qui n'impose pas de formats, qui ne monétise pas l'attention. Un espace qui aide à construire une présence professionnelle cohérente avec une démarche artistique.\n\nEn développement depuis deux ans, VetrinArt compte aujourd'hui plus de 150 artistes inscrits. Sa logique est simple : un profil, un portfolio, un réseau. Rien de plus. Rien de moins.`,
    coverUrl: 'https://picsum.photos/seed/vetrinart/1200/600',
    categorySlug: 'pratique',
    categoryName: 'Pratique',
    disciplineSlugs: ['arts-numeriques'],
    readingTime: 4,
    publishedAt: '2026-04-20',
    featured: false,
  },
  {
    slug: 'residence-immersion-createur',
    title: "Résidence en scène : journal d'une immersion créative",
    excerpt:
      'Pendant trois semaines, nous avons suivi la résidence de la compagnie Espace Libre au BSMK. Un journal de bord au plus près du processus de création.',
    body: `Semaine 1. La compagnie arrive un dimanche matin, avec trois caisses de matériel et une question : comment raconter l'exil sans romantiser la souffrance ? C'est leur point de départ. Pendant trois semaines, ils vont chercher — dans le mouvement, dans le texte, dans la lumière — des réponses provisoires.\n\nLa salle de répétition théâtre du BSMK devient leur maison. Ils y passent dix heures par jour, parfois plus. Les premières journées sont désordonnées, comme toujours. On improvise, on jette, on recommence. Le metteur en scène, Mondher Slim, dit que le premier tiers d'une résidence sert à désapprendre.\n\nSemaine 2. Le travail prend forme. Une structure dramaturgique émerge — non pas une narration linéaire, mais une série de tableaux qui se répondent. La danseuse de la compagnie commence à tisser ses improvisations avec le texte des deux comédiens.`,
    coverUrl: 'https://picsum.photos/seed/residence/1200/600',
    categorySlug: 'reportage',
    categoryName: 'Reportage',
    disciplineSlugs: ['theatre-arts-vivants'],
    readingTime: 10,
    publishedAt: '2026-03-28',
    featured: false,
  },
  {
    slug: 'art-numerique-patrimoine',
    title: "L'art numérique au service du patrimoine immatériel",
    excerpt:
      'Des artistes numériques tunisiens utilisent la modélisation 3D, la réalité augmentée et l\'intelligence artificielle pour préserver et réinventer le patrimoine culturel.',
    body: `Comment préserver ce qui, par nature, est éphémère ? Les gestes artisanaux, les chants de cérémonie, les techniques de tissage qui se transmettaient de corps à corps pendant des générations — comment les documenter sans les figer, sans les muséifier ?\n\nC'est la question que se posent plusieurs artistes numériques tunisiens, réunis au FabLab du BSMK dans le cadre d'un projet pilote de deux ans. Leur approche : utiliser les technologies numériques non pas comme des outils de reproduction, mais comme des outils d'interprétation.\n\nLa céramiste et programmeuse Rima Jebali a développé un algorithme qui génère des variations infinies à partir des motifs de la poterie de Sejnane. L'objet final n'est pas une copie : c'est une conversation entre le passé et le présent.`,
    coverUrl: 'https://picsum.photos/seed/numerique-patrimoine/1200/600',
    categorySlug: 'dossier',
    categoryName: 'Dossier',
    disciplineSlugs: ['arts-numeriques', 'artisanat-design'],
    readingTime: 11,
    publishedAt: '2026-02-14',
    featured: false,
  },
];
