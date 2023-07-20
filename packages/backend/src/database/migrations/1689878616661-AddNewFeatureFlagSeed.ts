import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewFeatureFlagSeed1689878616661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "feature_flag" ("feature_name", "is_enabled")
               VALUES ('verify_monobank_integration', false)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "feature_flag" WHERE "feature_name" = 'verify_monobank_integration'`,
    );
  }
}
