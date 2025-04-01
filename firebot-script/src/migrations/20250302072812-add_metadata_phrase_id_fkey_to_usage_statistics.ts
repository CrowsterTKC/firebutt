import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMetadataPhraseIdFkeyToUsageStatistics1740929292291
  implements MigrationInterface
{
  get name() {
    return 'AddMetadataPhraseIdFkeyToUsageStatistics1740929292291';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'usage_statistics',
      new TableColumn({
        name: 'metadata',
        type: 'json',
        isNullable: true,
      })
    );

    await queryRunner.query(
      `UPDATE usage_statistics SET metadata = (SELECT json_object('phrase_id', phrases.id, 'imported', true) FROM phrases WHERE phrases.replacement_phrase = usage_statistics.replacement_phrase and phrases.inserted_at < usage_statistics.inserted_at)`
    );

    await queryRunner.changeColumn(
      'usage_statistics',
      'metadata',
      new TableColumn({
        name: 'metadata',
        type: 'json',
        isNullable: false,
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('usage_statistics', 'metadata');
  }
}
