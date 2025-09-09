import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { Patient } from '@domain/entities/patient.entity';

export interface IPatientRepository {
  findOne(patientId: string): Promise<ResponseMessageDto<Patient | null>>;
  findAll(): Promise<ResponseMessageDto<Patient[] | null>>;
  findByEmail(email: string): Promise<ResponseMessageDto<Patient | null>>;
  create(entity: Patient): Promise<ResponseMessageDto<Patient | null>>;
  update(patientId: string, entity: Patient): Promise<ResponseMessageDto<Patient | null>>;
  save(entity: Patient): Promise<ResponseMessageDto<Patient | null>>;
  delete(patientId: string): Promise<ResponseMessageDto<boolean>>;
}
