export interface Space {
  id: string
  slug: string
  name: string
  description: string
  floor: string
  surfaceSqm: number
  capacity: number
  equipment: string[]
  imageUrls: string[]
  disciplineSlugs: string[]
  featured: boolean
}

export const spaces: Space[] = [
  {
    id: '1',
    slug: 'studio-musique-a',
    name: 'Studio A — Production',
    description: 'Studio de musique professionnel avec régie de son, traitement acoustique complet et instruments disponibles. Idéal pour l\'enregistrement, le mixage et la MAO.',
    floor: 'Niveau 1',
    surfaceSqm: 65,
    capacity: 12,
    equipment: ['Console Neve 8078', 'Pro Tools HDX', 'Monitors Genelec', 'Piano Steinway', 'Batterie Pearl', 'Amplis Fender & Marshall', 'Large parc de micros'],
    imageUrls: ['/assets/images/caught-in-joy.jpg', '/assets/images/techivation.jpg', '/assets/images/felipe-portella.jpg'],
    disciplineSlugs: ['musique-production'],
    featured: true,
  },
  {
    id: '2',
    slug: 'studio-musique-b',
    name: 'Studio B — Répétition',
    description: 'Studio de répétition acoustiquement traité, équipé pour les groupes et les formations musicales. Disponible à la demi-journée ou à la journée.',
    floor: 'Niveau 1',
    surfaceSqm: 40,
    capacity: 8,
    equipment: ['Batterie complète', 'Amplis basse & guitare', 'Piano électrique', 'Système PA', 'Backline complet'],
    imageUrls: ['/assets/images/felipe-portella.jpg', '/assets/images/rocco-dipoppa.jpg'],
    disciplineSlugs: ['musique-production'],
    featured: false,
  },
  {
    id: '3',
    slug: 'salle-danse',
    name: 'Grande salle de danse',
    description: 'Espace de danse lumineux avec sol semi-souple de 120m², barres, miroirs et système son intégré. La plus grande salle de pratique de la danse à Tunis.',
    floor: 'Niveau 2',
    surfaceSqm: 120,
    capacity: 30,
    equipment: ['Sol semi-souple Harlequin', 'Barres fixes et mobiles', 'Miroirs pleine hauteur', 'Système son Bose', 'Éclairage scénique', 'Sono portable'],
    imageUrls: ['/assets/images/gift-habeshaw.jpg', '/assets/images/morgan-petroski.jpg'],
    disciplineSlugs: ['danse-performance'],
    featured: true,
  },
  {
    id: '4',
    slug: 'salle-repetition-theatre',
    name: 'Salle de répétition théâtre',
    description: 'Salle modulable pour les répétitions et les représentations de petite jauge. Noir intégral, gradins amovibles, régie légère et son.',
    floor: 'Niveau 2',
    surfaceSqm: 80,
    capacity: 40,
    equipment: ['Sol de scène noir', 'Gradins amovibles 40 places', 'Console lumière Avolites', 'Projecteurs LEDs', 'Système son Nexo', 'Penderie costumes'],
    imageUrls: ['/assets/images/hamish-kale.jpg', '/assets/images/rainier-ridao.jpg'],
    disciplineSlugs: ['theatre-arts-vivants'],
    featured: false,
  },
  {
    id: '5',
    slug: 'salle-projection',
    name: 'Salle de projection',
    description: 'Cinéma de 100 places avec projection 4K laser, système Dolby Atmos et écran panoramique. Disponible pour projections publiques, privées et festivals.',
    floor: 'Niveau 0',
    surfaceSqm: 180,
    capacity: 100,
    equipment: ['Projecteur Sony 4K Laser', 'Écran 8m × 4m', 'Son Dolby Atmos 7.1', 'Cabine de traduction simultanée', 'Régie de diffusion'],
    imageUrls: ['/assets/images/dakota-lim.jpg', '/assets/images/jakob-owens.jpg'],
    disciplineSlugs: ['cinema-audiovisuel'],
    featured: true,
  },
  {
    id: '6',
    slug: 'atelier-arts-visuels',
    name: 'Atelier arts visuels',
    description: 'Atelier de création ouvert, éclairé à la lumière naturelle, équipé pour la peinture, le dessin, la gravure et la sculpture.',
    floor: 'Niveau 3',
    surfaceSqm: 90,
    capacity: 15,
    equipment: ['Tables d\'artiste réglables', 'Éclairage naturel + LED', 'Presse à graver', 'Tour de potier', 'Four à céramique', 'Stockage matériaux'],
    imageUrls: ['/assets/images/vitaly-gariev.jpg', '/assets/images/minh.jpg'],
    disciplineSlugs: ['arts-visuels', 'artisanat-design'],
    featured: false,
  },
  {
    id: '7',
    slug: 'fablab-numerique',
    name: 'FabLab numérique',
    description: 'Espace de fabrication et de création numérique : impression 3D, découpe laser, électronique, design graphique et réalité augmentée.',
    floor: 'Niveau 3',
    surfaceSqm: 70,
    capacity: 12,
    equipment: ['3 imprimantes 3D Ultimaker', 'Découpe laser Trotec', '10 stations iMac Pro', 'Tablettes Wacom', 'Découpe vinyle', 'Arduino & Raspberry Pi'],
    imageUrls: ['/assets/images/techivation.jpg', '/assets/images/jakob-owens.jpg'],
    disciplineSlugs: ['arts-numeriques'],
    featured: false,
  },
  {
    id: '8',
    slug: 'grande-salle',
    name: 'Grande salle polyvalente',
    description: 'Espace événementiel de 300 places en configuration concert ou 200 places en configuration théâtre. Accueille concerts, spectacles, vernissages et événements professionnels.',
    floor: 'Niveau 0',
    surfaceSqm: 500,
    capacity: 300,
    equipment: ['Scène 12m × 8m', 'Son Line Array L-Acoustics', 'Éclairage scénique complet', 'Régie mobile', 'Loges artistes', 'Espace presse'],
    imageUrls: ['/assets/images/andrii-olishevskyi.jpg', '/assets/images/danny-howe.jpg', '/assets/images/samuel-regan.jpg'],
    disciplineSlugs: ['musique-production', 'danse-performance', 'theatre-arts-vivants'],
    featured: true,
  },
  {
    id: '9',
    slug: 'salle-conference',
    name: 'Salle de conférence',
    description: 'Salle de conférence et de formation équipée, disponible pour séminaires, ateliers académiques et rencontres professionnelles.',
    floor: 'Niveau 1',
    surfaceSqm: 60,
    capacity: 50,
    equipment: ['Vidéoprojecteur 4K', 'Système de visioconférence', 'Tableau blanc interactif', 'Micros de conférence', 'WiFi haut débit'],
    imageUrls: ['/assets/images/sable-flow.jpg'],
    disciplineSlugs: [],
    featured: false,
  },
  {
    id: '10',
    slug: 'coworking-artistes',
    name: 'Espace coworking artistes',
    description: 'Espace de travail partagé dédié aux artistes et créatifs : postes de travail équipés, zone lounge, petite bibliothèque artistique.',
    floor: 'Niveau 2',
    surfaceSqm: 80,
    capacity: 25,
    equipment: ['25 postes équipés', 'Zone réunion 8 personnes', 'Bibliothèque artistique', 'Casiers sécurisés', 'Cafétéria', 'Terrasse'],
    imageUrls: ['/assets/images/sable-flow.jpg', '/assets/images/andy-bodemer.jpg'],
    disciplineSlugs: [],
    featured: false,
  },
]

export function getSpaceBySlug(slug: string) {
  return spaces.find(s => s.slug === slug) ?? null
}

export function getSpacesByDiscipline(disciplineSlug: string) {
  return spaces.filter(s => s.disciplineSlugs.includes(disciplineSlug))
}
