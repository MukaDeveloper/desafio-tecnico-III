import { Module } from '@nestjs/common';
import { ExamService } from '../services/exam.service';
import { ExamInfrastructureModule } from '@infrastructure/database/exam/modules/exam-infrastructure.module';

@Module({
  imports: [ExamInfrastructureModule],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamApplicationModule {}
