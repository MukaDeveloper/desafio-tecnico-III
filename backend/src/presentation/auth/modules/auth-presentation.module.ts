import { Module } from '@nestjs/common';
import { AuthApplicationModule } from '@application/auth/modules/auth-application.module';
import { AuthController } from '../controllers/auth.controller';

@Module({
  imports: [AuthApplicationModule],
  controllers: [AuthController]
})
export class AuthPresentationModule {}
