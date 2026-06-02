import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ListArticlesDto } from './dto/list-articles.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { Request } from 'express';

interface AuthUser { id: string; role: string }

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articles: ArticlesService) {}

  @Public()
  @Get()
  findAll(@Query() dto: ListArticlesDto) {
    return this.articles.findAll(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Get('admin/all')
  findAllAdmin(@Query() dto: ListArticlesDto) {
    return this.articles.findAllAdmin(dto);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<unknown> {
    return this.articles.findOne(slug);
  }

  @Roles('ADMIN', 'EDITOR')
  @Post()
  create(@Body() dto: CreateArticleDto, @Req() req: Request & { user: AuthUser }): Promise<unknown> {
    return this.articles.create(dto, req.user.id);
  }

  @Roles('ADMIN', 'EDITOR')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateArticleDto): Promise<unknown> {
    return this.articles.update(slug, dto);
  }

  @Roles('ADMIN')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.articles.remove(slug);
  }
}
