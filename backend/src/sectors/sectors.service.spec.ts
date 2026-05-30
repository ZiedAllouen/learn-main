import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SectorsService', () => {
  let service: SectorsService;
  let prisma: { sector: { findMany: jest.Mock; findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = { sector: { findMany: jest.fn(), findUnique: jest.fn() } };
    const moduleRef = await Test.createTestingModule({
      providers: [SectorsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(SectorsService);
  });

  it('returns all sectors ordered by sortOrder', async () => {
    prisma.sector.findMany.mockResolvedValue([{ slug: 'a' }]);
    const result = await service.findAll();
    expect(result).toEqual([{ slug: 'a' }]);
    expect(prisma.sector.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { sortOrder: 'asc' } }),
    );
  });

  it('throws NotFound for missing slug', async () => {
    prisma.sector.findUnique.mockResolvedValue(null);
    await expect(service.findOne('nope')).rejects.toBeInstanceOf(NotFoundException);
  });
});
