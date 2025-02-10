import {
  Firebot,
  RunRequest,
} from '@crowbartools/firebot-custom-scripts-types';

import { Firebutt } from './firebutt';
import { getDefaultParameters, Params } from './params';
import { author, description, formattedName, version } from '../package.json';

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
  run: (runRequest: RunRequest<Params>) => {
    firebutt = new Firebutt(runRequest);
  },
  stop: () => {
    firebutt.cleanup();
  },
};

export default script;
