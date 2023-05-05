import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpace1656580584768 implements MigrationInterface {
  name = 'AddSpace1656580584768';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "space" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "owner_id" uuid, CONSTRAINT "REL_9114b5dd2c691b98d7fa3f10b2" UNIQUE ("owner_id"), CONSTRAINT "PK_094f5ec727fe052956a11623640" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "space" ADD CONSTRAINT "FK_9114b5dd2c691b98d7fa3f10b21" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "space" DROP CONSTRAINT "FK_9114b5dd2c691b98d7fa3f10b21"`,
    );
    await queryRunner.query(`DROP TABLE "space"`);
  }
}
