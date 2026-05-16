import { Controller, Get, Param } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spaces: SpacesService) {}

  @Get()
  findAll() {
    return this.spaces.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.spaces.findOne(slug);
  }
}
