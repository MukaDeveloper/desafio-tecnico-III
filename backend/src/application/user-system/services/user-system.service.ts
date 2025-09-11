import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { IAuthRepository } from '@domain/interfaces/iauth-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserSystemDto } from '../models/user-system.dto';
import { UserSystem } from '@domain/entities/user-system.entity';
import { IUserSystemRepository } from '@domain/interfaces/iuser-system-repository.interface';
import { ConflictException } from '@domain/commons/exceptions/conflict.exception';
import * as bcrypt from 'bcrypt';
import { PaginationQueryDto } from '@domain/commons/models/pagination-query.dto';

@Injectable()
export class UserSystemService {
  constructor(
    @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
    @Inject('IUserSystemRepository') private readonly repository: IUserSystemRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findOne(id: string): Promise<ResponseMessageDto<UserSystemDto | null>> {
    const result = await this.repository.findOne(id);
    const resultMap = this.mapper.map(result.data!, UserSystem, UserSystemDto);
    return new ResponseMessageDto<UserSystemDto | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async findAll(): Promise<ResponseMessageDto<UserSystemDto[] | null>> {
    const result = await this.repository.findAll();
    const resultMap = this.mapper.mapArray(result.data!, UserSystem, UserSystemDto);
    return new ResponseMessageDto<UserSystemDto[] | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async findAllPaginated(pagination: PaginationQueryDto): Promise<ResponseMessageDto<UserSystemDto[] | null>> {
    const result = await this.repository.findAllPaginated(pagination);
    const resultMap = this.mapper.mapArray(result.data!, UserSystem, UserSystemDto);
    return new ResponseMessageDto<UserSystemDto[] | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async findByEmail(email: string): Promise<ResponseMessageDto<UserSystemDto | null>> {
    const result = await this.repository.findByEmail(email);
    const resultMap = this.mapper.map(result.data!, UserSystem, UserSystemDto);
    return new ResponseMessageDto<UserSystemDto | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap ?? null,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async create(createDto: UserSystemDto): Promise<ResponseMessageDto<UserSystemDto | null>> {
    const exist = await this.authRepository.login(createDto.email);
    if (exist.data) {
      throw new ConflictException('Esse paciente já existe.');
    }
    const entity = this.mapper.map(createDto, UserSystemDto, UserSystem);
    entity.password = await bcrypt.hash(createDto.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const result = await this.repository.create(entity);
    const resultMap = this.mapper.map(result.data!, UserSystem, UserSystemDto);
    return new ResponseMessageDto<UserSystemDto | null>({
      statusCode: result.statusCode,
      message: result.message,
      data: resultMap,
      occurrenceData: result.occurrenceData,
      url: result.url,
      pagination: result.pagination,
    });
  }

  async update(id: string, updateDto: UserSystemDto): Promise<ResponseMessageDto<UserSystemDto | null>> {
    const entity = this.mapper.map(updateDto, UserSystemDto, UserSystem);
    const result = await this.repository.update(id, entity);
    const resultMap = this.mapper.map(result.data!, UserSystem, UserSystemDto);
    return new ResponseMessageDto<UserSystemDto | null>({
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
