import fs from 'fs';
import path from 'path';

import {
  RunRequest,
  RunRequestParameters,
  ScriptModules,
} from '@crowbartools/firebot-custom-scripts-types';
import { Config, JsonDB } from 'node-json-db';
import { DataSource } from 'typeorm';

import {
  register as registerChatClient,
  unregister as unregisterChatClient,
} from './chat-client';
import {
  registerFirebuttAddRemovePhraseEffectType,
  registerFirebuttUpdateResponseProbablityEffectType,
} from './custom-effect';
import { formattedName, scriptOutputName } from '../package.json';
import { Params } from './params';
import {
  register as registerPhraseManager,
  unregister as unregisterPhraseManager,
} from './phrase-manager';
import { getFirebotProfileDataFolderPath } from './utils/file-system';

export class Firebutt {
  private _dataSource: DataSource;
  private _firebot: RunRequest<Params>['firebot'];
  private _modules: ScriptModules;
  private _parameters: RunRequestParameters<Params>;
  private _scriptId: string;
  private _startupScriptConfigDb: JsonDB;

  constructor(
    { firebot, parameters, modules }: RunRequest<Params>,
    dataSource: DataSource
  ) {
    this._dataSource = dataSource;
    this._firebot = firebot;
    this._modules = modules;
    this._parameters = parameters;
    this._scriptId = this.getScriptIdFromFile();
    this._startupScriptConfigDb = new JsonDB(
      new Config(
        path.join(
          getFirebotProfileDataFolderPath(),
          'startup-scripts-config.json'
        ),
        true,
        true,
        '/'
      )
    );
    (async () => await this.register())();
  }

  getDataSource() {
    return this._dataSource;
  }

  getParameters() {
    return this._parameters;
  }

  getScriptIdFromFile() {
    const startupScriptConfigPath = path.join(
      getFirebotProfileDataFolderPath(),
      'startup-scripts-config.json'
    );

    if (!fs.existsSync(startupScriptConfigPath)) {
      return '';
    }

    const startupScriptConfig = JSON.parse(
      fs.readFileSync(startupScriptConfigPath, 'utf8')
    ) as ScriptParameters;

    const [id] =
      Object.entries(startupScriptConfig).find(([, { scriptName }]) => {
        return scriptName === `${scriptOutputName}.js`;
      }) ?? [];

    return id ?? '';
  }

  async register() {
    const { logger } = this._modules;
    this.redirectConsole();

    try {
      await registerPhraseManager(this, {
        firebot: this._firebot,
        modules: this._modules,
        parameters: this._parameters,
      });
      await registerChatClient(this, {
        firebot: this._firebot,
        modules: this._modules,
        parameters: this._parameters,
      });
      await registerFirebuttAddRemovePhraseEffectType(this, {
        firebot: this._firebot,
        modules: this._modules,
        parameters: this._parameters,
      });
      await registerFirebuttUpdateResponseProbablityEffectType(this, {
        firebot: this._firebot,
        modules: this._modules,
        parameters: this._parameters,
      });

      logger.info('Firebutt registered successfully');
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          'Failed to register Firebutt\n',
          error.message.replace(/\\n/g, '\n\t'),
          error.stack?.replace(/\\n/g, '\n\t')
        );
      } else {
        logger.error('Failed to register Firebutt', error);
      }
    }
  }

  redirectConsole() {
    const { logger } = this._modules;
    const originalConsole = console;

    console = {
      ...originalConsole,
      debug: (...args: unknown[]) => {
        logger.info(`${formattedName}:`, ...args);
      },
      info: (...args: unknown[]) => {
        logger.info(`${formattedName}:`, ...args);
      },
      log: (...args: unknown[]) => {
        logger.info(`${formattedName}:`, ...args);
      },
      error: (...args: unknown[]) => {
        logger.error(`${formattedName}:`, ...args);
      },
      warn: (...args: unknown[]) => {
        logger.warn(`${formattedName}:`, ...args);
      },
    };
  }

  unregister() {
    const { logger } = this._modules;

    try {
      unregisterChatClient();
      unregisterPhraseManager();
      logger.info('Firebutt unregistered successfully');
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          'Failed to unregister Firebutt\n',
          error.message.replace(/\\n/g, '\n\t'),
          error.stack?.replace(/\\n/g, '\n\t')
        );
      } else {
        logger.error('Failed to unregister Firebutt', error);
      }
    }
  }

  updateParameters(params: Partial<Params>, saveDb: boolean = false) {
    this._parameters = { ...this._parameters, ...params };

    if (saveDb) {
      for (const [key, value] of Object.entries(this._parameters)) {
        this._startupScriptConfigDb.push(
          `/${this._scriptId}/parameters/${key}/value`,
          value
        );
      }
    }
  }
}
