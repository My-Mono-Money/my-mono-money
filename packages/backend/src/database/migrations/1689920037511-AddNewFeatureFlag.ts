import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewFeatureFlag1689920037511 implements MigrationInterface {
  name = 'AddNewFeatureFlag1689920037511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."feature_flag_feature_name_enum" RENAME TO "feature_flag_feature_name_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."feature_flag_feature_name_enum" AS ENUM('bypass_monobank_rate_limit', 'verify_monobank_integration')`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_flag" ALTER COLUMN "feature_name" TYPE "public"."feature_flag_feature_name_enum" USING "feature_name"::"text"::"public"."feature_flag_feature_name_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."feature_flag_feature_name_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."feature_flag_feature_name_enum_old" AS ENUM('bypass_monobank_rate_limit')`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_flag" ALTER COLUMN "feature_name" TYPE "public"."feature_flag_feature_name_enum_old" USING "feature_name"::"text"::"public"."feature_flag_feature_name_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."feature_flag_feature_name_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."feature_flag_feature_name_enum_old" RENAME TO "feature_flag_feature_name_enum"`,
    );
  }
}
