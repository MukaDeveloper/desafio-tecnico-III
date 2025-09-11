import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDto {
  @ApiProperty()
  userId!: string;
  @ApiProperty()
  userName!: string;
  @ApiProperty()
  userEmail!: string;
  @ApiProperty()
  accessToken!: string;
  @ApiProperty()
  expiresIn!: number;
}
