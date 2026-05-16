import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ListProgramsDto } from './dto/list-programs.dto';
import type { PaginatedResult } from '@bsmk/types';

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListProgramsDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, discipline, audience, modality, status, featured } = dto;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(status ? { status } : { status: 'PUBLISHED' as const }),
      ...(featured !== undefined && { featured }),
      ...(modality && { modality }),
      ...(discipline && { disciplines: { some: { discipline: { slug: discipline } } } }),
      ...(audience && { audiences: { some: { audienceType: { slug: audience } } } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.program.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        include: {
          programType: { select: { id: true, slug: true, name: true } },
          disciplines: { include: { discipline: { select: { id: true, slug: true, name: true } } } },
          audiences: { include: { audienceType: { select: { id: true, slug: true, name: true } } } },
        },
      }),
      this.prisma.program.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(slug: string): Promise<unknown> {
    const program = await this.prisma.program.findUnique({
      where: { slug },
      include: {
        programType: true,
        disciplines: { include: { discipline: true } },
        audiences: { include: { audienceType: true } },
      },
    });
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }
}
