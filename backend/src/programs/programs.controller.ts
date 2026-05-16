import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ListProgramsDto } from './dto/list-programs.dto';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programs: ProgramsService) {}

  @Get()
  findAll(@Query() dto: ListProgramsDto) {
    return this.programs.findAll(dto);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<unknown> {
    return this.programs.findOne(slug);
  }
}
