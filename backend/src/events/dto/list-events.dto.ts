import { IsOptional, IsString, IsInt, Min, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import type { ContentStatus, EventType } from '@bsmk/types';

export class ListEventsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize: number = 20;

  @IsOptional()
  @IsString()
  discipline?: string;

  @IsOptional()
  @IsEnum([
    'CONCERT', 'EXHIBITION', 'WORKSHOP', 'RESIDENCY', 'SCREENING', 'CONFERENCE', 'FESTIVAL', 'OTHER',
  ] satisfies EventType[])
  eventType?: EventType;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] satisfies ContentStatus[])
  status?: ContentStatus;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
