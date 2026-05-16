import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { ListEventsDto } from './dto/list-events.dto';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get()
  findAll(@Query() dto: ListEventsDto) {
    return this.events.findAll(dto);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.events.findOne(slug);
  }
}
