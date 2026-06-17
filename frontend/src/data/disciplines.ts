export interface Discipline {
  id: string
  slug: string
  name: string
  shortName: string
  description: string
  longDescription: string
  coverUrl: string
  color: string        // pastel/nude hex (discipline level)
  accentColor: string  // slightly deeper pastel
  sectorSlug: string   // parent sector
  sectorColor: string  // vivid sector color
}

export const disciplines: Discipline[] = [
  {
    id: '1',
    slug: 'musique-production',
    name: 'Musique & Production',
    shortName: 'Musique',
    description: 'De la composition à la MAO, en passant par les musiques du monde méditerranéen.',
    longDescription: `La discipline Musique & Production au BSMK couvre l'ensemble du spectre musical : composition, arrangement, enregistrement, mixage et production sonore. Nos studios équipés accueillent des artistes de tous niveaux, du musicien traditionnel au producteur électronique.`,
    coverUrl: 'https://picsum.photos/seed/musique/1200/600',
    color: '#B8C8D8',
    accentColor: '#2D5F99',
    sectorSlug: 'arts-de-scene',
    sectorColor: '#2D5F99',
  },
  {
    id: '2',
    slug: 'danse-performance',
    name: 'Danse & Mouvement',
    shortName: 'Danse',
    description: 'Danse contemporaine, pratiques urbaines, corps en mouvement et performances pluridisciplinaires.',
    longDescription: `La danse et le mouvement au BSMK forment un espace de pratique, d'entraînement et de recherche. De la danse contemporaine aux formes traditionnelles nord-africaines et méditerranéennes, en passant par les cultures urbaines et la performance.`,
    coverUrl: 'https://picsum.photos/seed/danse/1200/600',
    color: '#D4B8A8',
    accentColor: '#E07A5F',
    sectorSlug: 'arts-de-scene',
    sectorColor: '#E07A5F',
  },
  {
    id: '3',
    slug: 'arts-visuels',
    name: 'Street Art & Arts Visuels',
    shortName: 'Arts visuels',
    description: 'Street art, peinture, photographie, installation, muralisme et art contemporain.',
    longDescription: `L'atelier arts visuels du BSMK est un lieu d'expérimentation et de production. Street art, peinture, dessin, gravure, photographie, installation et muralisme coexistent dans un espace pensé pour la recherche plastique et l'intervention dans l'espace public.`,
    coverUrl: 'https://picsum.photos/seed/visuels/1200/600',
    color: '#C8D4B0',
    accentColor: '#5C8A3A',
    sectorSlug: 'evenements-expositions-festivals',
    sectorColor: '#C0392B',
  },
  {
    id: '4',
    slug: 'theatre-arts-vivants',
    name: 'Théâtre & Arts vivants',
    shortName: 'Théâtre',
    description: 'Théâtre contemporain, arts de la scène et performance live.',
    longDescription: `Le pôle Théâtre & Arts vivants rassemble les pratiques de scène, de texte et de performance. Il connecte jeu d'acteur, mise en scène, arts circassiens, performance et projets portés par les communautés artistiques de Tunis.`,
    coverUrl: 'https://picsum.photos/seed/theatre/1200/600',
    color: '#C8B8D4',
    accentColor: '#6B4C9A',
    sectorSlug: 'arts-de-scene',
    sectorColor: '#6B4C9A',
  },
  {
    id: '5',
    slug: 'cinema-audiovisuel',
    name: 'Cinéma & Audiovisuel',
    shortName: 'Cinéma',
    description: 'Réalisation, documentaire, montage et culture cinématographique.',
    longDescription: `Le BSMK est un espace de cinéma engagé. Notre salle de projection accueille des projections de films indépendants, des cycles thématiques et des rencontres avec des cinéastes. Nos programmes initient à la réalisation documentaire et à la fiction courte.`,
    coverUrl: 'https://picsum.photos/seed/cinema/1200/600',
    color: '#B8C8C8',
    accentColor: '#147070',
    sectorSlug: 'medias',
    sectorColor: '#7A2E73',
  },
  {
    id: '6',
    slug: 'arts-numeriques',
    name: 'Arts Numériques & Gaming',
    shortName: 'Numérique',
    description: 'Design graphique, création numérique, gaming, 3D, fab lab et nouvelles technologies.',
    longDescription: `L'espace numérique du BSMK est un fab lab artistique. Design graphique, motion design, art génératif, gaming, 3D, impression 3D et électronique créative s'y rencontrent pour explorer l'intersection entre art, technologie et cultures populaires.`,
    coverUrl: 'https://picsum.photos/seed/numerique/1200/600',
    color: '#B8D4C8',
    accentColor: '#147070',
    sectorSlug: 'consulting-accompagnement',
    sectorColor: '#147070',
  },
  {
    id: '7',
    slug: 'artisanat-design',
    name: 'Mode & Design',
    shortName: 'Design',
    description: "Mode, textile, design objet, maison d'objets et valorisation des matières méditerranéennes.",
    longDescription: `Le pôle Mode & Design valorise les savoir-faire méditerranéens en dialogue avec le design contemporain. Textile, cuir, bijouterie, mobilier, objet et recyclage créatif réunissent artisans, designers, stylistes et étudiants.`,
    coverUrl: 'https://picsum.photos/seed/artisanat/1200/600',
    color: '#D4C8B0',
    accentColor: '#C99A2E',
    sectorSlug: 'showroom-recyclage',
    sectorColor: '#8A8F7A',
  },
]

export function getDisciplineBySlug(slug: string) {
  return disciplines.find(d => d.slug === slug) ?? null
}

export function getDisciplinesBySector(sectorSlug: string) {
  return disciplines.filter(d => d.sectorSlug === sectorSlug)
}
