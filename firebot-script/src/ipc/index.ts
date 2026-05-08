import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';

import { Firebutt } from '../firebutt';
import { Params } from '../params';
import { getPhrases } from './get-phrases';

export async function register(
  firebutt: Firebutt,
  runRequest: Omit<RunRequest<Params>, 'trigger' | 'scriptDataDir'>
) {
  await getPhrases(firebutt, runRequest);
}
