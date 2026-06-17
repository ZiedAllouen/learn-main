import { IsOptional, IsString, IsInt, Min, IsEnum, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import type { ContentStatus } from '@bsmk/types';

export class ListArtistsDto {
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
  search?: string;

  @IsOptional()
  @IsString()
  discipline?: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] satisfies ContentStatus[])
  status?: ContentStatus;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;
}
