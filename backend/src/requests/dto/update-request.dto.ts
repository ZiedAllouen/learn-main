import { IsOptional, IsString, IsEnum } from 'class-validator';

const REQUEST_STATUSES = ['NEW', 'REVIEWING', 'ACCEPTED', 'DECLINED'] as const;

export class UpdateRequestDto {
  @IsOptional()
  @IsEnum(REQUEST_STATUSES)
  status?: (typeof REQUEST_STATUSES)[number];

  @IsOptional()
  @IsString()
  adminNote?: string;
}
