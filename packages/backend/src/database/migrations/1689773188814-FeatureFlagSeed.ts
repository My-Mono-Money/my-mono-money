import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeatureFlagSeed1689773188814 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "feature_flag" ("feature_name", "is_enabled") VALUES ('bypass_monobank_rate_limit', true), ('verify_monobank_integration', true)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "feature_flag" WHERE "feature_name" IN ('bypass_monobank_rate_limit', 'verify_monobank_integration')`,
    );
  }
}
