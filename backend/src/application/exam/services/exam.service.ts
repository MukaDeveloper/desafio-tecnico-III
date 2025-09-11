import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ExamDto } from '../models/exam.dto';
import { Exam } from '@domain/entities/exam.entity';
import { IExamRepository } from '@domain/interfaces/iexam-repository.interface';
import { PaginationQueryDto } from '@domain/commons/models/pagination-query.dto';

@Injectable()
export class ExamService {
  constructor(
    @Inject('IExamRepository') private readonly repository: IExamRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findOne(id: string): Promise<ResponseMessageDto<ExamDto | null>> {
    const result = await this.repository.findOne(id);
    const resultMap = this.mapper.map(result.data!, Exam, ExamDto);
    return new ResponseMessageDto<ExamDto | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async findAll(): Promise<ResponseMessageDto<ExamDto[] | null>> {
    const result = await this.repository.findAll();
    const resultMap = this.mapper.mapArray(result.data!, Exam, ExamDto);
    return new ResponseMessageDto<ExamDto[] | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async findAllPaginated(pagination: PaginationQueryDto): Promise<ResponseMessageDto<ExamDto[] | null>> {
    const result = await this.repository.findAllPaginated(pagination);
    const resultMap = this.mapper.mapArray(result.data!, Exam, ExamDto);
    return new ResponseMessageDto<ExamDto[] | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async findByPatientId(patientId: string): Promise<ResponseMessageDto<ExamDto | null>> {
    const result = await this.repository.findByPatientId(patientId);
    const resultMap = this.mapper.map(result.data!, Exam, ExamDto);
    return new ResponseMessageDto<ExamDto | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<ResponseMessageDto<ExamDto | null>> {
    const result = await this.repository.findByIdempotencyKey(idempotencyKey);
    const resultMap = this.mapper.map(result.data!, Exam, ExamDto);
    return new ResponseMessageDto<ExamDto | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async create(createDto: ExamDto): Promise<ResponseMessageDto<ExamDto | null>> {
    const created = await this.findByIdempotencyKey(createDto.idempotencyKey);
    if (created) {
      return new ResponseMessageDto<ExamDto | null>({
        statusCode: created.statusCode,
        message: created.message,
        data: created.data,
        occurrenceData: created.occurrenceData,
        url: created.url,
        pagination: created.pagination,
      });
    }

    const entity = this.mapper.map(createDto, ExamDto, Exam);
    const result = await this.repository.create(entity);
    const resultMap = this.mapper.map(result.data!, Exam, ExamDto);
    return new ResponseMessageDto<ExamDto | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async update(id: string, updateDto: ExamDto): Promise<ResponseMessageDto<ExamDto | null>> {
    const entity = this.mapper.map(updateDto, ExamDto, Exam);
    const result = await this.repository.update(id, entity);
    const resultMap = this.mapper.map(result.data!, Exam, ExamDto);
    return new ResponseMessageDto<ExamDto | null>({
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
