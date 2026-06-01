import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

const REQUEST_TYPES = ['ENROLLMENT', 'BOOKING', 'PROJECT', 'PARTNERSHIP', 'OPPORTUNITY'] as const;
const REQUEST_STATUSES = ['NEW', 'REVIEWING', 'ACCEPTED', 'DECLINED'] as const;

export class ListRequestsDto {
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
  @IsEnum(REQUEST_TYPES)
  type?: (typeof REQUEST_TYPES)[number];

  @IsOptional()
  @IsEnum(REQUEST_STATUSES)
  status?: (typeof REQUEST_STATUSES)[number];
}
