import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { Patient } from '@domain/entities/patient.entity';
import { IAuthRepository } from '@domain/interfaces/iauth-repository.interface';
import { IPatientRepository } from '@domain/interfaces/ipatient-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { PatientDto } from '../models/patient.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@domain/commons/exceptions/conflict.exception';

@Injectable()
export class PatientService {
  constructor(
    @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
    @Inject('IPatientRepository') private readonly repository: IPatientRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findOne(id: string): Promise<ResponseMessageDto<PatientDto | null>> {
    const result = await this.repository.findOne(id);
    const resultMap = this.mapper.map(result.data!, Patient, PatientDto);
    return new ResponseMessageDto<PatientDto | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async findAll(): Promise<ResponseMessageDto<PatientDto[] | null>> {
    const result = await this.repository.findAll();
    const resultMap = this.mapper.mapArray(result.data!, Patient, PatientDto);
    return new ResponseMessageDto<PatientDto[] | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async findByEmail(email: string): Promise<ResponseMessageDto<PatientDto | null>> {
    const result = await this.repository.findByEmail(email);
    const resultMap = this.mapper.map(result.data!, Patient, PatientDto);
    return new ResponseMessageDto<PatientDto | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap ?? null,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async create(createDto: PatientDto): Promise<ResponseMessageDto<PatientDto | null>> {
    const exist = await this.authRepository.loginPatient(createDto.email);
    if (exist.data) {
      throw new ConflictException('Esse paciente já existe.');
    }
    const entity = this.mapper.map(createDto, PatientDto, Patient);
    entity.password = await bcrypt.hash(createDto.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const result = await this.repository.create(entity);
    const resultMap = this.mapper.map(result.data!, Patient, PatientDto);
    return new ResponseMessageDto<PatientDto | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async update(id: string, updateDto: PatientDto): Promise<ResponseMessageDto<PatientDto | null>> {
    const entity = this.mapper.map(updateDto, PatientDto, Patient);
    entity.password = await bcrypt.hash(updateDto.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const result = await this.repository.update(id, entity);
    const resultMap = this.mapper.map(result.data!, Patient, PatientDto);
    return new ResponseMessageDto<PatientDto | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async delete(id: string): Promise<ResponseMessageDto<boolean>> {
    const result = await this.repository.delete(id);
    return new ResponseMessageDto<boolean>({
      statusCode: result.statusCode,
      message: result.message,
      data: result.data,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }
}
