import { getNowWithTimeZone } from '@domain/commons/functions/get-now-with-timezone.function';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { Patient } from '@domain/entities/patient.entity';
import { IPatientRepository } from '@domain/interfaces/ipatient-repository.interface';
import { ContextAccess } from '@middleware/context/context.access';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PatientRepository implements IPatientRepository {
  private readonly fallbackId = '00000000-0000-0000-0000-000000000000';

  constructor(@InjectRepository(Patient) private readonly repository: Repository<Patient>) {}

  async findOne(patientId: string): Promise<ResponseMessageDto<Patient | null>> {
    const qb = this.repository.createQueryBuilder('patient');
    qb.leftJoinAndSelect('patient.exam', 'exam');
    qb.where('patient.id = :patientId', { id: patientId ?? this.fallbackId });
    const item = await qb.getOne();
    return new ResponseMessageDto({
      statusCode: item ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: item ? 'Patient found' : 'Patient not found',
      data: item,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.Url,
    });
  }

  async findAll(): Promise<ResponseMessageDto<Patient[] | null>> {
    const qb = this.repository.createQueryBuilder('patient');
    qb.leftJoinAndSelect('patient.exam', 'exam');
    const [data, totalItems] = await qb.getManyAndCount();
    return new ResponseMessageDto({
      statusCode: data?.length > 0 ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: data?.length > 0 ? 'Patient fetched successfully' : 'Patient not found',
      data,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.Url,
      pagination: { totalItems, totalPages: 1, currentPage: 1, pageSize: totalItems },
    });
  }

  async findByEmail(email: string): Promise<ResponseMessageDto<Patient | null>> {
    const qb = this.repository.createQueryBuilder('patient');
    qb.leftJoinAndSelect('patient.exam', 'exam');
    qb.where('patient.email = :email', { email: email ?? '' });
    const item = await qb.getOne();
    return new ResponseMessageDto({
      statusCode: item ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: item ? 'Patient found' : 'Patient not found',
      data: item,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.Url,
    });
  }

  async create(entity: Patient): Promise<ResponseMessageDto<Patient | null>> {
    const created = await this.repository.create(entity);
    await this.repository.save(created);
    return new ResponseMessageDto({
      statusCode: HttpStatus.CREATED,
      message: 'Patient created successfully',
      data: created,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.Url,
    });
  }

  update(patientId: string, entity: Patient): Promise<ResponseMessageDto<Patient | null>> {
    throw new Error('Method not implemented.');
  }

  save(entity: Patient): Promise<ResponseMessageDto<Patient | null>> {
    throw new Error('Method not implemented.');
  }

  delete(patientId: string): Promise<ResponseMessageDto<boolean>> {
    throw new Error('Method not implemented.');
  }
}
