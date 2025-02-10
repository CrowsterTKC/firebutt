import path from 'path';

import { DataSource } from 'typeorm';

import { Phrase } from './entities/phrase';
import { UsageStatistic } from './entities/usage-statistics';
import { migrations } from './migrations/schema-migrations';
import { getFirebotProfileDataFolderPath } from './utils/file-system';

export const dataSource = new DataSource({
  type: 'sqljs',
  autoSave: true,
  location: getEnvDatabaseLocation('firebutt.db'),
  migrationsTableName: 'schema_migrations',
  metadataTableName: 'entity_metadata',
  migrationsRun: true,
  migrationsTransactionMode: 'each',
  logging: true,
  logger: 'simple-console',
  entities: [Phrase, UsageStatistic],
  subscribers: [],
  migrations,
});

export async function runQuery(query: string): Promise<void> {
  await dataSource.query(query);
}

function getEnvDatabaseLocation(fileName: string): string {
  switch (process.env.NODE_ENV) {
    case 'development':
    case 'test':
      return path.join(
        __dirname,
        '../../data',
        `${process.env.NODE_ENV}_${fileName}`
      );
    default:
    case 'production':
      return path.join(getFirebotProfileDataFolderPath(), fileName);
  }
}
