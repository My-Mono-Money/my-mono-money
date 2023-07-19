import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeatureFlagNewEnum1689746188244 implements MigrationInterface {
  name = 'AddFeatureFlagNewEnum1689746188244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."feature_flag_feature_name_enum" ADD VALUE 'verify_monobank_integration'`,
    );

    await queryRunner.query(
      `ALTER TABLE "feature_flag" ALTER COLUMN "feature_name" SET DEFAULT 'bypass_monobank_rate_limit'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."feature_flag_feature_name_enum" DROP VALUE 'verify_monobank_integration'`,
    );

    await queryRunner.query(
      `ALTER TABLE "feature_flag" ALTER COLUMN "feature_name" SET DEFAULT 'bypass_monobank_rate_limit'`,
    );
  }
}
