import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMonobankTokenImportAttempt1686219546874
  implements MigrationInterface
{
  name = 'CreateMonobankTokenImportAttempt1686219546874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."monobank_token_import_attempt_status_enum" AS ENUM('not_started', 'in_progress', 'failed', 'staled', 'successful')`,
    );
    await queryRunner.query(
      `CREATE TABLE "monobank_token_import_attempt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fetched_months" integer NOT NULL, "total_months" integer NOT NULL, "log" character varying NOT NULL, "status" "public"."monobank_token_import_attempt_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "token_id" uuid, CONSTRAINT "PK_3ea8541ffcb5b0d195342b5e702" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "monobank_token_import_attempt" ADD CONSTRAINT "FK_3de18c0369d1ea53f66dc8b28dc" FOREIGN KEY ("token_id") REFERENCES "monobank_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "monobank_token_import_attempt" DROP CONSTRAINT "FK_3de18c0369d1ea53f66dc8b28dc"`,
    );
    await queryRunner.query(`DROP TABLE "monobank_token_import_attempt"`);
    await queryRunner.query(
      `DROP TYPE "public"."monobank_token_import_attempt_status_enum"`,
    );
  }
}
