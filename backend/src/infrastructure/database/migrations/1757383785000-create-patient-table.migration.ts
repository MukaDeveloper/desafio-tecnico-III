import { MigrationInterface, QueryRunner } from 'typeorm';

export class PatientTable1757383785000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS patient (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        document VARCHAR(18) NOT NULL,
        status SMALLINT NOT NULL,
        createdat TIMESTAMPTZ NOT NULL DEFAULT now(),
        createdby VARCHAR(255) NOT NULL,
        updatedat TIMESTAMPTZ DEFAULT now(),
        updatedby VARCHAR(255) 
      );`);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS ux_patient_document ON patient (document);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS patient;`);
    await queryRunner.query(`DROP INDEX IF EXISTS ux_patient_document;`);
  }
}
