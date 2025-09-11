import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { UserSystem } from '@domain/entities/user-system.entity';

export interface IAuthRepository {
  login(email: string): Promise<ResponseMessageDto<UserSystem | null>>;
}
