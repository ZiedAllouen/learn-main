export type EventType = 'CONCERT' | 'EXHIBITION' | 'WORKSHOP' | 'RESIDENCY' | 'SCREENING' | 'CONFERENCE' | 'FESTIVAL' | 'OTHER'

export interface Event {
  id: string
  slug: string
  title: string
  description: string
  eventType: EventType
  startDate: string
  endDate?: string
  location: string
  coverUrl: string
  ticketUrl?: string
  disciplineSlugs: string[]
  free: boolean
  price?: string
}

export const events: Event[] = [
  {
    id: '1',
    slug: 'concert-ouverture-saison',
    title: 'Concert d\'ouverture de saison — Collectif Médina',
    description: 'Le Collectif Médina ouvre la saison 2026-2027 du BSMK avec un concert mêlant jazz, musique arabe et électronique, dans la grande salle du centre.',
    eventType: 'CONCERT',
    startDate: '2026-06-06T21:00:00',
    location: 'Grande salle polyvalente — BSMK',
    coverUrl: 'https://picsum.photos/seed/concert-medina/800/450',
    disciplineSlugs: ['musique-production'],
    free: false,
    price: '25 DT / 15 DT réduit',
  },
  {
    id: '2',
    slug: 'exposition-corps-territoire',
    title: 'Corps & Territoire — Exposition collective',
    description: 'Exposition réunissant 8 artistes plasticiens tunisiens et méditerranéens autour de la relation entre le corps et l\'espace habité.',
    eventType: 'EXHIBITION',
    startDate: '2026-05-20T18:00:00',
    endDate: '2026-06-20T20:00:00',
    location: 'Atelier arts visuels & Espace d\'exposition — BSMK',
    coverUrl: 'https://picsum.photos/seed/expo-corps/800/450',
    disciplineSlugs: ['arts-visuels'],
    free: true,
  },
  {
    id: '3',
    slug: 'projection-cinema-maghreb',
    title: 'Cycle Cinéma Maghrébin Contemporain — Séance 1',
    description: 'Premier volet du cycle de projections consacré au cinéma maghrébin contemporain. Au programme : "Les Enfants de la mer" de Kaouther Ben Hania.',
    eventType: 'SCREENING',
    startDate: '2026-05-23T20:30:00',
    location: 'Salle de projection — BSMK',
    coverUrl: 'https://picsum.photos/seed/cinema-cycle/800/450',
    disciplineSlugs: ['cinema-audiovisuel'],
    free: true,
  },
  {
    id: '4',
    slug: 'atelier-poterie-sejnane',
    title: 'Atelier poterie — Traditions de Sejnane',
    description: 'Initiation aux techniques de poterie de Sejnane avec la maître artisane Fatma Hamdi. Séances ouvertes à tous niveaux.',
    eventType: 'WORKSHOP',
    startDate: '2026-05-25T10:00:00',
    endDate: '2026-05-25T13:00:00',
    location: 'Atelier arts visuels — BSMK',
    coverUrl: 'https://picsum.photos/seed/poterie/800/450',
    disciplineSlugs: ['artisanat-design'],
    free: false,
    price: '35 DT / matériaux inclus',
  },
  {
    id: '5',
    slug: 'conference-art-engagement',
    title: 'Conférence : Art, engagement et responsabilité en 2026',
    description: 'Table ronde réunissant des artistes, commissaires et théoriciens autour de la question de l\'engagement artistique dans le contexte méditerranéen actuel.',
    eventType: 'CONFERENCE',
    startDate: '2026-05-30T17:00:00',
    endDate: '2026-05-30T19:30:00',
    location: 'Salle de conférence — BSMK',
    coverUrl: 'https://picsum.photos/seed/conference/800/450',
    disciplineSlugs: [],
    free: true,
  },
  {
    id: '6',
    slug: 'performance-danse-stambali',
    title: 'Nuit du Stambali — Performance & conférence gestuelle',
    description: 'Soirée exceptionnelle autour du Stambali, musique et danse de transe tunisienne. Performance du Groupe El Farah, conférence de Nadia Bouzid.',
    eventType: 'CONCERT',
    startDate: '2026-06-13T20:00:00',
    location: 'Grande salle polyvalente — BSMK',
    coverUrl: 'https://picsum.photos/seed/stambali/800/450',
    disciplineSlugs: ['musique-production', 'danse-performance'],
    free: false,
    price: '20 DT',
  },
  {
    id: '7',
    slug: 'festival-arts-numeriques',
    title: 'BSMK Digital Fest — 3ème édition',
    description: 'Trois jours de créations numériques, installations interactives, ateliers et conférences au carrefour de l\'art et de la technologie.',
    eventType: 'FESTIVAL',
    startDate: '2026-06-19T10:00:00',
    endDate: '2026-06-21T22:00:00',
    location: 'BSMK — tous espaces',
    coverUrl: 'https://picsum.photos/seed/digital-fest/800/450',
    disciplineSlugs: ['arts-numeriques'],
    free: false,
    price: '30 DT / pass 3 jours · 15 DT / jour',
  },
  {
    id: '8',
    slug: 'projection-restitution-residence',
    title: 'Restitution de résidence — Compagnie Espace Libre',
    description: 'Présentation du travail de la Compagnie Espace Libre après 3 semaines de résidence au BSMK. Performance suivie d\'une discussion avec l\'équipe artistique.',
    eventType: 'OTHER',
    startDate: '2026-06-27T19:00:00',
    location: 'Salle de répétition théâtre — BSMK',
    coverUrl: 'https://picsum.photos/seed/restitution/800/450',
    disciplineSlugs: ['theatre-arts-vivants'],
    free: true,
  },
  {
    id: '9',
    slug: 'concert-fin-formation-son',
    title: 'Concert de fin de formation — Promotion Son & MAO 2026',
    description: 'Les diplômés de la formation Son & MAO présentent leurs projets musicaux finaux lors d\'une soirée de concert ouverte au public.',
    eventType: 'CONCERT',
    startDate: '2026-07-04T20:00:00',
    location: 'Grande salle polyvalente — BSMK',
    coverUrl: 'https://picsum.photos/seed/concert-diplome/800/450',
    disciplineSlugs: ['musique-production'],
    free: true,
  },
  {
    id: '10',
    slug: 'exposition-vetrinart-printemps',
    title: 'VetrinArt x BSMK — Printemps des artistes',
    description: 'Première exposition physique VetrinArt : 20 artistes de la plateforme présentent leurs œuvres dans les espaces du BSMK pendant deux semaines.',
    eventType: 'EXHIBITION',
    startDate: '2026-06-01T18:00:00',
    endDate: '2026-06-14T20:00:00',
    location: 'BSMK — Espaces d\'exposition',
    coverUrl: 'https://picsum.photos/seed/vetrinart-expo/800/450',
    disciplineSlugs: ['arts-visuels', 'artisanat-design', 'arts-numeriques'],
    free: true,
  },
  {
    id: '11',
    slug: 'atelier-ecriture-dramaturgique',
    title: 'Atelier écriture dramaturgique — Week-end intensif',
    description: 'Deux jours pour écrire, lire et critiquer des textes dramatiques. Animé par la dramaturge Sonia Chamkhi.',
    eventType: 'WORKSHOP',
    startDate: '2026-07-11T10:00:00',
    endDate: '2026-07-12T17:00:00',
    location: 'Salle de conférence — BSMK',
    coverUrl: 'https://picsum.photos/seed/ecriture/800/450',
    disciplineSlugs: ['theatre-arts-vivants'],
    free: false,
    price: '120 DT',
  },
  {
    id: '12',
    slug: 'nuit-blanche-creation',
    title: 'Nuit blanche de la création — Portes ouvertes BSMK',
    description: 'Une nuit entière pour explorer le BSMK, rencontrer ses artistes, assister à des performances et ateliers nocturnes dans tous les espaces du centre.',
    eventType: 'FESTIVAL',
    startDate: '2026-07-18T20:00:00',
    endDate: '2026-07-19T06:00:00',
    location: 'BSMK — tous espaces',
    coverUrl: 'https://picsum.photos/seed/nuit-blanche/800/450',
    disciplineSlugs: ['musique-production', 'danse-performance', 'arts-visuels', 'theatre-arts-vivants'],
    free: true,
  },
]

export function getEventBySlug(slug: string) {
  return events.find(e => e.slug === slug) ?? null
}

export function getUpcomingEvents(count = 3) {
  const now = new Date()
  return [...events]
    .filter(e => new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, count)
}

export function getEventsByDiscipline(disciplineSlug: string) {
  return events.filter(e => e.disciplineSlugs.includes(disciplineSlug))
}

export const eventTypeLabels: Record<EventType, string> = {
  CONCERT: 'Concert',
  EXHIBITION: 'Exposition',
  WORKSHOP: 'Atelier',
  RESIDENCY: 'Résidence',
  SCREENING: 'Projection',
  CONFERENCE: 'Conférence',
  FESTIVAL: 'Festival',
  OTHER: 'Événement',
}
