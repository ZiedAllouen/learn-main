import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ListEventsDto } from './dto/list-events.dto';
import type { CreateEventDto } from './dto/create-event.dto';
import type { UpdateEventDto } from './dto/update-event.dto';
import type { PaginatedResult } from '@bsmk/types';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListEventsDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, discipline, eventType, status, from, to } = dto;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(status === 'ALL' ? {} : status ? { status } : { status: 'PUBLISHED' as const }),
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

  async create(dto: CreateEventDto) {
    const { disciplineIds, startDate, endDate, ...rest } = dto;
    return this.prisma.event.create({
      data: {
        ...rest,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        disciplines: disciplineIds?.length
          ? { create: disciplineIds.map(disciplineId => ({ disciplineId })) }
          : undefined,
      },
    });
  }

  async update(slug: string, dto: UpdateEventDto) {
    await this.findOne(slug);
    const { disciplineIds, startDate, endDate, ...rest } = dto;
    return this.prisma.event.update({
      where: { slug },
      data: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        ...(disciplineIds !== undefined && {
          disciplines: {
            deleteMany: {},
            create: disciplineIds.map(disciplineId => ({ disciplineId })),
          },
        }),
      },
    });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.event.delete({ where: { slug } });
  }
}
