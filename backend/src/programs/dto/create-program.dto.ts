import { IsString, IsOptional, IsEnum, IsBoolean, IsArray } from 'class-validator';
import type { ProgramModality, ProgramStatus } from '@bsmk/types';

export class CreateProgramDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  body?: object;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  programTypeId?: string;

  @IsOptional()
  @IsEnum(['IN_PERSON', 'ONLINE', 'HYBRID'] satisfies ProgramModality[])
  modality?: ProgramModality;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  priceIndicative?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'FULL'] satisfies ProgramStatus[])
  status?: ProgramStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disciplineIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  audienceTypeIds?: string[];
}
