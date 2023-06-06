import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteDataTransactionAccountToken1686064385137
  implements MigrationInterface
{
  name = 'DeleteDataTransactionAccountToken1686064385137';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "transaction"');
    await queryRunner.query('DELETE FROM "account"');
    await queryRunner.query('DELETE FROM "monobank_token"');
    await queryRunner.query('DELETE FROM "space_member_invitation"');
  }

  public async down(): Promise<void> {
    // No need to implement the down method for data deletion
  }
}
