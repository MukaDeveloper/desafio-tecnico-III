import { getNowWithTimeZone } from '@domain/commons/functions/get-now-with-timezone.function';
import { PaginationQueryDto } from '@domain/commons/models/pagination-query.dto';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { UserSystem } from '@domain/entities/user-system.entity';
import { IUserSystemRepository } from '@domain/interfaces/iuser-system-repository.interface';
import { ContextAccess } from '@middleware/context/context.access';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserSystemRepository implements IUserSystemRepository {
  private readonly fallbackId = '00000000-0000-0000-0000-000000000000';

  constructor(@InjectRepository(UserSystem) private readonly repository: Repository<UserSystem>) {}

  async findOne(entityId: string): Promise<ResponseMessageDto<UserSystem | null>> {
    const qb = this.repository.createQueryBuilder('usersystem');
    qb.where('userSystem.id = :id', { id: entityId ?? this.fallbackId });
    const item = await qb.getOne();
    return new ResponseMessageDto({
      statusCode: item ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: item ? 'UserSystem found' : 'UserSystem not found',
      data: item,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async findAll(): Promise<ResponseMessageDto<UserSystem[] | null>> {
    const qb = this.repository.createQueryBuilder('usersystem');
    const [data, totalItems] = await qb.getManyAndCount();
    return new ResponseMessageDto({
      statusCode: data?.length > 0 ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: data?.length > 0 ? 'UserSystem fetched successfully' : 'UserSystem not found',
      data,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
      pagination: { totalItems, totalPages: 1, currentPage: 1, pageSize: totalItems },
    });
  }

  async findAllPaginated(pagination: PaginationQueryDto): Promise<ResponseMessageDto<UserSystem[]>> {
    const qb = this.repository.createQueryBuilder('usersystem');
    qb.skip((pagination.page - 1) * pagination.pageSize).take(pagination.pageSize);
    const [data, totalItems] = await qb.getManyAndCount();
    const totalPages = Math.ceil(totalItems / pagination.pageSize);
    return new ResponseMessageDto({
      statusCode: data?.length > 0 ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: data?.length > 0 ? 'UsersSystem fetched successfully' : 'UsersSystem not found',
      data,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
      pagination: { totalItems, totalPages, currentPage: pagination.page, pageSize: pagination.pageSize },
    });
  }

  async findByEmail(email: string): Promise<ResponseMessageDto<UserSystem | null>> {
    const qb = this.repository.createQueryBuilder('usersystem');
    qb.where('userSystem.email = :email', { email: email ?? '' });
    const item = await qb.getOne();
    return new ResponseMessageDto({
      statusCode: item ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: item ? 'UserSystem found' : 'UserSystem not found',
      data: item,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async create(entity: UserSystem): Promise<ResponseMessageDto<UserSystem | null>> {
    const created = await this.repository.create(entity);
    await this.repository.save(created);
    return new ResponseMessageDto({
      statusCode: HttpStatus.CREATED,
      message: 'UserSystem created successfully',
      data: created,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async update(entityId: string, entity: UserSystem): Promise<ResponseMessageDto<UserSystem | null>> {
    const updated = await this.repository.findOneOrFail({ where: { id: entityId ?? this.fallbackId } });
    const merged = await this.repository.merge(updated, entity);
    await this.repository.save(merged);
    return new ResponseMessageDto({
      statusCode: HttpStatus.OK,
      message: 'UserSystem updated successfully',
      data: merged,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async save(entity: UserSystem): Promise<ResponseMessageDto<UserSystem | null>> {
    let result = await this.repository.findOne({ where: { id: entity.id ?? this.fallbackId } });
    if (result) result = await this.repository.merge(result, entity);
    else result = await this.repository.create(entity);
    result = await this.repository.save(result);
    return new ResponseMessageDto({
      statusCode: HttpStatus.OK,
      message: 'UserSystem updated successfully',
      data: result,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }

  async delete(entityId: string): Promise<ResponseMessageDto<boolean>> {
    await this.repository.delete(entityId ?? this.fallbackId);
    return new ResponseMessageDto({
      statusCode: HttpStatus.NO_CONTENT,
      message: 'UserSystem removed successfully',
      data: true,
      occurrenceData: getNowWithTimeZone().toString(),
      url: ContextAccess.url,
    });
  }
}
