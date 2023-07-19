import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeatureFlagDi1689745166576 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "feature_flag" ("feature_name", "is_enabled", "created_at", "updated_at") VALUES ('verify_monobank_integration', true, now(), now())`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "feature_flag" WHERE "feature_name" = 'verify_monobank_integration'`,
    );
  }
}
