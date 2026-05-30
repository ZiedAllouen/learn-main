import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectors: SectorsService) {}

  @Public()
  @Get()
  findAll() {
    return this.sectors.findAll();
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.sectors.findOne(slug);
  }

  @Roles('ADMIN', 'EDITOR')
  @Post()
  create(@Body() dto: CreateSectorDto): Promise<unknown> {
    return this.sectors.create(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateSectorDto) {
    return this.sectors.update(slug, dto);
  }

  @Roles('ADMIN')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.sectors.remove(slug);
  }
}
