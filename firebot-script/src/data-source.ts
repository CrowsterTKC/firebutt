import { DataSource } from 'typeorm';

import { Category } from './entities/categories';
import { Notification } from './entities/notification';
import { Phrase } from './entities/phrase';
import { UsageStatistic } from './entities/usage-statistics';
import { migrations } from './migrations/schema-migrations';
import { getEnvDatabaseLocation } from './utils/file-system';

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
  entities: [Category, Notification, Phrase, UsageStatistic],
  subscribers: [],
  migrations,
});
