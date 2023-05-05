import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSpaceMemberInvitation1683033049558
  implements MigrationInterface
{
  name = 'CreateSpaceMemberInvitation1683033049558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."space_member_invitation_status_enum" AS ENUM('new', 'accept', 'reject')`,
    );
    await queryRunner.query(
      `CREATE TABLE "space_member_invitation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT timezone('utc', now()), "updated_at" TIMESTAMP NOT NULL DEFAULT timezone('utc', now()), "status" "public"."space_member_invitation_status_enum" NOT NULL, "space_id" uuid, CONSTRAINT "UQ_4a8e8b63e2d90c9dcaca92cbd1c" UNIQUE ("email", "space_id"), CONSTRAINT "PK_c70e81bea276d29e8ac4236b031" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "space_member_invitation" ADD CONSTRAINT "FK_8d67aa4fdc0d5ce8415d9819f67" FOREIGN KEY ("space_id") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "space_member_invitation" DROP CONSTRAINT "FK_8d67aa4fdc0d5ce8415d9819f67"`,
    );
    await queryRunner.query(`DROP TABLE "space_member_invitation"`);
    await queryRunner.query(
      `DROP TYPE "public"."space_member_invitation_status_enum"`,
    );
  }
}
