import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { Patient } from '@domain/entities/patient.entity';

export interface IAuthRepository {
  loginPatient(email: string): Promise<ResponseMessageDto<Patient | null>>;
}
