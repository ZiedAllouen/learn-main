import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ListRequestsDto } from './dto/list-requests.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { Request as ExpressRequest } from 'express';

interface MaybeAuthUser { id?: string }

@Controller('requests')
export class RequestsController {
  constructor(private readonly requests: RequestsService) {}

  @Public()
  @Post()
  create(
    @Body() dto: CreateRequestDto,
    @Req() req: ExpressRequest & { user?: MaybeAuthUser },
  ) {
    return this.requests.create(dto, req.user?.id);
  }

  @Roles('ADMIN', 'EDITOR')
  @Get()
  findAll(@Query() dto: ListRequestsDto) {
    return this.requests.findAll(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requests.findOne(id);
  }

  @Roles('ADMIN', 'EDITOR')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRequestDto) {
    return this.requests.update(id, dto);
  }
}
