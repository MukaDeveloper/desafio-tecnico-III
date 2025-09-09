import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDto {
  @ApiProperty()
  patientId!: string;
  @ApiProperty()
  patientName!: string;
  @ApiProperty()
  patientEmail!: string;
  @ApiProperty()
  accessToken!: string;
  @ApiProperty()
  expiresIn!: number;
}
