import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeatureFlagSeed1686055368744 implements MigrationInterface {
  name = 'FeatureFlagSeed1686055368744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "feature_flag" ("feature_name", "is_enabled")
         VALUES ('bypass_monobank_rate_limit', true)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "feature_flag" WHERE "feature_name" = 'bypass_monobank_rate_limit'`,
    );
  }
}
