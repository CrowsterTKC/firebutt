import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMetadataToPhrases1743510827528 implements MigrationInterface {
  get name() {
    return 'AddMetadataToPhrases1743510827528';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'phrases',
      new TableColumn({
        name: 'metadata',
        type: 'json',
        isNullable: true,
      })
    );

    await queryRunner.query(
      `UPDATE phrases SET metadata = json_object('imported', true)`
    );

    await queryRunner.changeColumn(
      'phrases',
      'metadata',
      new TableColumn({
        name: 'metadata',
        type: 'json',
        isNullable: false,
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('phrases', 'metadata');
  }
}
