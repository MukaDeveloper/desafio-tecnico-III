import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { Patient } from '@domain/entities/patient.entity';
import { PatientStatus } from '@domain/enums/patient-status.enum';
import { IAuthRepository } from '@domain/interfaces/iauth-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@InjectRepository(Patient) private readonly repository: Repository<Patient>) {}

  async loginPatient(email: string): Promise<ResponseMessageDto<Patient | null>> {
    const item = await this.repository.findOne({ where: { email, status: PatientStatus.Active } });
    return new ResponseMessageDto({
      statusCode: item ? 200 : 404,
      message: item ? 'Patient found' : 'Patient not found',
      data: item,
      url: `/auth/login/${email}`,
    });
  }
}
