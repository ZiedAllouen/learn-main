import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ListArtistsDto } from './dto/list-artists.dto';
import type { CreateArtistDto } from './dto/create-artist.dto';
import type { UpdateArtistDto } from './dto/update-artist.dto';
import type { PaginatedResult } from '@bsmk/types';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListArtistsDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, discipline, sector, city, status, featured } = dto;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(status ? { status } : { status: 'PUBLISHED' as const }),
      ...(featured !== undefined && { featured }),
      ...(city && { city }),
      ...(discipline && { disciplines: { some: { discipline: { slug: discipline } } } }),
      ...(sector && { disciplines: { some: { discipline: { sector: { slug: sector } } } } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.artist.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { name: 'asc' }],
        include: {
          disciplines: { include: { discipline: { select: { id: true, slug: true, name: true, color: true } } } },
          works: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      this.prisma.artist.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(slug: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { slug },
      include: {
        disciplines: { include: { discipline: true } },
        works: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  findMap() {
    return this.prisma.artist.findMany({
      where: { status: 'PUBLISHED', latitude: { not: null }, longitude: { not: null } },
      select: {
        id: true, slug: true, name: true, city: true, address: true,
        latitude: true, longitude: true, photoUrl: true,
      },
    });
  }

  create(dto: CreateArtistDto): Promise<unknown> {
    const { disciplineIds, works, ...rest } = dto;
    return this.prisma.artist.create({
      data: {
        ...rest,
        disciplines: disciplineIds?.length
          ? { create: disciplineIds.map((disciplineId) => ({ disciplineId })) }
          : undefined,
        works: works?.length ? { create: works } : undefined,
      },
    });
  }

  async update(slug: string, dto: UpdateArtistDto) {
    const { disciplineIds, works, ...rest } = dto;
    await this.findOne(slug);
    return this.prisma.artist.update({
      where: { slug },
      data: {
        ...rest,
        ...(disciplineIds !== undefined && {
          disciplines: { deleteMany: {}, create: disciplineIds.map((disciplineId) => ({ disciplineId })) },
        }),
        ...(works !== undefined && {
          works: { deleteMany: {}, create: works },
        }),
      },
    });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.artist.delete({ where: { slug } });
  }
}
