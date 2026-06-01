import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@bsmk/db';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateRequestDto } from './dto/create-request.dto';
import type { ListRequestsDto } from './dto/list-requests.dto';
import type { UpdateRequestDto } from './dto/update-request.dto';
import type { PaginatedResult } from '@bsmk/types';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRequestDto, userId?: string) {
    const created = await this.prisma.request.create({
      data: { ...dto, userId } as Prisma.RequestUncheckedCreateInput,
    });
    return { id: created.id, message: 'Request received' };
  }

  async findAll(dto: ListRequestsDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, type, status } = dto;
    const skip = (page - 1) * pageSize;
    const where = {
      ...(type && { type }),
      ...(status && { status }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.request.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          program: { select: { id: true, slug: true, title: true } },
          space: { select: { id: true, slug: true, name: true } },
        },
      }),
      this.prisma.request.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: { program: true, space: true },
    });
    if (!request) throw new NotFoundException('Request not found');
    return request;
  }

  async update(id: string, dto: UpdateRequestDto) {
    const existing = await this.prisma.request.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Request not found');
    return this.prisma.request.update({ where: { id }, data: { ...dto } });
  }
}
