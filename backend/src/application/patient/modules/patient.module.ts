import { Module } from '@nestjs/common';
import { PatientService } from '../services/patient.service';
import { PatientInfrastructureModule } from '@infrastructure/database/patient/modules/patient-infrastructure.module';
import { AuthInfrastructureModule } from '@infrastructure/database/auth/modules/auth-infrastructure.module';

@Module({
  imports: [PatientInfrastructureModule, AuthInfrastructureModule],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientApplicationModule {}
