import { Module } from '@nestjs/common';
import { PatientPresentationModule } from './patients/modules/patient-presentation.module';
import { ExamPresentationModule } from './exams/modules/exam-presentation.module';
import { AuthPresentationModule } from './auth/modules/auth-presentation.module';
import { UserSystemPresentationModule } from './user-system/modules/user-system-presentation.module';

@Module({
  imports: [AuthPresentationModule, ExamPresentationModule, PatientPresentationModule, UserSystemPresentationModule],
})
export class PresentationModule {}
