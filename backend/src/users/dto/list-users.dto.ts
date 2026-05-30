import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import type { UserRole } from '@bsmk/types';

export class ListUsersDto {
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
  @IsEnum(['ADMIN', 'EDITOR', 'ARTIST', 'USER'] satisfies UserRole[])
  role?: UserRole;

  @IsOptional()
  @IsString()
  search?: string;
}
