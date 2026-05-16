import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(dto: CreateContactDto, userId?: string, ipAddress?: string) {
    await this.prisma.contactMessage.create({
      data: { ...dto, userId, ipAddress },
    });
    return { message: 'Message received' };
  }
}
