import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
