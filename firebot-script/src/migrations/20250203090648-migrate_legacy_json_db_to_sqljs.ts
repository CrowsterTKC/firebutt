import fs from 'fs';
import path from 'path';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  MigrationInterface,
  PrimaryColumn,
  QueryRunner,
  UpdateDateColumn,
} from 'typeorm';

import { newGuid } from '../guid-handler';
import { getFirebotProfileDataFolderPath } from '../utils/file-system';

type PhraseEntry = {
  replacementPhrase: string;
  partOfSpeech: string | null;
  expiresAt: Date | null;
  usageCount: number;
  createdByUser: string;
};

@Entity({ name: 'phrases' })
class Phrase {
  @PrimaryColumn()
  id!: string;

  @Column()
  guid!: string;

  @Column({ name: 'original_phrase', type: 'simple-json' })
  originalPhrase!: string[];

  @Column({ name: 'replacement_phrase' })
  replacementPhrase!: string;

  @Column({ name: 'part_of_speech', nullable: true, type: 'varchar' })
  partOfSpeech: string | null = null;

  @Column({ name: 'expires_at', nullable: true, type: 'datetime' })
  expiresAt: Date | null = null;

  @Column({ name: 'created_by_user' })
  createdByUser!: string;

  @CreateDateColumn({ name: 'inserted_at' })
  insertedAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null = null;
}

@Entity({ name: 'usage_statistics' })
class UsageStatistic {
  @PrimaryColumn()
  id!: string;

  @Column()
  guid!: string;

  @Column({ name: 'original_phrase' })
  originalPhrase!: string;

  @Column({ name: 'replacement_phrase' })
  replacementPhrase!: string;

  @Column()
  user!: string;

  @Column({ name: 'original_message' })
  originalMessage!: string;

  @Column({ name: 'replacement_message' })
  replacementMessage!: string;

  @Column({ name: 'stream_title' })
  streamTitle!: string;

  @Column({ name: 'response_probability' })
  responseProbability!: number;

  @CreateDateColumn({ name: 'inserted_at' })
  insertedAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

export class MigrateLegacyJsonDbToSqljs1738602408488
  implements MigrationInterface
{
  get name() {
    return 'MigrateLegacyJsonDbToSqljs1738602408488';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    const phraseRepository = queryRunner.manager.getRepository('Phrase');
    const usageStatisticRepository =
      queryRunner.manager.getRepository('UsageStatistic');

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
      const existingPhrase = await phraseRepository.findOne({
        where: { replacementPhrase: entry.replacementPhrase },
      });

      if (existingPhrase) {
        const updatedPhrase = phraseRepository.merge(existingPhrase, {
          originalPhrase: [...existingPhrase.originalPhrase, originalPhrase],
        });

        await phraseRepository.save(updatedPhrase);
      } else {
        const { id: phraseId, guid: phraseGuid } = newGuid({ type: 'phrase' });
        const newPhrase = phraseRepository.merge(new Phrase(), {
          id: phraseId,
          guid: phraseGuid,
          originalPhrase: [originalPhrase],
          replacementPhrase: entry.replacementPhrase,
          partOfSpeech: entry.partOfSpeech,
          expiresAt: entry.expiresAt,
          createdByUser: entry.createdByUser,
          insertedAt: new Date(0),
          updatedAt: new Date(),
        });

        await phraseRepository.save(newPhrase);
      }

      const nowISOString = new Date().toISOString();
      const updatedAtISOString = new Date().toISOString();

      for (let i = 0; i < entry.usageCount; i++) {
        const { id: statId, guid: statGuid } = newGuid({
          type: 'usage_statistic',
        });

        const newUsageStatistic = usageStatisticRepository.merge(
          new UsageStatistic(),
          {
            id: statId,
            guid: statGuid,
            originalPhrase: originalPhrase,
            replacementPhrase: entry.replacementPhrase,
            user: 'unknown',
            originalMessage: 'unknown',
            replacementMessage: 'unknown',
            streamTitle: 'unknown',
            responseProbability: 0.0,
            insertedAt: nowISOString,
            updatedAt: updatedAtISOString,
          }
        );
        await usageStatisticRepository.save(newUsageStatistic);
      }
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const phraseRepository = queryRunner.manager.getRepository('Phrase');
    const usageStatisticRepository =
      queryRunner.manager.getRepository('UsageStatistic');

    await phraseRepository.delete({ insertedAt: new Date(0).toISOString() });
    await usageStatisticRepository.delete({
      user: 'unknown',
      originalMessage: 'unknown',
      replacementMessage: 'unknown',
      streamTitle: 'unknown',
    });
  }
}
