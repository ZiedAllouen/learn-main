import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ListMediaDto } from './dto/list-media.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import type { UpdateMediaDto } from './dto/update-media.dto';
import type { PaginatedResult } from '@bsmk/types';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListMediaDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, type, discipline, status, featured } = dto;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(status ? { status } : { status: 'PUBLISHED' as const }),
      ...(featured !== undefined && { featured }),
      ...(type && { type }),
      ...(discipline && { disciplines: { some: { discipline: { slug: discipline } } } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.media.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        include: {
          disciplines: { include: { discipline: { select: { id: true, slug: true, name: true, color: true } } } },
        },
      }),
      this.prisma.media.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(slug: string) {
    const media = await this.prisma.media.findUnique({
      where: { slug },
      include: { disciplines: { include: { discipline: true } } },
    });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  create(dto: CreateMediaDto): Promise<unknown> {
    const { disciplineIds, publishedAt, ...rest } = dto;
    return this.prisma.media.create({
      data: {
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        disciplines: disciplineIds?.length
          ? { create: disciplineIds.map((disciplineId) => ({ disciplineId })) }
          : undefined,
      },
    });
  }

  async update(slug: string, dto: UpdateMediaDto) {
    const { disciplineIds, publishedAt, ...rest } = dto;
    await this.findOne(slug);
    return this.prisma.media.update({
      where: { slug },
      data: {
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        ...(disciplineIds !== undefined && {
          disciplines: { deleteMany: {}, create: disciplineIds.map((disciplineId: string) => ({ disciplineId })) },
        }),
      },
    });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.media.delete({ where: { slug } });
  }
}
