import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTransaction1659363825972 implements MigrationInterface {
  name = 'AddedTransaction1659363825972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" character varying NOT NULL, "time" integer NOT NULL, "description" character varying NOT NULL, "mcc" integer NOT NULL, "original_mcc" integer NOT NULL, "hold" boolean NOT NULL, "amount" integer NOT NULL, "operation_amount" integer NOT NULL, "currency_code" integer NOT NULL, "commission_rate" integer NOT NULL, "cashback_amount" integer NOT NULL, "balance" integer NOT NULL, "comment" character varying NOT NULL, "receipt_id" character varying NOT NULL, "invoice_id" character varying NOT NULL, "counter_edrpou" character varying NOT NULL, "counter_iban" character varying NOT NULL, "account_id" character varying, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_e2652fa8c16723c83a00fb9b17e" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_e2652fa8c16723c83a00fb9b17e"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
