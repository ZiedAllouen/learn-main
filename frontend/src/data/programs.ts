export interface Program {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  coverUrl: string
  programType: string
  programTypeSlug: string
  modality: 'IN_PERSON' | 'ONLINE' | 'HYBRID'
  duration: string
  priceIndicative: string
  disciplineSlugs: string[]
  audienceSlugs: string[]
  featured: boolean
}

export const programs: Program[] = [
  {
    id: '1',
    slug: 'formation-son-mao',
    title: 'Formation professionnelle son & MAO',
    description: 'Formation intensive de 3 mois pour maîtriser la production musicale : enregistrement, mixage, mastering et MAO.',
    longDescription: `Cette formation de 3 mois est conçue pour les musiciens et producteurs souhaitant professionnaliser leur pratique. Elle couvre l'ensemble de la chaîne de production : prise de son, arrangement, mixage sur console et DAW (Ableton, Pro Tools), mastering et diffusion numérique.

La formation est dispensée par des professionnels actifs de la scène musicale tunisienne et internationale. Elle alterne ateliers techniques, sessions en studio et critiques de productions.

À l'issue de la formation, chaque participant produit un EP ou un projet personnel finalisé, présenté lors d'une écoute publique au BSMK.`,
    coverUrl: '/assets/images/caught-in-joy.jpg',
    programType: 'Formation',
    programTypeSlug: 'formation',
    modality: 'IN_PERSON',
    duration: '3 mois (12 semaines)',
    priceIndicative: '1 200 DT / tarifs réduits disponibles',
    disciplineSlugs: ['musique-production'],
    audienceSlugs: ['adultes', 'professionnels'],
    featured: true,
  },
  {
    id: '2',
    slug: 'atelier-danse-contemporaine',
    title: 'Atelier hebdomadaire danse contemporaine',
    description: 'Cours de danse contemporaine ouverts à tous, tous les mercredis et samedis matin dans la grande salle de danse.',
    longDescription: `Ces ateliers hebdomadaires sont ouverts à toute personne souhaitant pratiquer la danse contemporaine, sans prérequis technique. Animés par des chorégraphes invités, ils explorent chaque semaine un thème ou une technique différente.

Le cours du mercredi soir est orienté pratique et improvisation. Le samedi matin est plus technique, avec un travail approfondi sur la composition et l'interprétation.

Ces ateliers sont également un espace de rencontre et de création informelle : des collaborations entre participants ont régulièrement débouché sur des projets présentés lors de nos événements.`,
    coverUrl: '/assets/images/morgan-petroski.jpg',
    programType: 'Atelier',
    programTypeSlug: 'workshop',
    modality: 'IN_PERSON',
    duration: 'Continu (inscriptions à la session)',
    priceIndicative: '40 DT / mois',
    disciplineSlugs: ['danse-performance'],
    audienceSlugs: ['tout-public'],
    featured: false,
  },
  {
    id: '3',
    slug: 'residence-artistique-mediterraneenne',
    title: 'Résidence artistique méditerranéenne',
    description: 'Programme de résidence de 4 semaines pour artistes confirmés souhaitant développer un projet à dimension méditerranéenne.',
    longDescription: `La résidence artistique méditerranéenne du BSMK accueille chaque trimestre 4 à 6 artistes de disciplines et de nationalités différentes autour d'un axe thématique commun. Les résidents bénéficient d'un accès libre aux espaces du BSMK, d'un logement, et d'un budget de production.

La résidence se termine par une restitution publique : exposition, performance, projection ou concert selon les disciplines. Ces restitutions sont ouvertes au public et donnent souvent naissance à des projets plus aboutis présentés dans d'autres lieux.

Les candidatures sont examinées par un comité artistique. Nous recherchons des projets qui engagent la question méditerranéenne — non comme décor, mais comme sujet de recherche.`,
    coverUrl: '/assets/images/andrii-olishevskyi.jpg',
    programType: 'Résidence',
    programTypeSlug: 'residency',
    modality: 'IN_PERSON',
    duration: '4 semaines',
    priceIndicative: 'Gratuit (appel à candidatures)',
    disciplineSlugs: ['arts-visuels', 'danse-performance', 'theatre-arts-vivants'],
    audienceSlugs: ['professionnels'],
    featured: true,
  },
  {
    id: '4',
    slug: 'initiation-cinema-documentaire',
    title: 'Initiation au cinéma documentaire',
    description: 'Stage intensif de 5 jours pour apprendre les bases de la réalisation documentaire : cadrage, son, entretien, montage.',
    longDescription: `Ce stage intensif s'adresse aux jeunes de 16 à 25 ans souhaitant découvrir la réalisation documentaire. En cinq jours, les participants apprennent à cadrer, enregistrer le son, conduire des entretiens et monter leurs images.

Chaque participant repart avec un court-métrage documentaire de 5 à 10 minutes, réalisé durant la semaine. Les meilleurs projets sont présentés lors d'une projection publique et peuvent être soumis à des festivals jeunesse.

Le stage est encadré par deux cinéastes professionnels et limite à 10 participants pour garantir un accompagnement individuel de qualité.`,
    coverUrl: '/assets/images/dakota-lim.jpg',
    programType: 'Stage',
    programTypeSlug: 'workshop',
    modality: 'IN_PERSON',
    duration: '5 jours intensifs',
    priceIndicative: '180 DT (bourse disponibles)',
    disciplineSlugs: ['cinema-audiovisuel'],
    audienceSlugs: ['jeunes'],
    featured: false,
  },
  {
    id: '5',
    slug: 'masterclass-design-graphique',
    title: 'Masterclass design graphique & identité visuelle',
    description: 'Deux jours de masterclass avec une designer graphique internationale sur l\'identité visuelle pour les artistes et les structures culturelles.',
    longDescription: `Cette masterclass de deux jours réunit 15 participants autour d'un sujet crucial pour les artistes d'aujourd'hui : comment construire une identité visuelle cohérente et distinctive à l'ère numérique ?

Animée par une designer graphique invitée, la masterclass alterne apports théoriques, études de cas et exercices pratiques. Les participants travaillent sur leur propre cas ou sur un cas fictif.

Les thèmes abordés : typographie et mise en page, couleur et émotion, systèmes graphiques, identité numérique et print, cohérence cross-platform.`,
    coverUrl: '/assets/images/minh.jpg',
    programType: 'Masterclass',
    programTypeSlug: 'workshop',
    modality: 'IN_PERSON',
    duration: '2 jours',
    priceIndicative: '350 DT',
    disciplineSlugs: ['arts-numeriques', 'artisanat-design'],
    audienceSlugs: ['professionnels', 'adultes'],
    featured: false,
  },
  {
    id: '6',
    slug: 'accompagnement-jeunes-artistes',
    title: 'Programme d\'accompagnement jeunes artistes',
    description: 'Programme annuel d\'accompagnement de 12 jeunes artistes tunisiens : mentorat, accès aux espaces, aide à la production et mise en réseau.',
    longDescription: `Chaque année, le BSMK sélectionne 12 jeunes artistes tunisiens âgés de 18 à 30 ans pour un programme d'accompagnement sur douze mois. Les critères de sélection privilégient le potentiel artistique, l'engagement et la volonté de s'inscrire dans une démarche professionnelle.

Les participants bénéficient d'un accès prioritaire aux espaces du BSMK, d'un suivi individualisé par un mentor artiste, d'une aide à la production pour un projet par an, et d'une intégration dans les réseaux nationaux et méditerranéens du BSMK.

Le programme se termine par une exposition collective ou une soirée de performance ouverte au public et aux professionnels.`,
    coverUrl: '/assets/images/rainier-ridao.jpg',
    programType: 'Mentorat',
    programTypeSlug: 'mentoring',
    modality: 'IN_PERSON',
    duration: '12 mois',
    priceIndicative: 'Gratuit (appel à candidatures)',
    disciplineSlugs: ['musique-production', 'danse-performance', 'arts-visuels', 'theatre-arts-vivants', 'cinema-audiovisuel', 'arts-numeriques', 'artisanat-design'],
    audienceSlugs: ['jeunes'],
    featured: true,
  },
  {
    id: '7',
    slug: 'kids-lab-recyclage-creatif',
    title: 'Kids Lab recyclage créatif',
    description: 'Atelier ludique pour enfants autour du dessin, de la fabrication, du recyclage créatif et des objets à transformer.',
    longDescription: `Le Kids Lab initie les enfants à la création par la matière : carton, textile, objets récupérés, peinture, collage et petites constructions. L'objectif est de développer l'imagination, la motricité, l'attention écologique et la joie de fabriquer ensemble.

Chaque cycle se termine par une mini-restitution ouverte aux familles. Les enfants repartent avec leurs créations et une première compréhension de la logique circulaire portée par le BSMK.`,
    coverUrl: '/assets/images/vitaly-gariev.jpg',
    programType: 'Atelier',
    programTypeSlug: 'workshop',
    modality: 'IN_PERSON',
    duration: '6 samedis',
    priceIndicative: '150 DT / cycle',
    disciplineSlugs: ['arts-visuels', 'artisanat-design'],
    audienceSlugs: ['enfants'],
    featured: false,
  },
  {
    id: '8',
    slug: 'training-culture-urbaine',
    title: 'Training culture urbaine',
    description: 'Sessions d’entraînement pour adolescents et jeunes autour du mouvement, de la performance physique et des cultures urbaines.',
    longDescription: `Ce programme combine entraînement physique, mouvement, danse urbaine, présence scénique et culture collective. Il s'adresse aux adolescents et jeunes qui veulent pratiquer régulièrement, rejoindre une communauté et préparer des restitutions publiques.

Les sessions alternent travail corporel, ateliers avec artistes invités, préparation de battles, initiation à la scène et discussion sur les cultures urbaines à Tunis et en Méditerranée.`,
    coverUrl: '/assets/images/gift-habeshaw.jpg',
    programType: 'Entraînement',
    programTypeSlug: 'training',
    modality: 'IN_PERSON',
    duration: 'Continu',
    priceIndicative: '60 DT / mois',
    disciplineSlugs: ['danse-performance', 'theatre-arts-vivants'],
    audienceSlugs: ['adolescents', 'jeunes'],
    featured: false,
  },
]

export const programTypes = [
  { slug: 'formation', name: 'Formation' },
  { slug: 'residency', name: 'Résidence' },
  { slug: 'workshop', name: 'Atelier / Stage' },
  { slug: 'mentoring', name: 'Mentorat' },
  { slug: 'training', name: 'Entraînement' },
  { slug: 'accompaniment', name: 'Accompagnement' },
  { slug: 'coaching', name: 'Coaching' },
  { slug: 'consulting', name: 'Consulting' },
]

export const audienceTypes = [
  { slug: 'enfants', name: 'Enfants' },
  { slug: 'adolescents', name: 'Adolescents' },
  { slug: 'jeunes', name: 'Jeunes (16-30 ans)' },
  { slug: 'adultes', name: 'Adultes' },
  { slug: 'professionnels', name: 'Professionnels' },
  { slug: 'tout-public', name: 'Tout public' },
]

export function getProgramBySlug(slug: string) {
  return programs.find(p => p.slug === slug) ?? null
}

export function getFeaturedPrograms(count = 3) {
  return programs.filter(p => p.featured).slice(0, count)
}
