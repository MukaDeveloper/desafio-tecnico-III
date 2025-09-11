import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from '../repositories/auth.repository';
import { UserSystem } from '@domain/entities/user-system.entity';
import { UserSystemRepository } from '@infrastructure/database/user-system/repositories/user-system.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserSystem])],
  providers: [
    { provide: 'IAuthRepository', useClass: AuthRepository },
    { provide: 'IUserSystemRepository', useClass: UserSystemRepository },
  ],
  exports: [
    { provide: 'IAuthRepository', useClass: AuthRepository },
    { provide: 'IUserSystemRepository', useClass: UserSystemRepository },
  ],
})
export class AuthInfrastructureModule {}
