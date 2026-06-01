import { IsString, IsOptional, IsEnum, IsEmail, IsObject } from 'class-validator';

const REQUEST_TYPES = ['ENROLLMENT', 'BOOKING', 'PROJECT', 'PARTNERSHIP', 'OPPORTUNITY'] as const;
type RequestType = (typeof REQUEST_TYPES)[number];

export class CreateRequestDto {
  @IsEnum(REQUEST_TYPES)
  type: RequestType;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  programId?: string;

  @IsOptional()
  @IsString()
  spaceId?: string;
}
