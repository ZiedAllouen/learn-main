import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ListEventsDto } from './dto/list-events.dto';
import type { PaginatedResult } from '@bsmk/types';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListEventsDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, discipline, eventType, status, from, to } = dto;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(status ? { status } : { status: 'PUBLISHED' as const }),
      ...(eventType && { eventType }),
      ...(discipline && { disciplines: { some: { discipline: { slug: discipline } } } }),
      ...((from || to) && {
        startDate: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { startDate: 'asc' },
        include: {
          disciplines: { include: { discipline: { select: { id: true, slug: true, name: true } } } },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: { disciplines: { include: { discipline: true } } },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }
}
