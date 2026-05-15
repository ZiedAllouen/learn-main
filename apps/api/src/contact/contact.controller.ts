import { Body, Controller, Post, Req } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Public } from '../common/decorators/public.decorator';
import type { Request } from 'express';

interface MaybeAuthUser { id?: string }

@Public()
@Controller('contact')
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Post()
  submit(
    @Body() dto: CreateContactDto,
    @Req() req: Request & { user?: MaybeAuthUser },
  ) {
    const ip = req.headers['x-forwarded-for']?.toString() ?? req.socket.remoteAddress;
    return this.contact.submit(dto, req.user?.id, ip);
  }
}
