import { DicomModality } from '../enums/dicom-modality.enum';

export interface ExamDto {
  id?: string;
  patientId: string;
  idempotencyKey: string;
  modality: DicomModality;
  requestedAt: Date;
}
