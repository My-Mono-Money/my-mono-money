import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeatureFlagNewEnum1689746188244 implements MigrationInterface {
  name = 'AddFeatureFlagNewEnum1689746188244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the existing "FeatureFlag" table if it exists
    await queryRunner.query(`DROP TABLE IF EXISTS "feature_flag"`);

    // Drop the existing ENUM type if it exists
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."feature_flag_feature_name_enum"`,
    );

    // Re-create the ENUM type with all the required values
    await queryRunner.query(
      `CREATE TYPE "public"."feature_flag_feature_name_enum" AS ENUM('bypass_monobank_rate_limit', 'verify_monobank_integration')`,
    );

    // Create the new "FeatureFlag" table with the updated enum
    await queryRunner.query(
      `CREATE TABLE "feature_flag" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "feature_name" "public"."feature_flag_feature_name_enum" NOT NULL,
        "is_enabled" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_f390205410d884907604a90c0f4" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "FeatureFlag" table if it exists
    await queryRunner.query(`DROP TABLE IF EXISTS "feature_flag"`);

    // Drop the updated ENUM type if it exists
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."feature_flag_feature_name_enum"`,
    );

    // Recreate the original ENUM type with one value
    await queryRunner.query(
      `CREATE TYPE "public"."feature_flag_feature_name_enum" AS ENUM('bypass_monobank_rate_limit')`,
    );

    // Recreate the "FeatureFlag" table with the original enum value
    await queryRunner.query(
      `CREATE TABLE "feature_flag" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "feature_name" "public"."feature_flag_feature_name_enum" NOT NULL,
        "is_enabled" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_f390205410d884907604a90c0f4" PRIMARY KEY ("id")
      )`,
    );
  }
}
