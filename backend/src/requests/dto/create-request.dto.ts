import { IsString, IsOptional, IsEnum, IsEmail, IsObject, MaxLength } from 'class-validator';

const REQUEST_TYPES = ['ENROLLMENT', 'BOOKING', 'PROJECT', 'PARTNERSHIP', 'OPPORTUNITY'] as const;
type RequestType = (typeof REQUEST_TYPES)[number];

export class CreateRequestDto {
  @IsEnum(REQUEST_TYPES)
  type: RequestType;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  message?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  programId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  spaceId?: string;
}
