export interface Patient {
  id: string;
  name: string;
  document: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  exams?: any
}