import { Patient } from '../../patient/interfaces/patient.interface';
import { DicomModality } from '../enums/dicom-modality.enum';

export interface Exam {
  id: string;
  patientId: string;
  patient: Patient;
  modality: DicomModality;
  idempotencyKey: string;
  requestedAt?: Date;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  exams?: any;
}
