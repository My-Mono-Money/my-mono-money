import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeatureFlag1686054414159 implements MigrationInterface {
  name = 'AddFeatureFlag1686054414159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."feature_flag_feature_name_enum" AS ENUM('bypass_monobank_rate_limit')`,
    );
    await queryRunner.query(
      `CREATE TABLE "feature_flag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "feature_name" "public"."feature_flag_feature_name_enum" NOT NULL, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f390205410d884907604a90c0f4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "feature_flag"`);
    await queryRunner.query(
      `DROP TYPE "public"."feature_flag_feature_name_enum"`,
    );
  }
}
