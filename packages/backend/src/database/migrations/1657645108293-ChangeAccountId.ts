import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAccountId1657645108293 implements MigrationInterface {
  name = 'ChangeAccountId1657645108293';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea"`,
    );
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "account" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea"`,
    );
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "account" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")`,
    );
  }
}
