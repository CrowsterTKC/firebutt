import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCategories1778254461267 implements MigrationInterface {
  get name() {
    return 'CreateCategories1778254461267';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
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
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'is_enabled',
            type: 'boolean',
            default: true,
          },
          { name: 'order', type: 'int', default: 0 },
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

    await queryRunner.createIndices('categories', [
      new TableIndex({
        columnNames: ['id'],
        isUnique: true,
      }),
      new TableIndex({
        columnNames: ['guid'],
        isUnique: true,
      }),
      new TableIndex({
        columnNames: ['name', 'deleted_at'],
        isUnique: true,
      }),
      new TableIndex({
        columnNames: ['deleted_at'],
      }),
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categories');
  }
}
