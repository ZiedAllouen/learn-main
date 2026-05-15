import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Disciplines
  const disciplines = await Promise.all([
    'musique-production',
    'danse-performance',
    'arts-visuels',
    'theatre-arts-vivants',
    'cinema-audiovisuel',
    'arts-numeriques',
    'artisanat-design',
  ].map((slug, i) =>
    prisma.discipline.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' & ').replace('-', ' '),
        sortOrder: i,
      },
    }),
  ));

  // Audience types
  await Promise.all([
    { slug: 'jeunes', name: 'Jeunes (12-25 ans)' },
    { slug: 'adultes', name: 'Adultes' },
    { slug: 'professionnels', name: 'Professionnels' },
    { slug: 'tout-public', name: 'Tout public' },
  ].map(a =>
    prisma.audienceType.upsert({ where: { slug: a.slug }, update: {}, create: a }),
  ));

  // Program types
  await Promise.all([
    { slug: 'formation', name: 'Formation' },
    { slug: 'residency', name: 'Résidence artistique' },
    { slug: 'workshop', name: 'Atelier' },
    { slug: 'mentoring', name: 'Mentorat' },
  ].map(p =>
    prisma.programType.upsert({ where: { slug: p.slug }, update: {}, create: p }),
  ));

  // Admin user — passwordHash is bcrypt of "changeme", replace after first login
  await prisma.user.upsert({
    where: { email: 'admin@bsmk.tn' },
    update: {},
    create: {
      email: 'admin@bsmk.tn',
      passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO3G',
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'BSMK',
    },
  });

  // Site stats
  await Promise.all([
    { key: 'artists_count', value: '150' },
    { key: 'programs_count', value: '24' },
    { key: 'spaces_count', value: '10' },
    { key: 'events_per_year', value: '80' },
  ].map(s =>
    prisma.siteStat.upsert({ where: { key: s.key }, update: { value: s.value }, create: s }),
  ));

  console.log('✓ Seed complete');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
