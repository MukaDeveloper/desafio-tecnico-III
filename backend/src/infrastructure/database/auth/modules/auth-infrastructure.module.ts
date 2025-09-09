import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from '../repositories/auth.repository';
import { Patient } from '@domain/entities/patient.entity';
import { PatientRepository } from '@infrastructure/database/patient/repositories/patient.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  providers: [
    { provide: 'IAuthRepository', useClass: AuthRepository },
    { provide: 'IPatientRepository', useClass: PatientRepository },
  ],
  exports: [
    { provide: 'IAuthRepository', useClass: AuthRepository },
    { provide: 'IPatientRepository', useClass: PatientRepository },
  ],
})
export class AuthInfrastructureModule {}
