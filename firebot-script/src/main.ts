import {
  Firebot,
  RunRequest,
} from '@crowbartools/firebot-custom-scripts-types';
import { DataSource } from 'typeorm';

import { Firebutt } from './firebutt';
import { getDefaultParameters, Params } from './params';
import { author, description, formattedName, version } from '../package.json';
import { Notification } from './entities/notification';
import { Phrase } from './entities/phrase';
import { UsageStatistic } from './entities/usage-statistics';
import { migrations } from './migrations/schema-migrations';
import { getEnvDatabaseLocation } from './utils/file-system';

let dataSource: DataSource;
let firebutt: Firebutt;

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => ({
    name: formattedName,
    description,
    author,
    version,
    firebotVersion: '5',
    startupOnly: true,
    website: 'http://discord.crowstertkc.com',
  }),
  getDefaultParameters,
  parametersUpdated: (parameters: Params) => {
    firebutt.updateParameters(parameters);
  },
  run: async (runRequest: RunRequest<Params>) => {
    dataSource = new DataSource({
      type: 'sqljs',
      autoSave: true,
      location: getEnvDatabaseLocation('firebutt.db'),
      migrationsTableName: 'schema_migrations',
      metadataTableName: 'entity_metadata',
      migrationsRun: true,
      migrationsTransactionMode: 'each',
      logging: true,
      logger: 'simple-console',
      entities: [Notification, Phrase, UsageStatistic],
      subscribers: [],
      migrations,
    });
    await dataSource.initialize();
    firebutt = new Firebutt(runRequest, dataSource);
  },
  stop: () => {
    firebutt.unregister();
    dataSource.destroy();
  },
};

export default script;
