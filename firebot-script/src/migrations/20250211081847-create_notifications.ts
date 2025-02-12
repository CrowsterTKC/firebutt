import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateNotifications1739290727420 implements MigrationInterface {
  get name(): string {
    return 'CreateNotifications1739290727420';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'guid',
            type: 'varchar',
          },
          {
            name: 'firebot_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'message',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'inserted_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createIndices('notifications', [
      new TableIndex({
        columnNames: ['id'],
        isUnique: true,
      }),
      new TableIndex({
        columnNames: ['guid'],
        isUnique: true,
      }),
      new TableIndex({
        columnNames: ['firebot_id'],
        isUnique: true,
      }),
      new TableIndex({
        columnNames: ['deleted_at'],
      }),
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications');
  }
}
