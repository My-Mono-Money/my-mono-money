import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ReCreateFeatureFlag1689771984542 implements MigrationInterface {
  name = 'ReCreateFeatureFlag1689771984542';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = 'feature_flag';

    const tableExist = await queryRunner.hasTable(tableName);

    if (tableExist) {
      await queryRunner.dropTable(tableName);
    }

    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'feature_name',
            type: 'enum',
            enum: ['bypass_monobank_rate_limit', 'verify_monobank_integration'],
            enumName: 'feature_flag_feature_name_enum',
          },
          {
            name: 'is_enabled',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('feature_flag', true);

    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."feature_flag_feature_name_enum"`,
    );
  }
}
