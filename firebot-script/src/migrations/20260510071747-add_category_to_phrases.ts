import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddCategoryToPhrases1778422667924 implements MigrationInterface {
  get name() {
    return 'AddCategoryToPhrases1778422667924';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'phrases',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    await queryRunner.createIndex(
      'phrases',
      new TableIndex({
        name: 'IDX_phrases_category_id',
        columnNames: ['category_id'],
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('phrases', 'IDX_phrases_category_id');
    await queryRunner.dropColumn('phrases', 'category_id');
  }
}
