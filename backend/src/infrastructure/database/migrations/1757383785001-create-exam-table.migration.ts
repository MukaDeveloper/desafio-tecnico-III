import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExamTable1757383785001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_modality_enum') THEN
          CREATE TYPE exam_modality_enum AS ENUM ('CR','CT','DX','MG','MR','NM','OT','PT','RF','US','XA');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS exam (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        patientid UUID NOT NULL,
        modality "exam_modality_enum" NOT NULL,
        idempotencyKey VARCHAR(128) NOT NULL,
        requestedat timestamptz NULL,
        createdat TIMESTAMPTZ NOT NULL DEFAULT now(),
        createdby VARCHAR(255) NOT NULL,
        updatedat TIMESTAMPTZ DEFAULT now(),
        updatedby VARCHAR(255),
        CONSTRAINT fk_exam_patient_patientid FOREIGN KEY (patientid) REFERENCES patient(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS ux_exam_idempotency ON exam (idempotencyKey);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS ux_exam_idempotency;`);
    await queryRunner.query(`DROP TABLE IF EXISTS exam;`);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_depend d ON d.refobjid = t.oid
          WHERE t.typname = 'exam_modality_enum'
        ) THEN
          DROP TYPE IF EXISTS exam_modality_enum;
        END IF;
      END
      $$;
    `);
  }
}
