import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ListProgramsDto } from './dto/list-programs.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programs: ProgramsService) {}

  @Public()
  @Get()
  findAll(@Query() dto: ListProgramsDto) {
    return this.programs.findAll(dto);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<unknown> {
    return this.programs.findOne(slug);
  }

  @Roles('ADMIN', 'EDITOR')
  @Post()
  create(@Body() dto: CreateProgramDto): Promise<unknown> {
    return this.programs.create(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateProgramDto): Promise<unknown> {
    return this.programs.update(slug, dto);
  }

  @Roles('ADMIN')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.programs.remove(slug);
  }
}
