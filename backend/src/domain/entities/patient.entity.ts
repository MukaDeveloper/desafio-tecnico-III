import { Entity, Column, OneToMany, Index } from 'typeorm';
import { AuditableEntity } from '@domain/entities/auditable-entity';
import { Exam } from './exam.entity';

@Entity('patient')
export class Patient extends AuditableEntity {
  @Column({ name: 'name', type: 'varchar', length: 150, nullable: false })
  name!: string;

  @Index('ux_patient_document', { unique: true })
  @Column({ name: 'document', type: 'varchar', length: 32 })
  document!: string;

  @OneToMany(() => Exam, (exam) => exam.patient, { eager: false, nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  exams?: Exam[] | null;
}
