import { Entity, Column, ManyToOne, OneToMany, JoinColumn, RelationId, Index } from 'typeorm';
import { AuditableEntity } from '@domain/entities/auditable-entity';
import { PatientStatus } from '@domain/enums/patient-status.enum';
import { Exam } from './exam.entity';

@Entity('patient')
export class Patient extends AuditableEntity {
  @Column({ name: 'name', type: 'varchar', length: 150, nullable: false })
  name!: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false })
  email!: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password!: string;

  @Index('ux_patient_document', { unique: true })
  @Column({ name: 'document', type: 'varchar', length: 32 })
  document!: string;

  @Column({ name: 'status', type: 'smallint', nullable: false, enum: PatientStatus })
  status!: PatientStatus;

  @OneToMany(() => Exam, (exam) => exam.patient, { cascade: true, eager: true })
  exams?: Exam[] | null;
}
