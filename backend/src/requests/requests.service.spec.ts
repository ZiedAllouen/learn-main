import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RequestsService', () => {
  let service: RequestsService;
  let prisma: {
    request: {
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      request: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [RequestsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(RequestsService);
  });

  it('creates a request with NEW status and a confirmation payload', async () => {
    prisma.request.create.mockResolvedValue({ id: 'r1' });
    const result = await service.create(
      { type: 'BOOKING', name: 'Amel', email: 'a@b.tn', spaceId: 's1' },
      'user1',
    );
    expect(prisma.request.create).toHaveBeenCalledWith({
      data: { type: 'BOOKING', name: 'Amel', email: 'a@b.tn', spaceId: 's1', userId: 'user1' },
    });
    expect(result).toEqual({ id: 'r1', message: 'Request received' });
  });

  it('lists requests paginated with optional filters', async () => {
    prisma.$transaction.mockResolvedValue([[{ id: 'r1' }], 1]);
    const result = await service.findAll({ page: 1, pageSize: 20, type: 'BOOKING' });
    expect(result).toEqual({ data: [{ id: 'r1' }], total: 1, page: 1, pageSize: 20, totalPages: 1 });
  });

  it('throws NotFound when updating a missing request', async () => {
    prisma.request.findUnique.mockResolvedValue(null);
    await expect(service.update('missing', { status: 'ACCEPTED' }))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates status and adminNote of an existing request', async () => {
    prisma.request.findUnique.mockResolvedValue({ id: 'r1' });
    prisma.request.update.mockResolvedValue({ id: 'r1', status: 'ACCEPTED' });
    const result = await service.update('r1', { status: 'ACCEPTED', adminNote: 'ok' });
    expect(prisma.request.update).toHaveBeenCalledWith({
      where: { id: 'r1' },
      data: { status: 'ACCEPTED', adminNote: 'ok' },
    });
    expect(result).toEqual({ id: 'r1', status: 'ACCEPTED' });
  });
});
