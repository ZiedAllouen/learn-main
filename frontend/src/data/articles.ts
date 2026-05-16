export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  coverUrl: string
  authorName: string
  authorPhotoUrl: string
  category: string
  categorySlug: string
  disciplineSlugs: string[]
  tags: string[]
  readingTime: number
  publishedAt: string
  featured: boolean
}

export const articles: Article[] = [
  {
    id: '1',
    slug: 'mediterranee-territoire-art',
    title: 'La Méditerranée comme territoire d\'art partagé',
    excerpt: 'À l\'heure où les frontières se ferment, la Méditerranée reste un espace de circulation des formes, des corps et des imaginaires. Comment les artistes contemporains habitent-ils ce territoire commun ?',
    body: `La Méditerranée n'est pas une mer — c'est une conversation. Depuis des millénaires, ses rives échangent épices, langues, mythes et techniques. Aujourd'hui, alors que les politiques migratoires érigent de nouveaux murs, les artistes continuent de traverser, de dialoguer, de créer ensemble.

Au BSMK, cette conviction est fondatrice. Nous croyons que l'art méditerranéen n'est pas un style ni une esthétique : c'est une méthode. Une façon de travailler qui accepte l'hybridation, qui cherche le commun sans effacer les différences.

Les résidences que nous accueillons chaque année réunissent des artistes de Tunis, Marseille, Beyrouth, Barcelone, Naples. Ils partagent un espace, des repas, des débats. Ils fabriquent ensemble des œuvres qui n'auraient pas pu naître ailleurs.

Cette dynamique, nous voulons la rendre visible et accessible. C'est le sens du BSMK : être un passage, une membrane, un lieu où la Méditerranée se pense et se crée.`,
    coverUrl: 'https://picsum.photos/seed/med-art/1200/600',
    authorName: 'Nadia Bouzid',
    authorPhotoUrl: 'https://picsum.photos/seed/nadia/100/100',
    category: 'Réflexions',
    categorySlug: 'reflexions',
    disciplineSlugs: ['arts-visuels', 'danse-performance'],
    tags: ['Méditerranée', 'identité', 'résidence', 'collaboration'],
    readingTime: 6,
    publishedAt: '2026-04-12',
    featured: true,
  },
  {
    id: '2',
    slug: 'rencontre-selma-baccar',
    title: 'Selma Baccar : «Le cinéma est le seul art qui capte le temps qui passe»',
    excerpt: 'Pionnière du cinéma tunisien, Selma Baccar revient sur une carrière de plus de cinquante ans et parle de son dernier projet, un documentaire sur la mémoire des femmes du Sahel.',
    body: `Dans le hall du BSMK, Selma Baccar attend, assise face à une fenêtre qui donne sur les jardins. À 78 ans, elle garde cette précision du regard qui caractérise ses films : rien ne lui échappe, tout devient matière.

"Le cinéma, c'est ma façon d'être au monde," dit-elle d'emblée. "Je ne peux pas imaginer ne pas filmer. Même quand je ne tourne pas, je cadre mentalement ce que je vois."

Son nouveau projet l'a ramenée dans le Sahel tunisien, région dont elle est originaire. Pendant deux ans, elle a collecté les témoignages de femmes âgées — mères, grands-mères, arrière-grands-mères — sur leur rapport au temps, au corps, à la transmission.

"Ce qui m'intéresse, c'est ce que la mémoire fait au présent. Ces femmes ne parlent pas du passé pour nostalgier. Elles parlent du passé pour comprendre maintenant."`,
    coverUrl: 'https://picsum.photos/seed/selma/1200/600',
    authorName: 'Ines Chaabane',
    authorPhotoUrl: 'https://picsum.photos/seed/ines/100/100',
    category: 'Portrait',
    categorySlug: 'portrait',
    disciplineSlugs: ['cinema-audiovisuel'],
    tags: ['cinéma', 'interview', 'mémoire', 'femmes'],
    readingTime: 9,
    publishedAt: '2026-04-28',
    featured: true,
  },
  {
    id: '3',
    slug: 'nouveaux-espaces-creation-tunis',
    title: 'Les nouveaux espaces de création à Tunis : une géographie en mouvement',
    excerpt: 'En dix ans, Tunis a vu émerger une nouvelle cartographie culturelle. Des espaces hybrides, autogérés ou institutionnels, transforment le rapport à la création artistique dans la capitale.',
    body: `En 2015, il n'existait qu'une poignée de lieux dédiés à la création contemporaine à Tunis. Aujourd'hui, la ville compte plusieurs dizaines d'espaces — petits ou grands, publics ou privés, associatifs ou commerciaux — qui offrent aux artistes des conditions de travail et de diffusion inédites.

Le phénomène n'est pas uniquement quantitatif. Ces nouveaux espaces ont inventé de nouvelles formes d'organisation : gouvernance collective, résidences courtes, programmation pluridisciplinaire, ancrage territorial fort. Ils ont créé un écosystème qui n'existait pas.

Le BSMK fait partie de cette nouvelle génération. Mais comme ses pairs, il doit faire face à des défis communs : modèles économiques précaires, dépendance aux subventions, turn-over des équipes. La question de la pérennité reste ouverte.`,
    coverUrl: 'https://picsum.photos/seed/tunis-espaces/1200/600',
    authorName: 'Ines Chaabane',
    authorPhotoUrl: 'https://picsum.photos/seed/ines/100/100',
    category: 'Reportage',
    categorySlug: 'reportage',
    disciplineSlugs: ['arts-visuels'],
    tags: ['Tunis', 'écosystème', 'lieux culturels', 'création'],
    readingTime: 7,
    publishedAt: '2026-05-02',
    featured: false,
  },
  {
    id: '4',
    slug: 'danse-memoire-maghreb',
    title: 'Danse et mémoire collective au Maghreb',
    excerpt: 'Le corps qui danse au Maghreb est toujours un corps historique. Un corps qui porte des mémoires de résistance, de fête, de deuil. Comment les chorégraphes contemporains négocient-ils avec cet héritage ?',
    body: `La danse au Maghreb ne commence pas dans les studios. Elle commence dans les rues, dans les maisons, dans les cérémonies. Elle commence dans les corps qui ont appris à bouger avant d'apprendre à parler.

Les chorégraphes contemporains maghrébins héritent de cette densité. Quand ils créent, ils négocient avec des formes qui ont des siècles — ou des millénaires — d'histoire. La ahidous berbère. Le guedra saharien. Le stambali tunisien. Ces formes ne sont pas des folklores à réactiver : elles sont des savoirs vivants.

Comment les intégrer dans une écriture chorégraphique contemporaine sans les trahir ? Comment les transformer sans les vider de sens ? C'est la question que se posent les artistes de notre résidence de danse ce printemps.`,
    coverUrl: 'https://picsum.photos/seed/danse-maghreb/1200/600',
    authorName: 'Karim Mansouri',
    authorPhotoUrl: 'https://picsum.photos/seed/karim/100/100',
    category: 'Essai',
    categorySlug: 'essai',
    disciplineSlugs: ['danse-performance'],
    tags: ['danse', 'Maghreb', 'mémoire', 'corps', 'héritage'],
    readingTime: 8,
    publishedAt: '2026-03-15',
    featured: false,
  },
  {
    id: '5',
    slug: 'son-image-convergence',
    title: 'Son et image : la convergence des arts au cœur du BSMK',
    excerpt: 'Quand le Studio A et la salle de projection se rencontrent, de nouvelles formes artistiques émergent. Retour sur trois projets hybrides nés de la collaboration entre musiciens et cinéastes.',
    body: `Trois projets, trois histoires de collision créative. C'est ce que nous avons souhaité documenter dans ce reportage interne, en suivant les résidents du BSMK qui travaillent à l'intersection de la musique et de l'image.

Le premier projet est né d'une résidence de deux semaines. Le musicien électronique Adel Mejri et la réalisatrice Sonia Gamha se sont rencontrés autour d'un thème commun : les mémoires sonores de Médina. L'un collectait des sons, l'autre filmait les textures visuelles. Le résultat : un film-concert de 45 minutes présenté en avant-première dans notre grande salle.

Le deuxième projet est plus intime. Une compositrice et un photographe ont exploré ensemble la représentation du deuil dans la culture tunisienne contemporaine. Leur œuvre, "Quarante jours", est une série de vingt photographies accompagnées d'une partition pour piano préparée.`,
    coverUrl: 'https://picsum.photos/seed/son-image/1200/600',
    authorName: 'Ines Chaabane',
    authorPhotoUrl: 'https://picsum.photos/seed/ines/100/100',
    category: 'Reportage',
    categorySlug: 'reportage',
    disciplineSlugs: ['musique-production', 'cinema-audiovisuel'],
    tags: ['son', 'image', 'collaboration', 'interdisciplinaire'],
    readingTime: 5,
    publishedAt: '2026-05-08',
    featured: true,
  },
  {
    id: '6',
    slug: 'vetrinart-presence-ligne',
    title: 'VetrinArt : construire sa présence en ligne sans perdre son identité artistique',
    excerpt: 'Comment présenter son travail en ligne sans se soumettre aux algorithmes ? VetrinArt propose une réponse : des portfolios pensés pour les artistes, par les artistes.',
    body: `La question est simple mais radicale : comment un artiste peut-il exister en ligne sans devenir un produit ? Les plateformes dominant aujourd'hui le marché de la visibilité — Instagram, Behance, LinkedIn — ont leurs propres logiques, leurs propres formats, leurs propres définitions du succès.

VetrinArt est né de la conviction que les artistes méritent mieux. Un espace qui ne dicte pas la fréquence des publications, qui n'impose pas de formats, qui ne monétise pas l'attention. Un espace qui aide à construire une présence professionnelle cohérente avec une démarche artistique.

En développement depuis deux ans, VetrinArt compte aujourd'hui plus de 150 artistes inscrits. Sa logique est simple : un profil, un portfolio, un réseau. Rien de plus. Rien de moins.`,
    coverUrl: 'https://picsum.photos/seed/vetrinart/1200/600',
    authorName: 'Sana Trabelsi',
    authorPhotoUrl: 'https://picsum.photos/seed/sana/100/100',
    category: 'Pratique',
    categorySlug: 'pratique',
    disciplineSlugs: ['arts-numeriques'],
    tags: ['VetrinArt', 'numérique', 'portfolio', 'présence en ligne'],
    readingTime: 4,
    publishedAt: '2026-04-20',
    featured: false,
  },
  {
    id: '7',
    slug: 'residence-immersion-createur',
    title: 'Résidence en scène : journal d\'une immersion créative',
    excerpt: 'Pendant trois semaines, nous avons suivi la résidence de la compagnie Espace Libre au BSMK. Un journal de bord au plus près du processus de création.',
    body: `Semaine 1. La compagnie arrive un dimanche matin, avec trois caisses de matériel et une question : comment raconter l'exil sans romantiser la souffrance ? C'est leur point de départ. Pendant trois semaines, ils vont chercher — dans le mouvement, dans le texte, dans la lumière — des réponses provisoires.

La salle de répétition théâtre du BSMK devient leur maison. Ils y passent dix heures par jour, parfois plus. Les premières journées sont désordonnées, comme toujours. On improvise, on jette, on recommence. Le metteur en scène, Mondher Slim, dit que le premier tiers d'une résidence sert à désapprendre.

Semaine 2. Le travail prend forme. Une structure dramaturgique émerge — non pas une narration linéaire, mais une série de tableaux qui se répondent. La danseuse de la compagnie commence à tisser ses improvisations avec le texte des deux comédiens.`,
    coverUrl: 'https://picsum.photos/seed/residence/1200/600',
    authorName: 'Ines Chaabane',
    authorPhotoUrl: 'https://picsum.photos/seed/ines/100/100',
    category: 'Reportage',
    categorySlug: 'reportage',
    disciplineSlugs: ['theatre-arts-vivants'],
    tags: ['résidence', 'processus créatif', 'théâtre', 'compagnie'],
    readingTime: 10,
    publishedAt: '2026-03-28',
    featured: false,
  },
  {
    id: '8',
    slug: 'art-numerique-patrimoine',
    title: 'L\'art numérique au service du patrimoine immatériel',
    excerpt: 'Des artistes numériques tunisiens utilisent la modélisation 3D, la réalité augmentée et l\'intelligence artificielle pour préserver et réinventer le patrimoine culturel.',
    body: `Comment préserver ce qui, par nature, est éphémère ? Les gestes artisanaux, les chants de cérémonie, les techniques de tissage qui se transmettaient de corps à corps pendant des générations — comment les documenter sans les figer, sans les muséifier ?

C'est la question que se posent plusieurs artistes numériques tunisiens, réunis au FabLab du BSMK dans le cadre d'un projet pilote de deux ans. Leur approche : utiliser les technologies numériques non pas comme des outils de reproduction, mais comme des outils d'interprétation.

La céramiste et programmeuse Rima Jebali a développé un algorithme qui génère des variations infinies à partir des motifs de la poterie de Sejnane. L'objet final n'est pas une copie : c'est une conversation entre le passé et le présent.`,
    coverUrl: 'https://picsum.photos/seed/numerique-patrimoine/1200/600',
    authorName: 'Sana Trabelsi',
    authorPhotoUrl: 'https://picsum.photos/seed/sana/100/100',
    category: 'Dossier',
    categorySlug: 'dossier',
    disciplineSlugs: ['arts-numeriques', 'artisanat-design'],
    tags: ['numérique', 'patrimoine', 'IA', 'artisanat', 'mémoire'],
    readingTime: 11,
    publishedAt: '2026-02-14',
    featured: false,
  },
]

export const categories = [
  { slug: 'reflexions', name: 'Réflexions' },
  { slug: 'portrait', name: 'Portrait' },
  { slug: 'reportage', name: 'Reportage' },
  { slug: 'essai', name: 'Essai' },
  { slug: 'pratique', name: 'Pratique' },
  { slug: 'dossier', name: 'Dossier' },
]

export function getArticleBySlug(slug: string) {
  return articles.find(a => a.slug === slug) ?? null
}

export function getArticlesByDiscipline(disciplineSlug: string) {
  return articles.filter(a => a.disciplineSlugs.includes(disciplineSlug))
}

export function getFeaturedArticles(count = 3) {
  return articles.filter(a => a.featured).slice(0, count)
}

export function getLatestArticles(count = 3) {
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count)
}
