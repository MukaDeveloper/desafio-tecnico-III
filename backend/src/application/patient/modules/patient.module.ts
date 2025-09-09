import { Module } from '@nestjs/common';
import { PatientService } from '../services/patient.service';
import { PatientInfrastructureModule } from '@infrastructure/database/patient/modules/patient-infrastructure.module';
import { AuthInfrastructureModule } from '@infrastructure/database/auth/modules/auth-infrastructure.module';
import { MapperModule } from '@application/automapper/mapper.module';

@Module({
  imports: [PatientInfrastructureModule, AuthInfrastructureModule, MapperModule],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientApplicationModule {}
