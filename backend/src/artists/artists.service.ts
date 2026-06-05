import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ListArtistsDto } from './dto/list-artists.dto';
import type { CreateArtistDto } from './dto/create-artist.dto';
import type { UpdateArtistDto } from './dto/update-artist.dto';
import type { UpsertOwnArtistDto } from './dto/upsert-own-artist.dto';
import type { PaginatedResult } from '@bsmk/types';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListArtistsDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, discipline, sector, city, status, featured } = dto;
    const skip = (page - 1) * pageSize;

    const disciplineWhere =
      discipline
        ? { some: { discipline: { slug: discipline } } }
        : sector
        ? { some: { discipline: { sector: { slug: sector } } } }
        : undefined;

    const where = {
      ...(status ? { status } : { status: 'PUBLISHED' as const }),
      ...(featured !== undefined && { featured }),
      ...(city && { city }),
      ...(disciplineWhere && { disciplines: disciplineWhere }),
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

  findMine(userId: string) {
    return this.prisma.artist.findUnique({
      where: { userId },
      include: {
        disciplines: { include: { discipline: true } },
        works: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async findAllAdmin(dto: ListArtistsDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, discipline, sector, city, status, featured } = dto;
    const skip = (page - 1) * pageSize;

    const disciplineWhere = discipline
      ? { some: { discipline: { slug: discipline } } }
      : sector
      ? { some: { discipline: { sector: { slug: sector } } } }
      : undefined;

    // No default PUBLISHED filter -> drafts included. `status` (if present) is
    // DRAFT/PUBLISHED/ARCHIVED; omitting it lists every status.
    const where = {
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(city && { city }),
      ...(disciplineWhere && { disciplines: disciplineWhere }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.artist.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ status: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
        include: {
          disciplines: { include: { discipline: { select: { id: true, slug: true, name: true, color: true } } } },
          works: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      this.prisma.artist.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  private slugify(name: string): string {
    return (
      name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // strip accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'artiste'
    );
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = this.slugify(name);
    let candidate = base;
    let n = 2;
    while (await this.prisma.artist.findUnique({ where: { slug: candidate } })) {
      candidate = `${base}-${n}`;
      n += 1;
    }
    return candidate;
  }

  async upsertMine(userId: string, dto: UpsertOwnArtistDto): Promise<unknown> {
    const { disciplineIds, works, ...rest } = dto as Record<string, unknown> & UpsertOwnArtistDto;
    // Discard any server-controlled fields a caller might have injected.
    delete (rest as Record<string, unknown>).slug;
    delete (rest as Record<string, unknown>).status;
    delete (rest as Record<string, unknown>).featured;
    delete (rest as Record<string, unknown>).userId;

    const existing = await this.prisma.artist.findUnique({ where: { userId } });
    const include = {
      disciplines: { include: { discipline: true } },
      works: { orderBy: { sortOrder: 'asc' as const } },
    };

    if (!existing) {
      const slug = await this.generateUniqueSlug(String(rest.name));
      return this.prisma.artist.create({
        data: {
          ...rest,
          slug,
          status: 'DRAFT',
          userId,
          disciplines: disciplineIds?.length
            ? { create: disciplineIds.map((disciplineId) => ({ disciplineId })) }
            : undefined,
          works: works?.length ? { create: works } : undefined,
        } as never,
        include,
      });
    }

    return this.prisma.artist.update({
      where: { id: existing.id },
      data: {
        ...rest,
        ...(disciplineIds !== undefined && {
          disciplines: { deleteMany: {}, create: disciplineIds.map((disciplineId) => ({ disciplineId })) },
        }),
        ...(works !== undefined && { works: { deleteMany: {}, create: works } }),
      } as never,
      include,
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

  async update(slug: string, dto: UpdateArtistDto): Promise<unknown> {
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
