import { MigrationInterface, QueryRunner } from 'typeorm';

import { newGuid } from '../guid-handler';

export class AddDefaultPhrases1743512080156 implements MigrationInterface {
  get name() {
    return 'AddDefaultPhrases1743512080156';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    const { id: phraseId, guid: phraseGuid } = newGuid({ type: 'phrase' });
    await queryRunner.query(
      `INSERT INTO phrases (id, guid, original_phrase, replacement_phrase, part_of_speech, expires_at, created_by_user, inserted_at, updated_at, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        phraseId,
        phraseGuid,
        JSON.stringify(['__butt__']),
        'butt',
        'NN',
        null,
        'Firebutt',
        new Date().toISOString(),
        new Date().toISOString(),
        JSON.stringify({ default: true }),
      ]
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `DELETE FROM phrases WHERE metadata->>'default' = 'true'`
    );
  }
}
