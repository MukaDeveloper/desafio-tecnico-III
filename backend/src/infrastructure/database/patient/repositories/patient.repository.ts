import { getNowWithTimeZone } from '@domain/commons/functions/get-now-with-timezone.function';
import { PaginationQueryDto } from '@domain/commons/models/pagination-query.dto';
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
    qb.leftJoinAndSelect('patient.exams', 'exam');
    qb.where('patient.id = :patientId', { id: patientId ?? this.fallbackId });
    const item = await qb.getOne();
    return new ResponseMessageDto({
      statusCode: item ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: item ? 'Patient found' : 'Patient not found',
      data: item,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async findAll(): Promise<ResponseMessageDto<Patient[] | null>> {
    const qb = this.repository.createQueryBuilder('patient');
    qb.leftJoinAndSelect('patient.exams', 'exam');
    const [data, totalItems] = await qb.getManyAndCount();
    return new ResponseMessageDto({
      statusCode: data?.length > 0 ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: data?.length > 0 ? 'Patient fetched successfully' : 'Patient not found',
      data,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
      pagination: { totalItems, totalPages: 1, currentPage: 1, pageSize: totalItems },
    });
  }

  async findAllPaginated(pagination: PaginationQueryDto): Promise<ResponseMessageDto<Patient[]>> {
    const qb = this.repository.createQueryBuilder('patient');
    qb.leftJoinAndSelect('patient.exams', 'exam');
    qb.skip((pagination.page - 1) * pagination.pageSize).take(pagination.pageSize);
    const [data, totalItems] = await qb.getManyAndCount();
    const totalPages = Math.ceil(totalItems / pagination.pageSize);
    return new ResponseMessageDto({
      statusCode: data?.length > 0 ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: data?.length > 0 ? 'Patient fetched successfully' : 'Patient not found',
      data,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
      pagination: { totalItems, totalPages, currentPage: pagination.page, pageSize: pagination.pageSize },
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
      url: ContextAccess.url,
    });
  }

  async update(patientId: string, entity: Patient): Promise<ResponseMessageDto<Patient | null>> {
    const data = await this.repository.manager.transaction(async (tx) => {
      const patientRepository = tx.getRepository(Patient);
      const updated = await patientRepository.findOneOrFail({ where: { id: patientId ?? this.fallbackId } });
      const merged = await patientRepository.merge(updated, entity);
      return await patientRepository.save(merged);
    });

    return new ResponseMessageDto({
      statusCode: HttpStatus.OK,
      message: 'Patient updated successfully',
      data: data,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async save(entity: Patient): Promise<ResponseMessageDto<Patient | null>> {
    let result = await this.repository.findOne({ where: { id: entity.id ?? this.fallbackId } });
    if (result) result = this.repository.merge(result, entity);
    else result = this.repository.create(entity);
    result = await this.repository.save(result);
    return new ResponseMessageDto({
      statusCode: HttpStatus.OK,
      message: 'Patient updated successfully',
      data: result,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async delete(patientId: string): Promise<ResponseMessageDto<boolean>> {
    await this.repository.delete(patientId ?? this.fallbackId);
    return new ResponseMessageDto({
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Customer removed successfully',
      data: true,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }
}
