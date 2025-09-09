import { Module } from '@nestjs/common';
import { PatientController } from '../controllers/patient.controller';
import { PatientApplicationModule } from '@application/patient/modules/patient.module';

@Module({
  imports: [PatientApplicationModule],
  controllers: [PatientController],
})
export class PatientPresentationModule {}
