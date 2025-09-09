import { CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class AuditableEntity {
  @Column({ name: 'id', type: 'uuid', primary: true, generated: false })
  id!: string;

  @CreateDateColumn({ name: 'createdat' })
  createdAt!: Date;

  @Column({ name: 'createdby', type: 'varchar', length: 255 })
  createdBy!: string;

  @UpdateDateColumn({ name: 'updatedat', nullable: true })
  updatedAt?: Date | null;

  @Column({ name: 'updatedby', type: 'varchar', length: 255, nullable: true })
  updatedBy?: string | null;
}
