import {
  IsString, IsOptional, IsArray, IsNumber, IsEmail, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArtistWorkInput } from './create-artist.dto';

export class UpsertOwnArtistDto {
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
  @IsArray()
  @IsString({ each: true })
  disciplineIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArtistWorkInput)
  works?: ArtistWorkInput[];
}
