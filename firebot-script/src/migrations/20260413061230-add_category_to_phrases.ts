import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddCategoryToPhrases1776085950688 implements MigrationInterface {
  get name() {
    return 'AddCategoryToPhrases1776085950688';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'phrases',
      new TableColumn({
        name: 'category',
        type: 'text',
        isNullable: true,
      })
    );

    await queryRunner.createIndices('phrases', [
      new TableIndex({
        columnNames: ['category'],
      }),
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('phrases', 'IDX_phrases_category');
    await queryRunner.dropColumn('phrases', 'category');
  }
}
