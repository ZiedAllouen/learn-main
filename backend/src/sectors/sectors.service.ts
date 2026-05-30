import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateSectorDto } from './dto/create-sector.dto';
import type { UpdateSectorDto } from './dto/update-sector.dto';

@Injectable()
export class SectorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.sector.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { disciplines: { select: { id: true, slug: true, name: true, color: true } } },
    });
  }

  async findOne(slug: string) {
    const sector = await this.prisma.sector.findUnique({
      where: { slug },
      include: { disciplines: { select: { id: true, slug: true, name: true, color: true } } },
    });
    if (!sector) throw new NotFoundException('Sector not found');
    return sector;
  }

  create(dto: CreateSectorDto): Promise<unknown> {
    return this.prisma.sector.create({ data: dto });
  }

  async update(slug: string, dto: UpdateSectorDto) {
    await this.findOne(slug);
    return this.prisma.sector.update({ where: { slug }, data: dto });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.sector.delete({ where: { slug } });
  }
}
