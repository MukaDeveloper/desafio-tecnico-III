import { Module } from '@nestjs/common';
import { UserSystemService } from '../services/user-system.service';
import { AuthInfrastructureModule } from '@infrastructure/database/auth/modules/auth-infrastructure.module';
import { UserSystemInfrastructureModule } from '@infrastructure/database/user-system/modules/user-system-infrastructure.module';

@Module({
  imports: [UserSystemInfrastructureModule, AuthInfrastructureModule],
  providers: [UserSystemService],
  exports: [UserSystemService],
})
export class UserSystemApplicationModule {}
