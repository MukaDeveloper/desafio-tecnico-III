import { Module } from '@nestjs/common';
import { PatientController } from '../controllers/patient.controller';

@Module({
  controllers: [PatientController],
})
export class PatientPresentationModule {}
