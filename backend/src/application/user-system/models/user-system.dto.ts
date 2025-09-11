import { ExamDto } from '@application/exam/models/exam.dto';
import { UserSystemStatus } from '@domain/enums/user-system-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserSystemDto {
  @ApiProperty({ description: 'ID do Usuário', required: false })
  @IsString()
  @IsOptional()
  id!: string;

  @ApiProperty({ description: 'Nome Completo', required: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Email', required: true })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Senha', required: true })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ description: 'Status', required: true })
  @IsEnum(UserSystemStatus)
  @Transform(({ value }) => value ?? UserSystemStatus.ACTIVE)
  status!: UserSystemStatus;

  @ApiProperty({ description: 'Data de Criação', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  createdAt!: Date;

  @ApiProperty({ description: 'Criado por', required: false })
  @IsString()
  @IsOptional()
  createdBy!: string;

  @ApiProperty({ description: 'Data de Atualização', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @ApiProperty({ description: 'Atualizado por', required: false })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}
