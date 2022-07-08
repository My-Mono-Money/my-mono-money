import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSpaceForUser1656582406078 implements MigrationInterface {
  name = 'CreateSpaceForUser1656582406078';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO
        "space" (
            "owner_id"
        )
        SELECT "id" from "user"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "space"`);
  }
}
