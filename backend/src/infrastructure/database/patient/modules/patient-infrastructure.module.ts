import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '@domain/entities/patient.entity';
import { PatientRepository } from '@infrastructure/database/patient/repositories/patient.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  providers: [{ provide: 'IPatientRepository', useClass: PatientRepository }],
  exports: [{ provide: 'IPatientRepository', useClass: PatientRepository }],
})
export class PatientInfrastructureModule {}
