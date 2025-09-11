import { PaginationQueryDto } from "@domain/commons/models/pagination-query.dto";
import { ResponseMessageDto } from "@domain/commons/models/response-message.dto";
import { UserSystem } from "@domain/entities/user-system.entity";

export interface IUserSystemRepository {
  findOne(userSystemId: string): Promise<ResponseMessageDto<UserSystem | null>>;
  findAll(): Promise<ResponseMessageDto<UserSystem[] | null>>;
  findAllPaginated(pagination: PaginationQueryDto): Promise<ResponseMessageDto<UserSystem[]>>;
  findByEmail(email: string): Promise<ResponseMessageDto<UserSystem | null>>;
  create(entity: UserSystem): Promise<ResponseMessageDto<UserSystem | null>>;
  update(userSystemId: string, entity: UserSystem): Promise<ResponseMessageDto<UserSystem | null>>;
  save(entity: UserSystem): Promise<ResponseMessageDto<UserSystem | null>>;
  delete(userSystemId: string): Promise<ResponseMessageDto<boolean>>;
}