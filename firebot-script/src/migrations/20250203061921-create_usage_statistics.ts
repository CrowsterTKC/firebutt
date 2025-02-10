import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsageStatistics1738563561000 implements MigrationInterface {
  get name() {
    return 'CreateUsageStatistics1738563561000';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usage_statistics',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'guid',
            type: 'varchar',
          },
          {
            name: 'original_phrase',
            type: 'varchar',
          },
          {
            name: 'replacement_phrase',
            type: 'varchar',
          },
          {
            name: 'user',
            type: 'varchar',
          },
          {
            name: 'original_message',
            type: 'text',
          },
          {
            name: 'replacement_message',
            type: 'text',
          },
          {
            name: 'stream_title',
            type: 'varchar',
          },
          {
            name: 'response_probability',
            type: 'float',
          },
          {
            name: 'inserted_at',
            type: 'datetime',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'now()',
          },
        ],
      })
    );

    await queryRunner.createIndices('usage_statistics', [
      new TableIndex({
        columnNames: ['id'],
        isUnique: true,
      }),
      new TableIndex({
        columnNames: ['guid'],
        isUnique: true,
      }),
      new TableIndex({
        columnNames: ['original_phrase'],
      }),
      new TableIndex({
        columnNames: ['replacement_phrase'],
      }),
      new TableIndex({
        columnNames: ['user'],
      }),
      new TableIndex({
        columnNames: ['stream_title'],
      }),
      new TableIndex({
        columnNames: ['inserted_at'],
      }),
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usage_statistics');
  }
}
