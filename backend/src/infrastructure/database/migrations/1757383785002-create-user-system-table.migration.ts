import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserSystemTable1757383785002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS usersystem (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        status SMALLINT NOT NULL,
        createdat TIMESTAMPTZ NOT NULL,
        createdby VARCHAR(255) NOT NULL,
        updatedat TIMESTAMPTZ ,
        updatedby VARCHAR(255) 
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS usersystem;`);
  }
}
