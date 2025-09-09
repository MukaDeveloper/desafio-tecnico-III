import { Module } from '@nestjs/common';
import { PatientApplicationModule } from './patient/modules/patient.module';
import { AuthApplicationModule } from './auth/modules/auth-application.module';
import { MapperModule } from './automapper/mapper.module';

@Module({
  imports: [AuthApplicationModule, PatientApplicationModule, MapperModule],
  exports: [AuthApplicationModule, PatientApplicationModule, MapperModule],
})
export class ApplicationModule {}
