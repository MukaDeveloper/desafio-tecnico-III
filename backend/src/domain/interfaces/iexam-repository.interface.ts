import { PaginationQueryDto } from '@domain/commons/models/pagination-query.dto';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { Exam } from '@domain/entities/exam.entity';

export interface IExamRepository {
  findOne(examId: string): Promise<ResponseMessageDto<Exam | null>>;
  findAll(): Promise<ResponseMessageDto<Exam[] | null>>;
  findAllPaginated(pagination: PaginationQueryDto): Promise<ResponseMessageDto<Exam[]>>;
  findByPatientId(patientId: string): Promise<ResponseMessageDto<Exam | null>>;
  findByIdempotencyKey(idempotencyKey: string): Promise<ResponseMessageDto<Exam | null>>;
  create(entity: Exam): Promise<ResponseMessageDto<Exam | null>>;
  update(examId: string, entity: Exam): Promise<ResponseMessageDto<Exam | null>>;
  save(entity: Exam): Promise<ResponseMessageDto<Exam | null>>;
  delete(examId: string): Promise<ResponseMessageDto<boolean>>;
}
