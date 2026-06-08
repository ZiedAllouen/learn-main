import 'dotenv/config';
import { PrismaClient } from '../generated/client';
import * as argon2 from 'argon2';
import { programs, events, spaces, articles } from './seed-data';

const prisma = new PrismaClient();

const SECTORS = [
  { slug: 'arts-de-scene', name: 'Arts de scène', color: '#2D5F99' },
  { slug: 'evenements-expositions-festivals', name: 'Événements, expositions & festivals', color: '#C0392B' },
  { slug: 'medias', name: 'Médias', color: '#7A2E73' },
  { slug: 'sports-loisirs-alternatifs', name: 'Sports & loisirs alternatifs', color: '#5C8A3A' },
  { slug: 'consulting-accompagnement', name: 'Consulting & accompagnement artistiques', color: '#147070' },
  { slug: 'partenaires-communautes', name: 'Partenaires & communautés', color: '#C99A2E' },
  { slug: 'showroom-recyclage', name: 'Showroom et recyclage', color: '#8A8F7A' },
];

const DISCIPLINES = [
  { slug: 'musique-production', name: 'Musique & Production', color: '#D8C3A5', sector: 'arts-de-scene' },
  { slug: 'danse-mouvement', name: 'Danse & Mouvement', color: '#E0D2BE', sector: 'arts-de-scene' },
  { slug: 'theatre-arts-vivants', name: 'Théâtre & Arts vivants', color: '#CDBBA0', sector: 'arts-de-scene' },
  { slug: 'arts-visuels', name: 'Street Art & Arts Visuels', color: '#C9C2B0', sector: 'evenements-expositions-festivals' },
  { slug: 'cinema-audiovisuel', name: 'Cinéma & Audiovisuel', color: '#BFB39A', sector: 'medias' },
  { slug: 'medias', name: 'Médias', color: '#B7AE9C', sector: 'medias' },
  { slug: 'arts-numeriques-gaming', name: 'Arts Numériques & Gaming', color: '#C7BEAA', sector: 'medias' },
  { slug: 'mode-design', name: 'Mode & Design', color: '#D2C0A8', sector: 'showroom-recyclage' },
  { slug: 'sport-culture-urbaine', name: 'Sport & Culture Urbaine', color: '#C6CBB6', sector: 'sports-loisirs-alternatifs' },
];

