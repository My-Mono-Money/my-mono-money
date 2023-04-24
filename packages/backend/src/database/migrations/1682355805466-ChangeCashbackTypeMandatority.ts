import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCashbackTypeMandatority1682355805466
  implements MigrationInterface
{
  name = 'ChangeCashbackTypeMandatority1682355805466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "cashback_type" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "cashback_type" SET NOT NULL`,
    );
  }
}
