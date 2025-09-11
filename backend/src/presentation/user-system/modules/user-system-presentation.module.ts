import { Module } from '@nestjs/common';
import { UserSystemController } from '../controllers/user-system.controller';
import { UserSystemApplicationModule } from '@application/user-system/modules/user-system.module';

@Module({
  imports: [UserSystemApplicationModule],
  controllers: [UserSystemController],
})
export class UserSystemPresentationModule {}
