import { DataSource } from 'typeorm';
import { getNowWithTimeZone } from '@domain/commons/functions/get-now-with-timezone.function';
import { Exam } from '@domain/entities/exam.entity';
import { DicomModality } from '@domain/enums/dicom-modality.enum';

export async function createDefaultExam(dataSource: DataSource) {
  const repository = dataSource.getRepository(Exam);

  const defaults: Partial<Exam>[] = [
    {
      id: 'b4a656d4-5381-48b6-8fae-5638159a17fc',
      patientId: '9d1e25b6-f352-76e9-5311-d63b35a6f351',
      modality: DicomModality.CT,
      idempotencyKey: 'exam-2025-09-08-001',
      createdAt: getNowWithTimeZone(),
      createdBy: 'System',
      updatedAt: getNowWithTimeZone(),
      updatedBy: 'System',
    },
  ];

  for (let item of defaults) {
    await repository.save(item);
  }
}
