import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MediaService } from './media.service';
import { ListMediaDto } from './dto/list-media.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Public()
  @Get()
  findAll(@Query() dto: ListMediaDto) {
    return this.media.findAll(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Get('admin/all')
  findAllAdmin(@Query() dto: ListMediaDto) {
    return this.media.findAllAdmin(dto);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.media.findOne(slug);
  }

  @Roles('ADMIN', 'EDITOR')
  @Post()
  create(@Body() dto: CreateMediaDto): Promise<unknown> {
    return this.media.create(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateMediaDto) {
    return this.media.update(slug, dto);
  }

  @Roles('ADMIN')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.media.remove(slug);
  }
}
