import { UserSystem } from '@domain/entities/user-system.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSystemRepository } from '../repositories/user-system.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserSystem])],
  providers: [{ provide: 'IUserSystemRepository', useClass: UserSystemRepository }],
  exports: [{ provide: 'IUserSystemRepository', useClass: UserSystemRepository }],
})
export class UserSystemInfrastructureModule {}
