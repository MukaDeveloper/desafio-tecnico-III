import { PaginationQueryDto } from '@domain/commons/models/pagination-query.dto';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { Patient } from '@domain/entities/patient.entity';

export interface IPatientRepository {
  findOne(patientId: string): Promise<ResponseMessageDto<Patient | null>>;
  findAll(): Promise<ResponseMessageDto<Patient[] | null>>;
  findAllPaginated(pagination: PaginationQueryDto): Promise<ResponseMessageDto<Patient[]>>;
  create(entity: Patient): Promise<ResponseMessageDto<Patient | null>>;
  update(patientId: string, entity: Patient): Promise<ResponseMessageDto<Patient | null>>;
  save(entity: Patient): Promise<ResponseMessageDto<Patient | null>>;
  delete(patientId: string): Promise<ResponseMessageDto<boolean>>;
}
