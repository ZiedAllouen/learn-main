export interface Artist {
  id: string
  slug: string
  name: string
  city: string
  country: string
  disciplineSlugs: string[]
  bio: string
  statement: string
  photoUrl: string
  portfolioImages: string[]
  website?: string
  social: {
    instagram?: string
    facebook?: string
    youtube?: string
  }
  featured: boolean
  memberSince: string
  specialties: string[]
  availableForCollaboration: boolean
}

export const artists: Artist[] = [
  {
    id: '1',
    slug: 'leila-ben-youssef',
    name: 'Leila Ben Youssef',
    city: 'Tunis',
    country: 'Tunisie',
    disciplineSlugs: ['musique-production', 'arts-numeriques'],
    bio: 'Compositrice et productrice électronique, Leila Ben Youssef mêle les maqâms de la musique arabo-andalouse aux textures synthétiques contemporaines. Formée au Conservatoire national de Tunis puis à l\'Ircam de Paris, elle a collaboré avec des artistes de toute la Méditerranée. Ses compositions ont été jouées dans des festivals internationaux, de Berlin à Beyrouth.',
    statement: 'La mémoire sonore méditerranéenne est un archipel infini que j\'explore une fréquence à la fois.',
    photoUrl: '/assets/images/caught-in-joy.jpg',
    portfolioImages: [
      '/assets/images/techivation.jpg',
      '/assets/images/jakob-owens.jpg',
      '/assets/images/felipe-portella.jpg',
    ],
    website: 'https://www.leilabenyoussef.tn',
    social: {
      instagram: '@leila.benyoussef',
      youtube: 'LeilaBenYoussefMusic',
    },
    featured: true,
    memberSince: '2023',
    specialties: ['Musique électronique', 'Maqâm contemporain', 'Production MAO', 'Sound design'],
    availableForCollaboration: true,
  },
  {
    id: '2',
    slug: 'omar-kaddouri',
    name: 'Omar Kaddouri',
    city: 'Casablanca',
    country: 'Maroc',
    disciplineSlugs: ['arts-visuels'],
    bio: 'Photographe documentaire et plasticien, Omar Kaddouri construit une œuvre au croisement de l\'anthropologie visuelle et de l\'art contemporain. Ses séries photographiques explorent les mutations des espaces urbains méditerranéens, de Casablanca à Marseille. Il a exposé dans une dizaine de pays et remporté le Prix de la Photographie Africaine en 2022.',
    statement: 'Photographier la ville, c\'est lire l\'histoire que les hommes écrivent sans le savoir sur les murs.',
    photoUrl: '/assets/images/andy-bodemer.jpg',
    portfolioImages: [
      '/assets/images/andy-bodemer.jpg',
      '/assets/images/happy-face.jpg',
      '/assets/images/samantha.jpg',
    ],
    website: 'https://www.omarkaddouri.ma',
    social: {
      instagram: '@omar.kaddouri',
      facebook: 'OmarKaddouriPhoto',
    },
    featured: true,
    memberSince: '2023',
    specialties: ['Photographie documentaire', 'Art urbain', 'Argentique', 'Installation'],
    availableForCollaboration: true,
  },
  {
    id: '3',
    slug: 'sarra-mellouli',
    name: 'Sarra Mellouli',
    city: 'Sfax',
    country: 'Tunisie',
    disciplineSlugs: ['danse-performance'],
    bio: 'Chorégraphe et interprète, Sarra Mellouli développe depuis dix ans un langage corporel singulier qui dialogue avec les formes gestuelles de la danse nord-africaine. Après des études à l\'École Nationale des Arts du Cirque et de la Danse de Tunis, elle fonde la compagnie Mahia dont les créations tournent en France, en Italie et au Portugal. Son travail est traversé par les questions de genre, de territoire et de mémoire du corps.',
    statement: 'Le corps garde en lui tout ce que les mots ont refusé de dire.',
    photoUrl: '/assets/images/morgan-petroski.jpg',
    portfolioImages: [
      '/assets/images/morgan-petroski.jpg',
      '/assets/images/jose-garcia.jpg',
      '/assets/images/patrick-kool.jpg',
    ],
    website: 'https://www.sarramellouli.tn',
    social: {
      instagram: '@sarra.mellouli',
      facebook: 'CompagnieMahia',
    },
    featured: false,
    memberSince: '2024',
    specialties: ['Danse contemporaine', 'Chorégraphie', 'Performance', 'Danse traditionnelle'],
    availableForCollaboration: true,
  },
  {
    id: '4',
    slug: 'yacine-arab',
    name: 'Yacine Arab',
    city: 'Alger',
    country: 'Algérie',
    disciplineSlugs: ['cinema-audiovisuel'],
    bio: 'Cinéaste et monteur, Yacine Arab réalise des documentaires qui donnent la parole aux marges de la société algérienne. Diplômé de l\'Institut National Supérieur des Arts du Spectacle d\'Alger et de la FEMIS de Paris, il a signé trois longs métrages documentaires sélectionnés dans des festivals internationaux majeurs. Son cinéma est reconnu pour sa rigueur formelle et son engagement politique.',
    statement: 'Un film est un acte politique ou il n\'est rien.',
    photoUrl: '/assets/images/dakota-lim.jpg',
    portfolioImages: [
      '/assets/images/dakota-lim.jpg',
      '/assets/images/jakob-owens.jpg',
      '/assets/images/iskandar-putra.jpg',
    ],
    website: 'https://www.yacinearab.dz',
    social: {
      instagram: '@yacine.arab.films',
      youtube: 'YacineArabCinema',
    },
    featured: true,
    memberSince: '2024',
    specialties: ['Documentaire', 'Montage', 'Cinéma engagé', 'Fiction courte'],
    availableForCollaboration: false,
  },
  {
    id: '5',
    slug: 'nour-hajji',
    name: 'Nour Hajji',
    city: 'Sousse',
    country: 'Tunisie',
    disciplineSlugs: ['artisanat-design'],
    bio: 'Designer céramiste, Nour Hajji travaille à la frontière entre la tradition potière tunisienne et le design contemporain. Elle a créé son atelier à Sousse après une résidence à la villa Médicis de Rome et collabore avec des maisons d\'édition de design européennes. Ses pièces font partie des collections permanentes de plusieurs musées d\'art décoratif.',
    statement: 'La terre est le plus honnête des matériaux — elle ne ment jamais sur ce que vous y mettez.',
    photoUrl: '/assets/images/minh.jpg',
    portfolioImages: [
      '/assets/images/minh.jpg',
      '/assets/images/swastik-arora.jpg',
      '/assets/images/vitaly-gariev.jpg',
    ],
    website: 'https://www.nourhajji.tn',
    social: {
      instagram: '@nour.hajji.ceramique',
      facebook: 'NourHajjiDesign',
    },
    featured: false,
    memberSince: '2023',
    specialties: ['Céramique', 'Design objet', 'Poterie traditionnelle', 'Édition limitée'],
    availableForCollaboration: true,
  },
  {
    id: '6',
    slug: 'khalil-cherif',
    name: 'Khalil Chérif',
    city: 'Tunis',
    country: 'Tunisie',
    disciplineSlugs: ['theatre-arts-vivants', 'danse-performance'],
    bio: 'Metteur en scène et acteur, Khalil Chérif dirige depuis 2018 le Théâtre de Poche du BSMK où il développe un répertoire qui mêle textes classiques arabes et dramaturgie contemporaine. Formé à l\'école du TNS de Strasbourg, il est aussi chercheur en arts du spectacle et enseigne régulièrement dans plusieurs écoles d\'art tunisiennes. Ses spectacles ont tourné dans toute la francophonie.',
    statement: 'Le plateau de théâtre est le seul endroit où le présent peut encore être véritablement habité.',
    photoUrl: '/assets/images/hamish-kale.jpg',
    portfolioImages: [
      '/assets/images/hamish-kale.jpg',
      '/assets/images/rainier-ridao.jpg',
      '/assets/images/samantha.jpg',
    ],
    website: 'https://www.khalilcherif.tn',
    social: {
      instagram: '@khalil.cherif.theatre',
      facebook: 'KhalilCherifMetteurEnScene',
    },
    featured: false,
    memberSince: '2023',
    specialties: ['Mise en scène', 'Dramaturgie', 'Jeu', 'Texte contemporain'],
    availableForCollaboration: false,
  },
  {
    id: '7',
    slug: 'amira-zouari',
    name: 'Amira Zouari',
    city: 'Bizerte',
    country: 'Tunisie',
    disciplineSlugs: ['arts-visuels'],
    bio: 'Peintre et graveuse, Amira Zouari réalise de grandes œuvres sur toile et sur papier qui interrogent la relation entre corps féminin, paysage méditerranéen et mémoire collective. Diplômée de l\'École des Beaux-Arts de Tunis et de l\'École nationale supérieure des Arts Décoratifs de Paris, elle expose régulièrement en France, en Belgique et dans les pays du Maghreb. Elle est co-fondatrice du collectif féminin d\'artistes plasticiennes « Thalassa ».',
    statement: 'Peindre c\'est retenir ce que la mer efface chaque matin.',
    photoUrl: '/assets/images/vitaly-gariev.jpg',
    portfolioImages: [
      '/assets/images/vitaly-gariev.jpg',
      '/assets/images/minh.jpg',
      '/assets/images/happy-face.jpg',
    ],
    website: 'https://www.amirazouari.tn',
    social: {
      instagram: '@amira.zouari.art',
    },
    featured: false,
    memberSince: '2024',
    specialties: ['Peinture', 'Gravure', 'Dessin', 'Grande format'],
    availableForCollaboration: true,
  },
  {
    id: '8',
    slug: 'rami-khalifa',
    name: 'Rami Khalifa',
    city: 'Beyrouth',
    country: 'Liban',
    disciplineSlugs: ['musique-production', 'theatre-arts-vivants'],
    bio: 'Musicien et compositeur multidisciplinaire, Rami Khalifa est connu pour ses performances qui mêlent oud électrifié, électronique live et récit autobiographique. Né à Beyrouth, formé entre la Jordanie et la France, il développe depuis Tunis une pratique artistique nomade qui traverse les frontières des genres. Il a collaboré avec des metteurs en scène, des danseurs et des vidéastes dans plus de vingt pays.',
    statement: 'Ma musique est une cartographie de tous les départs et de tous les retours.',
    photoUrl: '/assets/images/rocco-dipoppa.jpg',
    portfolioImages: [
      '/assets/images/rocco-dipoppa.jpg',
      '/assets/images/felipe-portella.jpg',
      '/assets/images/danny-howe.jpg',
    ],
    website: 'https://www.ramikhalifa.com',
    social: {
      instagram: '@ramikhalifa',
      youtube: 'RamiKhalifaMusic',
      facebook: 'RamiKhalifaOfficiel',
    },
    featured: true,
    memberSince: '2025',
    specialties: ['Oud contemporain', 'Électronique live', 'Performance', 'Jazz méditerranéen'],
    availableForCollaboration: true,
  },
  {
    id: '9',
    slug: 'fatima-benali',
    name: 'Fatima Benali',
    city: 'Marseille',
    country: 'France',
    disciplineSlugs: ['arts-numeriques'],
    bio: 'Artiste numérique et chercheuse, Fatima Benali développe des installations interactives qui explorent les relations entre intelligence artificielle, mémoire culturelle et identité méditerranéenne. Après un doctorat en arts numériques à l\'Université d\'Aix-Marseille, elle a été en résidence dans des laboratoires de recherche artistique en Corée du Sud et aux Pays-Bas. Ses œuvres sont présentées dans des centres d\'art contemporain en Europe et au Maghreb.',
    statement: 'L\'algorithme n\'a pas de mémoire — mon rôle est de lui en donner une.',
    photoUrl: '/assets/images/techivation.jpg',
    portfolioImages: [
      '/assets/images/techivation.jpg',
      '/assets/images/jakob-owens.jpg',
      '/assets/images/sable-flow.jpg',
    ],
    website: 'https://www.fatimabenali.fr',
    social: {
      instagram: '@fatima.benali.art',
      facebook: 'FatimaBenaliArtNumerique',
    },
    featured: false,
    memberSince: '2024',
    specialties: ['Art génératif', 'Intelligence artificielle', 'Installation interactive', 'Design numérique'],
    availableForCollaboration: true,
  },
  {
    id: '10',
    slug: 'aziz-chouikh',
    name: 'Aziz Chouikh',
    city: 'Sfax',
    country: 'Tunisie',
    disciplineSlugs: ['artisanat-design', 'arts-visuels'],
    bio: 'Tisserand et designer textile, Aziz Chouikh perpétue et réinvente les techniques ancestrales du tissage sfaxien dans un dialogue constant avec le design contemporain. Il a fondé son atelier Fil à Fil à Sfax en 2017, où il forme de jeunes apprentis tout en développant des collections en édition limitée pour des boutiques de design en Europe. Son travail a été présenté à la Biennale de Design de Saint-Étienne et au Salon du Meuble de Milan.',
    statement: 'Chaque fil est une décision — tisser, c\'est penser avec les mains.',
    photoUrl: '/assets/images/swastik-arora.jpg',
    portfolioImages: [
      '/assets/images/swastik-arora.jpg',
      '/assets/images/minh.jpg',
      '/assets/images/vitaly-gariev.jpg',
    ],
    website: 'https://www.aziz-chouikh.tn',
    social: {
      instagram: '@aziz.chouikh.tissage',
      facebook: 'FilAFilAzizChouikh',
    },
    featured: false,
    memberSince: '2025',
    specialties: ['Tissage', 'Design textile', 'Artisanat traditionnel', 'Édition limitée'],
    availableForCollaboration: false,
  },
  {
    id: '11',
    slug: 'giulia-romano',
    name: 'Giulia Romano',
    city: 'Palerme',
    country: 'Italie',
    disciplineSlugs: ['cinema-audiovisuel', 'arts-visuels'],
    bio: 'Réalisatrice et vidéaste, Giulia Romano tourne des films à la frontière du documentaire et de l\'essai visuel. Originaire de Palerme, elle construit une œuvre profondément enracinée dans la Méditerranée et ses récits de migrations. Ses films ont été sélectionnés dans des festivals comme Locarno, FIDMarseille et le BIAFF de Bizerte. Elle est également monteuse pour plusieurs cinéastes indépendants du pourtour méditerranéen.',
    statement: 'Le détroit de Sicile est le lieu le plus cinématographique du monde — une scène sans fond.',
    photoUrl: '/assets/images/dakota-lim.jpg',
    portfolioImages: [
      '/assets/images/dakota-lim.jpg',
      '/assets/images/jakob-owens.jpg',
      '/assets/images/andy-bodemer.jpg',
    ],
    website: 'https://www.giuliaromano.it',
    social: {
      instagram: '@giulia.romano.film',
      youtube: 'GiuliaRomanoFilms',
    },
    featured: false,
    memberSince: '2025',
    specialties: ['Cinéma essai', 'Documentaire', 'Vidéo art', 'Montage'],
    availableForCollaboration: true,
  },
  {
    id: '12',
    slug: 'mehdi-bousbia',
    name: 'Mehdi Bousbia',
    city: 'Oran',
    country: 'Algérie',
    disciplineSlugs: ['musique-production', 'arts-numeriques'],
    bio: 'Producteur et DJ, Mehdi Bousbia est l\'une des figures montantes de la scène électronique nord-africaine. Il fusionne le raï d\'Oran, la musique gnawa et les sonorités club contemporaines dans un style immédiatement reconnaissable. Ses sets ont enflammé des clubs et festivals en Europe et au Moyen-Orient, et son premier album Maghreb Club, sorti en 2024, a été salué par la presse musicale internationale.',
    statement: 'Le raï c\'est déjà de l\'électronique — Khaled avait juste pas le logiciel.',
    photoUrl: '/assets/images/iskandar-putra.jpg',
    portfolioImages: [
      '/assets/images/iskandar-putra.jpg',
      '/assets/images/danny-howe.jpg',
      '/assets/images/samuel-regan.jpg',
    ],
    website: 'https://www.mehdibousbia.dz',
    social: {
      instagram: '@mehdibousbia',
      youtube: 'MehdiBousbiaDJ',
      facebook: 'MehdiBousbiaOfficiel',
    },
    featured: false,
    memberSince: '2025',
    specialties: ['Production électronique', 'DJ', 'Raï contemporain', 'Musique gnawa'],
    availableForCollaboration: true,
  },
]

export function getArtistBySlug(slug: string): Artist | null {
  return artists.find(a => a.slug === slug) ?? null
}

export function getArtistsByDiscipline(disciplineSlug: string): Artist[] {
  return artists.filter(a => a.disciplineSlugs.includes(disciplineSlug))
}

export function getFeaturedArtists(): Artist[] {
  return artists.filter(a => a.featured)
}
