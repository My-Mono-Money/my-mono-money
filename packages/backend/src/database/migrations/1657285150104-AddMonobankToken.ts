import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMonobankToken1657285150104 implements MigrationInterface {
    name = 'AddMonobankToken1657285150104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "monobank_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "space_id_id" uuid, CONSTRAINT "PK_8054a49ccd3fe160e0fdca03ed7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "monobank_token" ADD CONSTRAINT "FK_43dc47bc3efb756fc8cd60f040b" FOREIGN KEY ("space_id_id") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monobank_token" DROP CONSTRAINT "FK_43dc47bc3efb756fc8cd60f040b"`);
        await queryRunner.query(`DROP TABLE "monobank_token"`);
    }

}
