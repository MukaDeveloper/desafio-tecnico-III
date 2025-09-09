import { Module } from '@nestjs/common';
import { ExamController } from '../controllers/exam.controller';

@Module({
  controllers: [ExamController],
})
export class ExamPresentationModule {}
