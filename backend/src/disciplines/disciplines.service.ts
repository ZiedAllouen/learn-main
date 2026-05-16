import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DisciplinesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.discipline.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findOne(slug: string) {
    const discipline = await this.prisma.discipline.findUnique({ where: { slug } });
    if (!discipline) throw new NotFoundException('Discipline not found');
    return discipline;
  }
}
