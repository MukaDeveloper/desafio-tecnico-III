import { ExamDto } from '@application/exam/models/exam.dto';
import { PatientStatus } from '@domain/enums/patient-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatientDto {
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
  @IsEnum(PatientStatus)
  @Transform(({ value }) => value ?? PatientStatus.Active)
  status!: PatientStatus;

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

  @ApiProperty({ required: false })
  @IsOptional()
  exams?: ExamDto[];
}
