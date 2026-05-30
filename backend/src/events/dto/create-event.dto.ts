import { IsString, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import type { ContentStatus, EventType } from '@bsmk/types';

export class CreateEventDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['CONCERT', 'EXHIBITION', 'WORKSHOP', 'RESIDENCY', 'SCREENING', 'CONFERENCE', 'FESTIVAL', 'OTHER'] satisfies EventType[])
  eventType?: EventType;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  ticketUrl?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] satisfies ContentStatus[])
  status?: ContentStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disciplineIds?: string[];
}
