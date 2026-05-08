import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';

import { Firebutt } from '../firebutt';
import { Params } from '../params';
import { getPhrases as getPhrasesFromManager } from '../phrase-manager';
import { localConsole } from '../utils/local-console';

export function getPhrases(
  _: Firebutt,
  { modules }: Omit<RunRequest<Params>, 'trigger' | 'scriptDataDir'>
) {
  const { frontendCommunicator } = modules;
  frontendCommunicator.onAsync('firebutt:get-phrases', async () => {
    try {
      const phrases = await getPhrasesFromManager();
      return { phrases, success: true };
    } catch (error) {
      localConsole.error('Error getting phrases:', error);
      return {
        phrases: [],
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });
  localConsole.log('firebutt:get-phrases handler registered');
}
