import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDefaultSpace1682683817357 implements MigrationInterface {
  name = 'AddedDefaultSpace1682683817357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "default_space_id" uuid`);
    await queryRunner.query(
      `UPDATE "user" SET "default_space_id" = "space"."id" FROM "space" WHERE "space"."owner_id" = "user"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "default_space_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_1b20a93cc6473022272c2f60f54" FOREIGN KEY ("default_space_id") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_1b20a93cc6473022272c2f60f54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "default_space_id"`,
    );
  }
}
