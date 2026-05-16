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
    name: 'Danse & Mouvement',
    shortName: 'Mouvement',
    description: 'Danse contemporaine, pratiques urbaines, corps en mouvement et performances pluridisciplinaires.',
    longDescription: `La danse et le mouvement au BSMK forment un espace de pratique, d'entraînement et de recherche. De la danse contemporaine aux formes traditionnelles nord-africaines et méditerranéennes, en passant par les cultures urbaines et la performance, nos espaces accueillent les corps, les collectifs et les créations hybrides.`,
    coverUrl: 'https://picsum.photos/seed/danse/1200/600',
    color: '#C4622D',
    accentColor: '#E07840',
  },
  {
    id: '3',
    slug: 'arts-visuels',
    name: 'Street Art & Arts Visuels',
    shortName: 'Arts visuels',
    description: 'Street art, peinture, photographie, installation, muralisme et art contemporain.',
    longDescription: `L'atelier arts visuels du BSMK est un lieu d'expérimentation et de production. Street art, peinture, dessin, gravure, photographie, installation et muralisme coexistent dans un espace pensé pour la recherche plastique, la fabrication et l'intervention dans l'espace public.`,
    coverUrl: 'https://picsum.photos/seed/visuels/1200/600',
    color: '#5C6B3A',
    accentColor: '#7A8F4E',
  },
  {
    id: '4',
    slug: 'theatre-arts-vivants',
    name: 'Sport & Culture Urbaine',
    shortName: 'Urbain',
    description: 'Training, performance physique, cultures de rue, pratiques collectives et scènes urbaines.',
    longDescription: `Le pôle Sport & Culture Urbaine rassemble les pratiques d'entraînement, de performance et de culture de rue. Il connecte danse, expression scénique, ateliers collectifs, battles, préparation physique et projets portés par les communautés urbaines de Tunis.`,
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
    name: 'Arts Numériques & Gaming',
    shortName: 'Numérique',
    description: 'Design graphique, création numérique, gaming rétro, 3D, fab lab et nouvelles technologies.',
    longDescription: `L'espace numérique du BSMK est un fab lab artistique. Design graphique, motion design, art génératif, gaming rétro, 3D, impression 3D et électronique créative s'y rencontrent pour explorer l'intersection entre art, technologie et cultures populaires.`,
    coverUrl: 'https://picsum.photos/seed/numerique/1200/600',
    color: '#0D4F4F',
    accentColor: '#147070',
  },
  {
    id: '7',
    slug: 'artisanat-design',
    name: 'Mode & Design',
    shortName: 'Design',
    description: 'Mode, textile, design objet, maison d\'objets et valorisation des matières méditerranéennes.',
    longDescription: `Le pôle Mode & Design valorise les savoir-faire méditerranéens en dialogue avec le design contemporain. Textile, cuir, bijouterie, mobilier, objet et recyclage créatif réunissent artisans, designers, stylistes et étudiants autour d'une pratique partagée de la matière.`,
    coverUrl: 'https://picsum.photos/seed/artisanat/1200/600',
    color: '#6B3A1F',
    accentColor: '#9C5530',
  },
]

export function getDisciplineBySlug(slug: string) {
  return disciplines.find(d => d.slug === slug) ?? null
}
