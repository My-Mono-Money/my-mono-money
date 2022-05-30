import { HashPasswordService } from 'src/layers/functionality/authentication/hashing/hash-password.service';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetDefaultUserPassword1653920063749 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashPasswordService = new HashPasswordService();
    const password = 'DummyPassword123!';
    const hash = await hashPasswordService.hashPassword({ password });

    await queryRunner.query(
      `UPDATE "user" SET "password_hash" = '${hash}' WHERE "user"."email" = 'ao.salenko+johnny.depp@gmail.com';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "user" SET "password_hash" = 'dummy pasword' WHERE "user"."email" = 'ao.salenko+johnny.depp@gmail.com';`,
    );
  }
}
