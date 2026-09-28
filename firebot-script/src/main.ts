import {
  Firebot,
  RunRequest,
} from '@crowbartools/firebot-custom-scripts-types';
import { DataSource } from 'typeorm';

import { dataSource as dataSourceProvider } from './data-source';
import { Firebutt } from './firebutt';
import { getDefaultParameters, Params } from './params';
import { author, description, formattedName, version } from '../package.json';

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
    dataSource = dataSourceProvider;
    await dataSource.initialize();
    firebutt = new Firebutt(runRequest, dataSource);
  },
  stop: () => {
    firebutt.unregister();
    dataSource.destroy();
  },
};

export default script;
