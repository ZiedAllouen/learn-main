import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ArtistsService } from './artists.service';
import { ListArtistsDto } from './dto/list-artists.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UpsertOwnArtistDto } from './dto/upsert-own-artist.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artists: ArtistsService) {}

  @Public()
  @Get()
  findAll(@Query() dto: ListArtistsDto) {
    return this.artists.findAll(dto);
  }

  @Public()
  @Get('map')
  findMap() {
    return this.artists.findMap();
  }

  @Roles('ADMIN', 'EDITOR')
  @Get('admin/all')
  findAllAdmin(@Query() dto: ListArtistsDto) {
    return this.artists.findAllAdmin(dto);
  }

  @Roles('ADMIN', 'EDITOR', 'ARTIST')
  @Get('me')
  findMine(@Req() req: Request & { user: AuthUser }) {
    return this.artists.findMine(req.user.id);
  }

  @Roles('ADMIN', 'EDITOR', 'ARTIST')
  @Put('me')
  upsertMine(@Req() req: Request & { user: AuthUser }, @Body() dto: UpsertOwnArtistDto): Promise<unknown> {
    return this.artists.upsertMine(req.user.id, dto);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.artists.findOne(slug);
  }

  @Roles('ADMIN', 'EDITOR')
  @Post()
  create(@Body() dto: CreateArtistDto): Promise<unknown> {
    return this.artists.create(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateArtistDto) {
    return this.artists.update(slug, dto);
  }

  @Roles('ADMIN')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.artists.remove(slug);
  }
}
