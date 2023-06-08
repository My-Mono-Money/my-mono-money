import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewColumnsToMonobankToken1686064534229
  implements MigrationInterface
{
  name = 'AddNewColumnsToMonobankToken1686064534229';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "monobank_token" ADD "monobank_user_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "monobank_token" ADD "total_accounts" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "monobank_token" DROP COLUMN "total_accounts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "monobank_token" DROP COLUMN "monobank_user_name"`,
    );
  }
}
