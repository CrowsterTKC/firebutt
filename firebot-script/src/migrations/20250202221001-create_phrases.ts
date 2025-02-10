import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePhrases1738534201000 implements MigrationInterface {
  get name() {
    return 'CreatePhrases1738534201000';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'phrases',
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
            type: 'text',
          },
          {
            name: 'replacement_phrase',
            type: 'varchar',
          },
          {
            name: 'part_of_speech',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expires_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'created_by_user',
            type: 'varchar',
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
          {
            name: 'deleted_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createIndices('phrases', [
      new TableIndex({
        columnNames: ['id'],
        isUnique: true,
      }),
      new TableIndex({
        columnNames: ['guid'],
        isUnique: true,
      }),
      new TableIndex({
        columnNames: ['original_phrase', 'deleted_at'],
        isUnique: true,
      }),
      new TableIndex({
        columnNames: ['part_of_speech', 'deleted_at'],
      }),
      new TableIndex({
        columnNames: ['expires_at', 'deleted_at'],
      }),
      new TableIndex({
        columnNames: ['deleted_at'],
      }),
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('phrases');
  }
}
