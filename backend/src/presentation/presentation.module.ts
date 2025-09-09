import { Module } from '@nestjs/common';
import { PatientPresentationModule } from './patients/modules/patient-presentation.module';
import { ExamPresentationModule } from './exams/modules/exam-presentation.module';
import { AuthPresentationModule } from './auth/modules/auth-presentation.module';

@Module({
  imports: [AuthPresentationModule, ExamPresentationModule, PatientPresentationModule],
})
export class PresentationModule {}
