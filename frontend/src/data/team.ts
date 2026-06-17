export interface TeamMember {
  id: string
  name: string
  jobTitle: string
  bio: string
  photoUrl: string
  linkedInUrl?: string
  instagramUrl?: string
}

export const team: TeamMember[] = [
  {
    id: '1',
    name: 'Nadia Bouzid',
    jobTitle: 'Directrice artistique',
    bio: 'Chorégraphe et curatrice, Nadia a fondé le BSMK après 15 ans passés entre Tunis, Paris et Barcelone. Elle porte la vision d\'un espace culturel méditerranéen ancré dans son territoire et ouvert sur le monde.',
    photoUrl: '/assets/images/morgan-petroski.jpg',
    linkedInUrl: '#',
    instagramUrl: '#',
  },
  {
    id: '2',
    name: 'Karim Mansouri',
    jobTitle: 'Responsable des programmes',
    bio: 'Musicien et pédagogue, Karim coordonne l\'ensemble des programmes de formation et de résidence du BSMK. Il a développé une approche pédagogique originale mêlant pratique artistique et engagement communautaire.',
    photoUrl: '/assets/images/happy-face.jpg',
  },
  {
    id: '3',
    name: 'Sana Trabelsi',
    jobTitle: 'Coordinatrice VetrinArt',
    bio: 'Designer et militante du numérique culturel, Sana développe VetrinArt, le réseau professionnel des artistes du BSMK. Elle accompagne les artistes dans la construction de leur présence en ligne.',
    photoUrl: '/assets/images/sable-flow.jpg',
    instagramUrl: '#',
  },
  {
    id: '4',
    name: 'Youssef Hamdi',
    jobTitle: 'Responsable technique & espaces',
    bio: 'Ingénieur du son de formation, Youssef assure la direction technique du BSMK et la gestion de ses espaces. Il veille à ce que chaque studio et salle soit à la hauteur des projets artistiques qui y prennent vie.',
    photoUrl: '/assets/images/felipe-portella.jpg',
  },
  {
    id: '5',
    name: 'Ines Chaabane',
    jobTitle: 'Chargée de communication',
    bio: 'Journaliste culturelle reconvertie, Ines pilote la communication du BSMK et dirige la rédaction du magazine en ligne. Elle croit profondément au pouvoir du récit pour transformer les regards sur la création artistique.',
    photoUrl: '/assets/images/dakota-lim.jpg',
    linkedInUrl: '#',
  },
  {
    id: '6',
    name: 'Mehdi Gallas',
    jobTitle: 'Coordinateur événements',
    bio: 'Producteur de spectacles, Mehdi orchestre l\'agenda événementiel du BSMK : concerts, expositions, projections et festivals. Il tisse un réseau de partenariats avec les structures culturelles de la région méditerranéenne.',
    photoUrl: '/assets/images/rocco-dipoppa.jpg',
    instagramUrl: '#',
  },
]
