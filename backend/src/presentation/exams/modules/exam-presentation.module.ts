import { Module } from '@nestjs/common';
import { ExamController } from '../controllers/exam.controller';
import { ExamApplicationModule } from '@application/exam/modules/exam.module';

@Module({
  imports: [ExamApplicationModule],
  controllers: [ExamController],
})
export class ExamPresentationModule {}
