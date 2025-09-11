import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Número da página', default: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: 'Tamanho da página', default: 10 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  pageSize: number = 10;
}
