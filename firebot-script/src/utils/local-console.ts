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
      logger.debug(`${formattedName}: ${args.map(String).join(' ')}`);
    },
    info: (...args: unknown[]) => {
      logger.info(`${formattedName}: ${args.map(String).join(' ')}`);
    },
    log: (...args: unknown[]) => {
      logger.info(`${formattedName}: ${args.map(String).join(' ')}`);
    },
    warn: (...args: unknown[]) => {
      logger.warn(`${formattedName}: ${args.map(String).join(' ')}`);
    },
    error: (...args: unknown[]) => {
      logger.error(`${formattedName}: ${args.map(String).join(' ')}`);
    },
  };
}
