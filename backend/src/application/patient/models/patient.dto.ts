import { ExamDto } from '@application/exam/models/exam.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatientDto {
  @ApiProperty({ description: 'ID do Usuário', required: false })
  @IsString()
  @IsOptional()
  id!: string;

  @ApiProperty({ description: 'Nome Completo', required: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

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
