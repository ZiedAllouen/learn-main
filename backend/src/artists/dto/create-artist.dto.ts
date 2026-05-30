import {
  IsString, IsOptional, IsEnum, IsBoolean, IsArray, IsNumber, IsEmail, IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ContentStatus } from '@bsmk/types';

export class ArtistWorkInput {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class CreateArtistDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() statement?: string;
  @IsOptional() @IsString() photoUrl?: string;
  @IsOptional() @IsString() coverUrl?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
  @IsOptional() @IsString() websiteUrl?: string;
  @IsOptional() @IsString() instagramUrl?: string;
  @IsOptional() @IsEmail() email?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] satisfies ContentStatus[])
  status?: ContentStatus;

  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disciplineIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArtistWorkInput)
  works?: ArtistWorkInput[];
}
