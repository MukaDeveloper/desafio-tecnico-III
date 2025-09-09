import { Patient } from '@domain/entities/patient.entity';
import { DicomModality } from '@domain/enums/dicom-modality.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ExamDto {
  @ApiProperty({ description: 'ID do Exame', required: false })
  @IsString()
  @IsOptional()
  id!: string;

  @ApiProperty({ description: 'ID do Paciente', required: true })
  @IsString()
  @IsNotEmpty()
  patientId!: string;

  @ApiProperty({ description: 'Modalidate', required: true })
  @IsEnum(DicomModality)
  @Transform(({ value }) => value)
  modality!: DicomModality;

  @ApiProperty({ description: 'Chave de Idempotência', required: true })
  @IsString()
  @IsNotEmpty()
  idempotencyKey!: string;

  @ApiProperty({ description: 'Data de Requisição', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  requestedAt?: Date;

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
  patient?: Patient;
}
