import { Console } from 'node:console';

import { ScriptModules } from '@crowbartools/firebot-custom-scripts-types';

import { formattedName } from '../../package.json';

export let localConsole: Console;

export function redirectConsole({
  logger,
}: Pick<ScriptModules, 'logger'>): void {
  const originalConsole = new Console({
    stdout: process.stdout,
    stderr: process.stderr,
  });

  localConsole = {
    ...originalConsole,
    debug: (...args: unknown[]) => {
      logger.debug(`${formattedName}:`, ...args);
    },
    info: (...args: unknown[]) => {
      logger.info(`${formattedName}:`, ...args);
    },
    log: (...args: unknown[]) => {
      logger.info(`${formattedName}:`, ...args);
    },
    warn: (...args: unknown[]) => {
      logger.warn(`${formattedName}:`, ...args);
    },
    error: (...args: unknown[]) => {
      logger.error(`${formattedName}:`, ...args);
    },
  };
}
