import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { JwtService } from '@nestjs/jwt';
import { Mapper } from '@automapper/core';
import { IAuthRepository } from '@domain/interfaces/iauth-repository.interface';
import { AuthLoginDto } from '../models/auth.dto';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { AuthTokenDto } from '../models/auth-token.dto';
import * as bcrypt from 'bcrypt';
import { Patient } from '@domain/entities/patient.entity';
import { UserSystem } from '@domain/entities/user-system.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository') private readonly repository: IAuthRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async login(authLoginDto: AuthLoginDto): Promise<ResponseMessageDto<AuthTokenDto | null>> {
    const result = await this.repository.login(authLoginDto.email);
    const isMatch = await bcrypt.compare(authLoginDto.password, result.data?.password ?? ''); // true

    return new ResponseMessageDto<AuthTokenDto | null>({
      statusCode: isMatch ? result.statusCode : HttpStatus.NOT_FOUND,
      message: isMatch ? result.message : 'Invalid credentials',
      data: isMatch ? this.mapper.map(result.data, UserSystem, AuthTokenDto) : null,
      url: result.url,
    });
  }
}
