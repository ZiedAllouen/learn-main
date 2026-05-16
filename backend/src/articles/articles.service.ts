import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ListArticlesDto } from './dto/list-articles.dto';
import type { CreateArticleDto } from './dto/create-article.dto';
import type { UpdateArticleDto } from './dto/update-article.dto';
import type { PaginatedResult } from '@bsmk/types';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListArticlesDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, category, tag, discipline, status, featured } = dto;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(status ? { status } : { status: 'PUBLISHED' as const }),
      ...(featured !== undefined && { featured }),
      ...(category && { category: { slug: category } }),
      ...(tag && { tags: { some: { tag: { slug: tag } } } }),
      ...(discipline && { disciplines: { some: { discipline: { slug: discipline } } } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        include: {
          author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          category: { select: { id: true, slug: true, name: true } },
          tags: { include: { tag: { select: { id: true, slug: true, name: true } } } },
          disciplines: { include: { discipline: { select: { id: true, slug: true, name: true } } } },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(slug: string): Promise<unknown> {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        category: { select: { id: true, slug: true, name: true } },
        tags: { include: { tag: true } },
        disciplines: { include: { discipline: true } },
      },
    });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async create(dto: CreateArticleDto, authorId: string): Promise<unknown> {
    const { tagIds, disciplineIds, publishedAt, ...rest } = dto;
    return this.prisma.article.create({
      data: {
        ...rest,
        body: rest.body ?? {},
        authorId,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        tags: tagIds?.length
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
        disciplines: disciplineIds?.length
          ? { create: disciplineIds.map((disciplineId) => ({ disciplineId })) }
          : undefined,
      },
    });
  }

  async update(slug: string, dto: UpdateArticleDto): Promise<unknown> {
    const { tagIds, disciplineIds, publishedAt, ...rest } = dto;
    await this.findOne(slug);

    return this.prisma.article.update({
      where: { slug },
      data: {
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        ...(tagIds !== undefined && {
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId) => ({ tagId })),
          },
        }),
        ...(disciplineIds !== undefined && {
          disciplines: {
            deleteMany: {},
            create: disciplineIds.map((disciplineId) => ({ disciplineId })),
          },
        }),
      },
    });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.article.delete({ where: { slug } });
  }
}
