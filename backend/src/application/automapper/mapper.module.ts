import { ExamProfile } from '@application/exam/automapper/exam.profile';
import { PatientProfile } from '@application/patient/automapper/patient.profile';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [
    // Profiles
    PatientProfile,
    ExamProfile,
  ],
  exports: [AutomapperModule],
})
export class MapperModule {}
