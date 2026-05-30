import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateDisciplineDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() iconUrl?: string;
  @IsOptional() @IsString() coverUrl?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() sectorId?: string;
  @IsOptional() @IsInt() sortOrder?: number;
}
