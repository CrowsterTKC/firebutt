import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';

import { Firebutt } from './firebutt';
import { Params } from './params';

export async function registerFirebuttResponseProbablityReplaceVariable(
  firebutt: Firebutt,
  { modules: { replaceVariableManager } }: Omit<RunRequest<Params>, 'trigger'>
) {
  const firebotReplaceVariable: ReplaceVariable = {
    definition: {
      handle: 'firebuttResponseProbability',
      description: "Returns Firebutt's current response probability value.",
      categories: ['advanced', 'numbers'],
      possibleDataOutput: ['number'],
    },
    evaluator: () => {
      return firebutt.getParameters().responseProbability;
    },
  };

  replaceVariableManager.registerReplaceVariable(firebotReplaceVariable);
}
