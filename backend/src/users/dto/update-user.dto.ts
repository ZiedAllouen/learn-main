import { IsOptional, IsEnum, IsString } from 'class-validator';
import type { UserRole } from '@bsmk/types';

export class UpdateUserDto {
  @IsOptional()
  @IsEnum(['ADMIN', 'EDITOR', 'ARTIST', 'USER'] satisfies UserRole[])
  role?: UserRole;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
