import { ExamProfile } from '@application/exam/automapper/exam.profile';
import { PatientProfile } from '@application/patient/automapper/patient.profile';
import { UserSystemProfile } from '@application/user-system/automapper/user-system.profile';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [PatientProfile, ExamProfile, UserSystemProfile],
  exports: [AutomapperModule],
})
export class MapperModule {}
