import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ListArtistsDto } from './dto/list-artists.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

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

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.artists.findOne(slug);
  }

  @Roles('ADMIN', 'EDITOR', 'ARTIST')
  @Post()
  create(@Body() dto: CreateArtistDto): Promise<unknown> {
    return this.artists.create(dto);
  }

  @Roles('ADMIN', 'EDITOR', 'ARTIST')
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
