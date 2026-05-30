import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateSpaceDto } from './dto/create-space.dto';
import type { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.space.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      include: { disciplines: { include: { discipline: { select: { id: true, slug: true, name: true } } } } },
    });
  }

  async findOne(slug: string) {
    const space = await this.prisma.space.findUnique({
      where: { slug },
      include: { disciplines: { include: { discipline: true } } },
    });
    if (!space) throw new NotFoundException('Space not found');
    return space;
  }

  async create(dto: CreateSpaceDto) {
    const { disciplineIds, ...rest } = dto;
    return this.prisma.space.create({
      data: {
        ...rest,
        disciplines: disciplineIds?.length
          ? { create: disciplineIds.map(disciplineId => ({ disciplineId })) }
          : undefined,
      },
    });
  }

  async update(slug: string, dto: UpdateSpaceDto) {
    await this.findOne(slug);
    const { disciplineIds, ...rest } = dto;
    return this.prisma.space.update({
      where: { slug },
      data: {
        ...rest,
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
    await this.prisma.space.delete({ where: { slug } });
  }
}
