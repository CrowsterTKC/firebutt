import fs from 'fs';
import path from 'path';

import { MigrationInterface, QueryRunner } from 'typeorm';

import { newGuid } from '../guid-handler';
import { getFirebotProfileDataFolderPath } from '../utils/file-system';

type PhraseEntry = {
  replacementPhrase: string;
  partOfSpeech: string | null;
  expiresAt: Date | null;
  usageCount: number;
  createdByUser: string;
};

interface Phrase {
  id: string;
  guid: string;
  original_phrase: string;
  replacement_phrase: string;
  part_of_speech: string | null;
  expires_at: Date | null;
  created_by_user: string;
  inserted_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export class MigrateLegacyJsonDbToSqljs1738602408488
  implements MigrationInterface
{
  get name() {
    return 'MigrateLegacyJsonDbToSqljs1738602408488';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    const filePath = path.join(
      getFirebotProfileDataFolderPath(),
      'firebutt.json'
    );

    if (!fs.existsSync(filePath)) {
      return;
    }

    const data: Record<string, PhraseEntry> = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    );

    for (const [originalPhrase, entry] of Object.entries(data)) {
      const existingPhrases = (await queryRunner.query(
        'SELECT * FROM phrases WHERE replacement_phrase = ? AND deleted_at IS NULL',
        [entry.replacementPhrase]
      )) as Phrase[];

      if (existingPhrases.length > 0) {
        for (const existingPhrase of existingPhrases) {
          await queryRunner.query(
            'UPDATE phrases SET original_phrase = ? WHERE id = ?',
            [
              JSON.stringify([
                ...JSON.parse(existingPhrase.original_phrase),
                originalPhrase,
              ]),
              existingPhrase.id,
            ]
          );
        }
      } else {
        const { id: phraseId, guid: phraseGuid } = newGuid({ type: 'phrase' });
        await queryRunner.query(
          `INSERT INTO phrases (id, guid, original_phrase, replacement_phrase, part_of_speech, expires_at, created_by_user, inserted_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            phraseId,
            phraseGuid,
            JSON.stringify([originalPhrase]),
            entry.replacementPhrase,
            entry.partOfSpeech,
            entry.expiresAt,
            entry.createdByUser,
            new Date(0).toISOString(),
            new Date().toISOString(),
          ]
        );
      }

      const nowISOString = new Date().toISOString();
      const updatedAtISOString = new Date().toISOString();

      for (let i = 0; i < entry.usageCount; i++) {
        const { id: statId, guid: statGuid } = newGuid({
          type: 'usage_statistic',
        });

        await queryRunner.query(
          `INSERT INTO usage_statistics (id, guid, original_phrase, replacement_phrase, user, original_message, replacement_message, stream_title, response_probability, inserted_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            statId,
            statGuid,
            originalPhrase,
            entry.replacementPhrase,
            'unknown',
            'unknown',
            'unknown',
            'unknown',
            0.0,
            nowISOString,
            updatedAtISOString,
          ]
        );
      }
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM phrases WHERE inserted_at = ?', [
      new Date(0).toISOString(),
    ]);
    await queryRunner.query(
      'DELETE FROM usage_statistics WHERE user = ? AND original_message = ? AND replacement_message = ? AND stream_title = ?',
      ['unknown', 'unknown', 'unknown', 'unknown']
    );
  }
}
