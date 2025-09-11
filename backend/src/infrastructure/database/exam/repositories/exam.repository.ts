import { getNowWithTimeZone } from '@domain/commons/functions/get-now-with-timezone.function';
import { PaginationQueryDto } from '@domain/commons/models/pagination-query.dto';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { Exam } from '@domain/entities/exam.entity';
import { IExamRepository } from '@domain/interfaces/iexam-repository.interface';
import { ContextAccess } from '@middleware/context/context.access';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExamRepository implements IExamRepository {
  private readonly fallbackId = '00000000-0000-0000-0000-000000000000';

  constructor(@InjectRepository(Exam) private readonly repository: Repository<Exam>) {}

  async findOne(examId: string): Promise<ResponseMessageDto<Exam | null>> {
    const qb = this.repository.createQueryBuilder('exam');
    qb.leftJoinAndSelect('exam.patient', 'patient');
    qb.where('exam.id = :examId', { id: examId ?? this.fallbackId });
    const item = await qb.getOne();
    return new ResponseMessageDto({
      statusCode: item ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: item ? 'Exam found' : 'Exam not found',
      data: item,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async findAll(): Promise<ResponseMessageDto<Exam[] | null>> {
    const qb = this.repository.createQueryBuilder('exam');
    qb.leftJoinAndSelect('exam.patient', 'patient');
    const [data, totalItems] = await qb.getManyAndCount();
    return new ResponseMessageDto({
      statusCode: data?.length > 0 ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: data?.length > 0 ? 'Exams fetched successfully' : 'Exams not found',
      data,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
      pagination: { totalItems, totalPages: 1, currentPage: 1, pageSize: totalItems },
    });
  }

  async findAllPaginated(pagination: PaginationQueryDto): Promise<ResponseMessageDto<Exam[]>> {
    const qb = this.repository.createQueryBuilder('exam');
    qb.leftJoinAndSelect('exam.patient', 'patient');
    qb.skip((pagination.page - 1) * pagination.pageSize).take(pagination.pageSize);
    const [data, totalItems] = await qb.getManyAndCount();
    const totalPages = Math.ceil(totalItems / pagination.pageSize);
    return new ResponseMessageDto({
      statusCode: data?.length > 0 ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: data?.length > 0 ? 'Exams fetched successfully' : 'Exams not found',
      data,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
      pagination: { totalItems, totalPages, currentPage: pagination.page, pageSize: pagination.pageSize },
    });
  }

  async findByPatientId(patientId: string): Promise<ResponseMessageDto<Exam | null>> {
    const qb = this.repository.createQueryBuilder('exam');
    qb.leftJoinAndSelect('exam.patient', 'patient');
    qb.where('exam.patientId = :patientId', { patientId: patientId ?? this.fallbackId });
    const item = await qb.getOne();
    return new ResponseMessageDto({
      statusCode: item ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: item ? 'Exam found' : 'Exam not found',
      data: item,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<ResponseMessageDto<Exam | null>> {
    const qb = this.repository.createQueryBuilder('exam');
    qb.leftJoinAndSelect('exam.patient', 'patient');
    qb.where('exam.idempotencyKey = :idempotencyKey', { idempotencyKey: idempotencyKey ?? this.fallbackId });
    const item = await qb.getOne();
    return new ResponseMessageDto({
      statusCode: item ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: item ? 'Exam found' : 'Exam not found',
      data: item,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async create(entity: Exam): Promise<ResponseMessageDto<Exam | null>> {
    const created = await this.repository.create(entity);
    await this.repository.save(created);
    return new ResponseMessageDto({
      statusCode: HttpStatus.CREATED,
      message: 'Exam created successfully',
      data: created,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async update(examId: string, entity: Exam): Promise<ResponseMessageDto<Exam | null>> {
    const data = await this.repository.manager.transaction(async (tx) => {
      const examRepository = tx.getRepository(Exam);
      const updated = await examRepository.findOneOrFail({ where: { id: examId ?? this.fallbackId } });
      const merged = await examRepository.merge(updated, entity);
      return await examRepository.save(merged);
    });

    return new ResponseMessageDto({
      statusCode: HttpStatus.OK,
      message: 'Exam updated successfully',
      data: data,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async save(entity: Exam): Promise<ResponseMessageDto<Exam | null>> {
    let result = await this.repository.findOne({ where: { id: entity.id ?? this.fallbackId } });
    if (result) result = this.repository.merge(result, entity);
    else result = this.repository.create(entity);
    result = await this.repository.save(result);
    return new ResponseMessageDto({
      statusCode: HttpStatus.OK,
      message: 'Exam updated successfully',
      data: result,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async delete(examId: string): Promise<ResponseMessageDto<boolean>> {
    await this.repository.delete(examId ?? this.fallbackId);
    return new ResponseMessageDto({
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Customer removed successfully',
      data: true,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }
}
