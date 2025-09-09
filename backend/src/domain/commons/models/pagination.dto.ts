import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty()
  totalItems!: number;
  @ApiProperty()
  totalPages!: number;
  @ApiProperty()
  currentPage!: number;
  @ApiProperty()
  pageSize!: number;

  constructor(init?: Partial<PaginationDto>) {
    Object.assign(this, init);
  }
}
