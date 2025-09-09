import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Patient } from './patient.entity';
import { DicomModality } from '@domain/enums/dicom-modality.enum';
import { AuditableEntity } from './auditable-entity';

@Entity('exam')
@Index('ux_exam_idempotency', ['idempotencyKey'], { unique: true })
export class Exam extends AuditableEntity {
  @Column({ name: 'patientid', type: 'uuid' })
  patientId!: string;

  @ManyToOne(() => Patient, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'patientid', referencedColumnName: 'id' })
  patient!: Patient;

  @Column({ name: 'modality', type: 'enum', enum: DicomModality })
  modality!: DicomModality;

  @Column({ name: 'idempotencykey', type: 'varchar', length: 128 })
  idempotencyKey!: string;

  @Column({ name: 'requestedat', type: 'timestamptz', nullable: true })
  requestedAt?: Date;
}
