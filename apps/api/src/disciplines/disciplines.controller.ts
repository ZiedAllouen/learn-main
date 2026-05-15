import { Controller, Get, Param } from '@nestjs/common';
import { DisciplinesService } from './disciplines.service';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller('disciplines')
export class DisciplinesController {
  constructor(private readonly disciplines: DisciplinesService) {}

  @Get()
  findAll() {
    return this.disciplines.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.disciplines.findOne(slug);
  }
}
