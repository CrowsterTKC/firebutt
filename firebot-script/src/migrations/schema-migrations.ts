/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { MixedList } from 'typeorm';

import { CreatePhrases1738534201000 } from './20250202221001-create_phrases';
import { CreateUsageStatistics1738563561000 } from './20250203061921-create_usage_statistics';
import { MigrateLegacyJsonDbToSqljs1738602408488 } from './20250203090648-migrate_legacy_json_db_to_sqljs';
import { CreateNotifications1739290727420 } from './20250211081847-create_notifications';
// import statements above

export const migrations: MixedList<string | Function> = [
  CreatePhrases1738534201000,
  CreateUsageStatistics1738563561000,
  MigrateLegacyJsonDbToSqljs1738602408488,
  CreateNotifications1739290727420,
  // migration scripts above
];
