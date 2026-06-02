import { IsOptional, IsString, IsInt, Min, IsEnum, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import type { ProgramStatus, ProgramModality } from '@bsmk/types';

export class ListProgramsDto {
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
  @IsString()
  audience?: string;

  @IsOptional()
  @IsEnum(['IN_PERSON', 'ONLINE', 'HYBRID'] satisfies ProgramModality[])
  modality?: ProgramModality;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'FULL', 'ARCHIVED', 'ALL'] satisfies (ProgramStatus | 'ALL')[])
  status?: ProgramStatus | 'ALL';

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;
}
