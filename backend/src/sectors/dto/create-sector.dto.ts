import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateSectorDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
