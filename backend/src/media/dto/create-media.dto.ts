import {
  IsString, IsOptional, IsEnum, IsBoolean, IsArray, IsDateString,
} from 'class-validator';
import type { ContentStatus, MediaType } from '@bsmk/types';

export class CreateMediaDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsEnum(['VIDEO', 'PHOTO', 'EDITO', 'MAGAZINE', 'PUBLICATION'] satisfies MediaType[])
  type: MediaType;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsString() thumbnailUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] satisfies ContentStatus[])
  status?: ContentStatus;

  @IsOptional() @IsBoolean() featured?: boolean;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disciplineIds?: string[];
}
