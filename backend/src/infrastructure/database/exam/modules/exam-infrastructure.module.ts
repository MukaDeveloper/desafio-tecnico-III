import { Exam } from '@domain/entities/exam.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamRepository } from '../repositories/exam.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Exam])],
  providers: [{ provide: 'IExamRepository', useClass: ExamRepository }],
  exports: [{ provide: 'IExamRepository', useClass: ExamRepository }],
})
export class ExamInfrastructureModule {}
