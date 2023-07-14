import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCheckWebhookColumnsToMonobankToken16892544782651689254821277
  implements MigrationInterface
{
  name = 'AddCheckWebhookColumnsToMonobankToken16892544782651689254821277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "monobank_token" ADD "last_successful_webhook_validation_time" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."monobank_token_last_webhook_validation_status_enum" AS ENUM('active', 'error')`,
    );
    await queryRunner.query(
      `ALTER TABLE "monobank_token" ADD "last_webhook_validation_status" "public"."monobank_token_last_webhook_validation_status_enum" NOT NULL DEFAULT 'active'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "monobank_token" DROP COLUMN "last_webhook_validation_status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."monobank_token_last_webhook_validation_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "monobank_token" DROP COLUMN "last_successful_webhook_validation_time"`,
    );
  }
}
