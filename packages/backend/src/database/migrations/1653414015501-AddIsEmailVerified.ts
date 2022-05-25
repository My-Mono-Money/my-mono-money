import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsEmailVerified1653414015501 implements MigrationInterface {
  name = 'AddIsEmailVerified1653414015501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_email_verified" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "is_email_verified"`,
    );
  }
}
