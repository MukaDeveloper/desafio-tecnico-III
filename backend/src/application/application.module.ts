import { Module } from '@nestjs/common';
import { PatientApplicationModule } from './patient/modules/patient.module';
import { AuthApplicationModule } from './auth/modules/auth-application.module';

@Module({
  imports: [AuthApplicationModule, PatientApplicationModule],
  exports: [AuthApplicationModule, PatientApplicationModule],
})
export class ApplicationModule {}
