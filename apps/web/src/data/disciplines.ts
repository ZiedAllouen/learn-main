export interface Discipline {
  id: string
  slug: string
  name: string
  shortName: string
  description: string
  longDescription: string
  coverUrl: string
  color: string
  accentColor: string
}

export const disciplines: Discipline[] = [
  {
    id: '1',
    slug: 'musique-production',
    name: 'Musique & Production',
    shortName: 'Musique',
    description: 'De la composition à la MAO, en passant par les musiques du monde méditerranéen.',
    longDescription: `La discipline Musique & Production au BSMK couvre l'ensemble du spectre musical : composition, arrangement, enregistrement, mixage et production sonore. Nos studios équipés accueillent des artistes de tous niveaux, du musicien traditionnel au producteur électronique. Nous valorisons particulièrement les croisements entre musiques méditerranéennes, jazz, électronique et hip-hop.`,
    coverUrl: 'https://picsum.photos/seed/musique/1200/600',
    color: '#1B3A5C',
    accentColor: '#2D5F99',
  },
  {
    id: '2',
    slug: 'danse-performance',
    name: 'Danse & Performance',
    shortName: 'Danse',
    description: 'Danse contemporaine, traditionnelle et performances pluridisciplinaires.',
    longDescription: `La danse au BSMK est un espace de liberté et d'exploration. De la danse contemporaine aux formes traditionnelles nord-africaines et méditerranéennes, en passant par la performance art, nos espaces accueillent les corps et les recherches. Nos programmes mêlent pratique, théorie et création.`,
    coverUrl: 'https://picsum.photos/seed/danse/1200/600',
    color: '#C4622D',
    accentColor: '#E07840',
  },
  {
    id: '3',
    slug: 'arts-visuels',
    name: 'Arts Visuels',
    shortName: 'Arts Visuels',
    description: 'Peinture, sculpture, photographie, installation et art contemporain.',
    longDescription: `L'atelier arts visuels du BSMK est un lieu d'expérimentation et de production. Peinture, dessin, gravure, sculpture, photographie et installation coexistent dans un espace pensé pour la recherche plastique. Les artistes peuvent y développer leurs pratiques individuelles et collaboratives.`,
    coverUrl: 'https://picsum.photos/seed/visuels/1200/600',
    color: '#5C6B3A',
    accentColor: '#7A8F4E',
  },
  {
    id: '4',
    slug: 'theatre-arts-vivants',
    name: 'Théâtre & Arts Vivants',
    shortName: 'Théâtre',
    description: 'Jeu, mise en scène, dramaturgie et arts du spectacle vivant.',
    longDescription: `Le pôle Théâtre & Arts Vivants du BSMK rassemble artistes, metteurs en scène, dramaturges et performeurs. Notre salle de répétition accueille des créations émergentes et des compagnies confirmées. Nous proposons des ateliers de jeu, de mise en scène et d'écriture dramaturgique.`,
    coverUrl: 'https://picsum.photos/seed/theatre/1200/600',
    color: '#4A1942',
    accentColor: '#7A2E73',
  },
  {
    id: '5',
    slug: 'cinema-audiovisuel',
    name: 'Cinéma & Audiovisuel',
    shortName: 'Cinéma',
    description: 'Réalisation, documentaire, montage et culture cinématographique.',
    longDescription: `Le BSMK est un espace de cinéma engagé. Notre salle de projection accueille des projections de films indépendants, des cycles thématiques et des rencontres avec des cinéastes. Nos programmes de formation initient à la réalisation documentaire, à la fiction courte et au montage audiovisuel.`,
    coverUrl: 'https://picsum.photos/seed/cinema/1200/600',
    color: '#1A1A2E',
    accentColor: '#2D2D5C',
  },
  {
    id: '6',
    slug: 'arts-numeriques',
    name: 'Arts Numériques',
    shortName: 'Numérique',
    description: 'Design graphique, création numérique, fab lab et nouvelles technologies.',
    longDescription: `L'espace numérique du BSMK est un fab lab artistique. Design graphique, motion design, art génératif, impression 3D, électronique créative — notre espace équipé est ouvert aux créateurs qui souhaitent explorer l'intersection entre art et technologie.`,
    coverUrl: 'https://picsum.photos/seed/numerique/1200/600',
    color: '#0D4F4F',
    accentColor: '#147070',
  },
  {
    id: '7',
    slug: 'artisanat-design',
    name: 'Artisanat & Design',
    shortName: 'Design',
    description: 'Céramique, textile, design objet et valorisation de l\'artisanat méditerranéen.',
    longDescription: `Le pôle Artisanat & Design du BSMK valorise les savoir-faire traditionnels méditerranéens en dialogue avec le design contemporain. Céramique, tissage, cuir, bijouterie, mobilier — nos ateliers réunissent artisans, designers et étudiants autour d'une pratique partagée de la matière.`,
    coverUrl: 'https://picsum.photos/seed/artisanat/1200/600',
    color: '#6B3A1F',
    accentColor: '#9C5530',
  },
]

export function getDisciplineBySlug(slug: string) {
  return disciplines.find(d => d.slug === slug) ?? null
}
