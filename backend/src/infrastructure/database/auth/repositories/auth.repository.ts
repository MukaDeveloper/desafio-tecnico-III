import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { UserSystem } from '@domain/entities/user-system.entity';
import { UserSystemStatus } from '@domain/enums/user-system-status.enum';
import { IAuthRepository } from '@domain/interfaces/iauth-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@InjectRepository(UserSystem) private readonly repository: Repository<UserSystem>) {}

  async login(userEmail: string): Promise<ResponseMessageDto<UserSystem | null>> {
    const item = await this.repository.findOne({ where: { email: userEmail, status: UserSystemStatus.ACTIVE } });
    return new ResponseMessageDto({
      statusCode: item ? 200 : 404,
      message: item ? 'UserSystem found' : 'UserSystem not found',
      data: item,
      url: `/auth/login/${userEmail}`,
    });
  }
}
