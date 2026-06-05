import { Test } from '@nestjs/testing';
import { ArtistsService } from './artists.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ArtistsService', () => {
  let service: ArtistsService;
  let prisma: {
    artist: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      artist: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [ArtistsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(ArtistsService);
  });

  describe('findMine', () => {
    it('returns the artist owned by the user, with disciplines + works', async () => {
      prisma.artist.findUnique.mockResolvedValue({ id: 'a1', userId: 'u1' });
      const result = await service.findMine('u1');
      expect(prisma.artist.findUnique).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        include: {
          disciplines: { include: { discipline: true } },
          works: { orderBy: { sortOrder: 'asc' } },
        },
      });
      expect(result).toEqual({ id: 'a1', userId: 'u1' });
    });

    it('returns null when the user has no artist profile', async () => {
      prisma.artist.findUnique.mockResolvedValue(null);
      const result = await service.findMine('u1');
      expect(result).toBeNull();
    });
  });

  describe('findAllAdmin', () => {
    it('lists all statuses (no PUBLISHED filter) paginated', async () => {
      prisma.$transaction.mockResolvedValue([[{ id: 'a1' }], 1]);
      const result = await service.findAllAdmin({ page: 1, pageSize: 100 } as never);
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual({ data: [{ id: 'a1' }], total: 1, page: 1, pageSize: 100, totalPages: 1 });
    });
  });

  describe('upsertMine', () => {
    it('creates a DRAFT artist bound to userId with a generated unique slug when none exists', async () => {
      prisma.artist.findUnique
        .mockResolvedValueOnce(null) // findUnique({ where: { userId } }) -> no existing
        .mockResolvedValueOnce(null); // slug 'amel-ben' is free
      prisma.artist.create.mockResolvedValue({ id: 'a1', slug: 'amel-ben', status: 'DRAFT' });

      const result = await service.upsertMine('u1', {
        name: 'Amel Ben',
        bio: 'hi',
        disciplineIds: ['d1'],
        works: [{ title: 'W1' }],
      } as never);

      expect(prisma.artist.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Amel Ben',
          bio: 'hi',
          slug: 'amel-ben',
          status: 'DRAFT',
          userId: 'u1',
          disciplines: { create: [{ disciplineId: 'd1' }] },
          works: { create: [{ title: 'W1' }] },
        }),
        include: expect.any(Object),
      });
      expect(result).toEqual({ id: 'a1', slug: 'amel-ben', status: 'DRAFT' });
    });

    it('dedupes the slug when the generated one is taken', async () => {
      prisma.artist.findUnique
        .mockResolvedValueOnce(null) // no existing artist for user
        .mockResolvedValueOnce({ id: 'x' }) // 'amel-ben' taken
        .mockResolvedValueOnce(null); // 'amel-ben-2' free
      prisma.artist.create.mockResolvedValue({ id: 'a1', slug: 'amel-ben-2' });

      await service.upsertMine('u1', { name: 'Amel Ben' } as never);

      expect(prisma.artist.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ slug: 'amel-ben-2' }) }),
      );
    });

    it('updates the existing owned artist and ignores body slug/status/featured', async () => {
      prisma.artist.findUnique.mockResolvedValue({ id: 'a1', slug: 'amel-ben', userId: 'u1' });
      prisma.artist.update.mockResolvedValue({ id: 'a1', slug: 'amel-ben' });

      await service.upsertMine('u1', {
        name: 'Amel B.',
        slug: 'hacked',
        status: 'PUBLISHED',
        featured: true,
        disciplineIds: ['d2'],
      } as never);

      const call = prisma.artist.update.mock.calls[0][0];
      expect(call.where).toEqual({ id: 'a1' });
      expect(call.data.name).toBe('Amel B.');
      expect(call.data.slug).toBeUndefined();
      expect(call.data.status).toBeUndefined();
      expect(call.data.featured).toBeUndefined();
      expect(call.data.disciplines).toEqual({ deleteMany: {}, create: [{ disciplineId: 'd2' }] });
    });
  });
});
