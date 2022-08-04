import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccount1657287850180 implements MigrationInterface {
  name = 'AddAccount1657287850180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "send_id" character varying NOT NULL, "currency_code" integer NOT NULL, "cashback_type" character varying NOT NULL, "balance" integer NOT NULL, "credit_limit" integer NOT NULL, "masked_pan" character varying array NOT NULL, "type" character varying NOT NULL, "iban" character varying NOT NULL, "token_id" uuid, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_a55842d3341d42534e39f85e931" FOREIGN KEY ("token_id") REFERENCES "monobank_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_a55842d3341d42534e39f85e931"`,
    );
    await queryRunner.query(`DROP TABLE "account"`);
  }
}
