import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1652810503756 implements MigrationInterface {
  name = 'Seed1652810503756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO
        "user" (
          "email",
          "password_hash",
          "first_name",
          "last_name"
        )
        VALUES (
          'ao.salenko+johnny.depp@gmail.com',
          'dummy pasword',
          'Джонні',
          'Депп'
        )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "user" WHERE "email" = 'ao.salenko+johnny.depp@gmail.com'`,
    );
  }
}
