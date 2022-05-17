import { User } from 'src/layers/storage/entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1652810503756 implements MigrationInterface {
  name = 'Seed1652810503756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<User>(User, {
        email: 'ao.salenko+johnny.depp@gmail.com',
        firstName: 'Джонні',
        lastName: 'Депп',
        passwordHash: 'dummy pasword',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "user" WHERE "email" = 'ao.salenko+johnny.depp@gmail.com'`,
    );
  }
}
