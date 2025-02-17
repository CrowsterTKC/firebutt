import { match, P } from 'ts-pattern';
import { v4 as uuid } from 'uuid';

import { Notification } from './entities/notification';
import { Phrase } from './entities/phrase';
import { UsageStatistic } from './entities/usage-statistics';
import { getNotification } from './notification-manager';
import { getPhrase } from './phrase-manager';
import {
  NewGuidProps,
  NewGuidResponse,
  ObjectFromGuidProps,
} from './types/guid-handler';
import { getUsageStatistic } from './usage-statistic';

const GUID_ROOT_IDENTIFIER = 'fbr';

export function newGuid({
  type,
  parentGuid = '',
}: NewGuidProps): NewGuidResponse {
  parentGuid = parentGuid.replace(`${GUID_ROOT_IDENTIFIER}::`, '');
  const id = uuid();
  const guid = `${GUID_ROOT_IDENTIFIER}::${
    parentGuid !== '' ? `${parentGuid}:` : ''
  }${type}:${id}`;

  return { id, guid };
}

export async function objectFromGuid({
  guid,
}: ObjectFromGuidProps): Promise<
  Notification | Phrase | UsageStatistic | null
> {
  const [guidTail] = parseGuidForProcessing(guid).reverse();

  const object = match(guidTail)
    .with(
      { id: P.select(), type: 'notification' },
      async (id) => await getNotification({ id })
    )
    .with(
      { id: P.select(), type: 'phrase' },
      async (id) => await getPhrase({ id })
    )
    .with(
      { id: P.select(), type: 'usage_statistic' },
      async (id) => await getUsageStatistic({ id })
    )
    .otherwise(() => null);

  return object;
}

function parseGuidForProcessing(
  guid: string
): Array<{ id: string; type: string }> {
  const [identifier, ...guidElements] = guid
    .split(
      /([a-zA-Z-_]*:[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})/g
    )
    .filter((element) => element !== '' && element !== ':');

  if (!identifier.startsWith(GUID_ROOT_IDENTIFIER)) {
    return [{ id: '', type: 'unknown' }];
  }

  return guidElements.map((element) => {
    const [guidType, id] = element.split(':');
    return { id, type: guidType };
  });
}
