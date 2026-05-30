import { IsString, IsOptional, IsEnum, IsNumber, IsInt, IsArray, Min } from 'class-validator';
import type { ContentStatus } from '@bsmk/types';

export class CreateSpaceDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsNumber()
  surfaceSqm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  capacity?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] satisfies ContentStatus[])
  status?: ContentStatus;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disciplineIds?: string[];
}
