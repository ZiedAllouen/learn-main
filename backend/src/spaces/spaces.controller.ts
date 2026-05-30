import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spaces: SpacesService) {}

  @Public()
  @Get()
  findAll() {
    return this.spaces.findAll();
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.spaces.findOne(slug);
  }

  @Roles('ADMIN', 'EDITOR')
  @Post()
  create(@Body() dto: CreateSpaceDto) {
    return this.spaces.create(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateSpaceDto) {
    return this.spaces.update(slug, dto);
  }

  @Roles('ADMIN')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.spaces.remove(slug);
  }
}
