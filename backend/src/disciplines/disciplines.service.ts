import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateDisciplineDto } from './dto/create-discipline.dto';
import type { UpdateDisciplineDto } from './dto/update-discipline.dto';

@Injectable()
export class DisciplinesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.discipline.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { sector: { select: { id: true, slug: true, name: true, color: true } } },
    });
  }

  async findOne(slug: string) {
    const discipline = await this.prisma.discipline.findUnique({
      where: { slug },
      include: { sector: true },
    });
    if (!discipline) throw new NotFoundException('Discipline not found');
    return discipline;
  }

  create(dto: CreateDisciplineDto): Promise<unknown> {
    return this.prisma.discipline.create({ data: dto });
  }

  async update(slug: string, dto: UpdateDisciplineDto): Promise<unknown> {
    await this.findOne(slug);
    return this.prisma.discipline.update({ where: { slug }, data: dto });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.discipline.delete({ where: { slug } });
  }
}
