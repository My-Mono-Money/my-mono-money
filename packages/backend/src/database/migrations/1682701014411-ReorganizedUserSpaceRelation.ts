import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReorganizedUserSpaceRelation1682701014411
  implements MigrationInterface
{
  name = 'ReorganizedUserSpaceRelation1682701014411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "space" DROP CONSTRAINT "FK_9114b5dd2c691b98d7fa3f10b21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "space" DROP CONSTRAINT "REL_9114b5dd2c691b98d7fa3f10b2"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "own_space_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_58b24f11e95e79af2c264417e82" UNIQUE ("own_space_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_58b24f11e95e79af2c264417e82" FOREIGN KEY ("own_space_id") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `UPDATE "user" SET "own_space_id" = "space"."id" FROM "space" WHERE "space"."owner_id" = "user"."id"`,
    );
    await queryRunner.query(`ALTER TABLE "space" DROP COLUMN "owner_id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "own_space_id" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_58b24f11e95e79af2c264417e82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_58b24f11e95e79af2c264417e82"`,
    );
    await queryRunner.query(`ALTER TABLE "space" ADD "owner_id" uuid`);
    await queryRunner.query(
      `UPDATE "space" SET "owner_id" = "user"."id" FROM "user" WHERE "user"."own_space_id" = "space"."id"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "own_space_id"`);
    await queryRunner.query(
      `ALTER TABLE "space" ADD CONSTRAINT "REL_9114b5dd2c691b98d7fa3f10b2" UNIQUE ("owner_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "space" ADD CONSTRAINT "FK_9114b5dd2c691b98d7fa3f10b21" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
