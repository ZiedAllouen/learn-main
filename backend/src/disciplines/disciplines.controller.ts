import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DisciplinesService } from './disciplines.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('disciplines')
export class DisciplinesController {
  constructor(private readonly disciplines: DisciplinesService) {}

  @Public()
  @Get()
  findAll() {
    return this.disciplines.findAll();
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.disciplines.findOne(slug);
  }

  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateDisciplineDto): Promise<unknown> {
    return this.disciplines.create(dto);
  }

  @Roles('ADMIN')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateDisciplineDto) {
    return this.disciplines.update(slug, dto);
  }

  @Roles('ADMIN')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.disciplines.remove(slug);
  }
}