async function main() {
  // Sectors
  for (const [i, s] of SECTORS.entries()) {
    await prisma.sector.upsert({
      where: { slug: s.slug },
      update: { name: s.name, color: s.color, sortOrder: i },
      create: { ...s, sortOrder: i },
    });
  }

  // Disciplines (linked to sectors)
  for (const [i, d] of DISCIPLINES.entries()) {
    const sector = await prisma.sector.findUnique({ where: { slug: d.sector } });
    await prisma.discipline.upsert({
      where: { slug: d.slug },
      update: { name: d.name, color: d.color, sectorId: sector?.id, sortOrder: i },
      create: { slug: d.slug, name: d.name, color: d.color, sectorId: sector?.id, sortOrder: i },
    });
  }

  // Audience types
  for (const a of [
    { slug: 'jeunes', name: 'Jeunes (12-25 ans)' },
    { slug: 'adultes', name: 'Adultes' },
    { slug: 'professionnels', name: 'Professionnels' },
    { slug: 'tout-public', name: 'Tout public' },
  ]) {
    await prisma.audienceType.upsert({ where: { slug: a.slug }, update: {}, create: a });
  }

  // Program types
  for (const p of [
    { slug: 'formation', name: 'Formation' },
    { slug: 'residency', name: 'Résidence artistique' },
    { slug: 'workshop', name: 'Atelier' },
    { slug: 'mentoring', name: 'Mentorat' },
  ]) {
    await prisma.programType.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  // Admin user — argon2 hash of "bsmkadmintn1998!". CHANGE THIS PASSWORD AFTER FIRST LOGIN.
  const passwordHash = await argon2.hash('bsmkadmintn1998!');
  await prisma.user.upsert({
    where: { email: 'admin@bsmk.tn' },
    update: { passwordHash },
    create: {
      email: 'admin@bsmk.tn',
      passwordHash,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'BSMK',
    },
  });

  // Editor + artist test users (same changeme123 password). CHANGE THESE.
  await prisma.user.upsert({
    where: { email: 'editor@bsmk.tn' },
    update: { passwordHash },
    create: {
      email: 'editor@bsmk.tn',
      passwordHash,
      role: 'EDITOR',
      firstName: 'Éditeur',
      lastName: 'BSMK',
    },
  });

  await prisma.user.upsert({
    where: { email: 'artist@bsmk.tn' },
    update: { passwordHash },
    create: {
      email: 'artist@bsmk.tn',
      passwordHash,
      role: 'ARTIST',
      firstName: 'Artiste',
      lastName: 'Test',
    },
  });

  // Sample artists (Vitrinart) — linked to disciplines, with works + geo
  const artVisuels = await prisma.discipline.findUnique({ where: { slug: 'arts-visuels' } });
  const modeDesign = await prisma.discipline.findUnique({ where: { slug: 'mode-design' } });

  const sampleArtists = [
    {
      slug: 'amira-ben-salah', name: 'Amira Ben Salah', city: 'Tunis',
      bio: 'Artiste muraliste tunisoise.', status: 'PUBLISHED' as const, featured: true,
      latitude: 36.8065, longitude: 10.1815, disciplineId: artVisuels?.id,
      works: [{ title: 'Fresque Medina', type: 'mural', year: 2024 }],
    },
    {
      slug: 'karim-designer', name: 'Karim Designer', city: 'Sfax',
      bio: 'Designer objet et mobilier.', status: 'PUBLISHED' as const, featured: false,
      latitude: 34.7406, longitude: 10.7603, disciplineId: modeDesign?.id,
      works: [{ title: 'Collection Sahel', type: 'produit', year: 2025 }],
    },
  ];

  for (const [i, a] of sampleArtists.entries()) {
    const { disciplineId, works, ...rest } = a;
    await prisma.artist.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        ...rest,
        sortOrder: i,
        disciplines: disciplineId ? { create: [{ disciplineId }] } : undefined,
        works: { create: works },
      },
    });
  }

  // Sample media
  const sampleMedia = [
    { slug: 'video-presentation-bsmk', title: 'Présentation BSMK', type: 'VIDEO' as const, status: 'PUBLISHED' as const, featured: true, url: 'https://example.com/video', disciplineSlug: 'medias' },
    { slug: 'galerie-vernissage-2025', title: 'Vernissage 2025', type: 'PHOTO' as const, status: 'PUBLISHED' as const, featured: false, disciplineSlug: 'arts-visuels' },
  ];

  for (const m of sampleMedia) {
    const { disciplineSlug, ...rest } = m;
    const disc = await prisma.discipline.findUnique({ where: { slug: disciplineSlug } });
    await prisma.media.upsert({
      where: { slug: m.slug },
      update: {},
      create: {
        ...rest,
        publishedAt: new Date('2025-01-01'),
        disciplines: disc ? { create: [{ disciplineId: disc.id }] } : undefined,
      },
    });
  }

  // Site stats
  for (const s of [
    { key: 'artists_count', value: '150' },
    { key: 'programs_count', value: '24' },
    { key: 'spaces_count', value: '10' },
    { key: 'events_per_year', value: '80' },
  ]) {
    await prisma.siteStat.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  // ── Lookup maps for content relations ─────────────────────────────────────
  const allDisciplines = await prisma.discipline.findMany({ select: { id: true, slug: true } });
  const disciplineIdBySlug = new Map(allDisciplines.map((d) => [d.slug, d.id]));

  const allAudiences = await prisma.audienceType.findMany({ select: { id: true, slug: true } });
  const audienceIdBySlug = new Map(allAudiences.map((a) => [a.slug, a.id]));

  const allProgramTypes = await prisma.programType.findMany({ select: { id: true, slug: true } });
  const programTypeIdBySlug = new Map(allProgramTypes.map((p) => [p.slug, p.id]));

  // Resolve discipline slugs → discipline-link create rows, skipping unknown slugs.
  const disciplineLinks = (slugs: string[]) =>
    slugs
      .map((slug) => disciplineIdBySlug.get(slug))
      .filter((id): id is string => Boolean(id))
      .map((disciplineId) => ({ disciplineId }));

  // Programs
  for (const p of programs) {
    const audienceLinks = p.audienceSlugs
      .map((slug) => audienceIdBySlug.get(slug))
      .filter((id): id is string => Boolean(id))
      .map((audienceTypeId) => ({ audienceTypeId }));

    await prisma.program.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        body: { html: p.longDescription },
        coverUrl: p.coverUrl,
        modality: p.modality,
        duration: p.duration,
        priceIndicative: p.priceIndicative,
        featured: p.featured,
        status: 'PUBLISHED',
        programTypeId: programTypeIdBySlug.get(p.programTypeSlug) ?? null,
        disciplines: { create: disciplineLinks(p.disciplineSlugs) },
        audiences: { create: audienceLinks },
      },
    });
  }

  // Events
  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        slug: e.slug,
        title: e.title,
        description: e.description,
        eventType: e.eventType,
        startDate: new Date(e.startDate),
        endDate: e.endDate ? new Date(e.endDate) : null,
        location: e.location,
        coverUrl: e.coverUrl,
        ticketUrl: e.ticketUrl ?? null,
        status: 'PUBLISHED',
        disciplines: { create: disciplineLinks(e.disciplineSlugs) },
      },
    });
  }

  // Spaces
  for (const [i, s] of spaces.entries()) {
    await prisma.space.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        name: s.name,
        description: s.description,
        floor: s.floor,
        surfaceSqm: s.surfaceSqm,
        capacity: s.capacity,
        equipment: s.equipment,
        imageUrls: s.imageUrls,
        status: 'PUBLISHED',
        sortOrder: i,
        disciplines: { create: disciplineLinks(s.disciplineSlugs) },
      },
    });
  }

  // Articles (require an author + optional category)
  const admin = await prisma.user.findUnique({ where: { email: 'admin@bsmk.tn' } });
  if (!admin) throw new Error('Admin user not found — cannot seed articles');

  for (const a of articles) {
    const category = await prisma.category.upsert({
      where: { slug: a.categorySlug },
      update: {},
      create: { slug: a.categorySlug, name: a.categoryName },
    });

    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        body: { html: a.body },
        coverUrl: a.coverUrl,
        authorId: admin.id,
        categoryId: category.id,
        status: 'PUBLISHED',
        featured: a.featured,
        readingTime: a.readingTime,
        publishedAt: new Date(a.publishedAt),
        disciplines: { create: disciplineLinks(a.disciplineSlugs) },
      },
    });
  }

  console.log('✓ Seed complete — admin@bsmk.tn / changeme123 (CHANGE THIS)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
