import { FindManyOptions } from 'typeorm';

import { dataSource } from './data-source';
import { UsageStatistic } from './entities/usage-statistics';
import { newGuid } from './guid-handler';

const usageStatisticRepository = dataSource?.getRepository(UsageStatistic);

export async function addUsageStatistic({
  originalPhrase,
  replacementPhrase,
  user,
  originalMessage,
  replacementMessage,
  streamTitle,
  responseProbability,
}: {
  originalPhrase: string;
  replacementPhrase: string;
  user: string;
  originalMessage: string;
  replacementMessage: string;
  streamTitle: string;
  responseProbability: number;
}): Promise<UsageStatistic> {
  const { id, guid } = newGuid({ type: 'usage-statistic' });
  const usageStatistic = usageStatisticRepository.merge(new UsageStatistic(), {
    id,
    guid,
    originalPhrase,
    replacementPhrase,
    user,
    originalMessage,
    replacementMessage,
    streamTitle,
    responseProbability,
  });

  await usageStatisticRepository.save(usageStatistic);
  return usageStatistic;
}

export async function getUsageStatistic({
  id,
}: {
  id: string;
}): Promise<UsageStatistic | null> {
  return await usageStatisticRepository.findOne({ where: { id } });
}

export async function getUsageStatistics(
  options?: FindManyOptions<UsageStatistic> | undefined
): Promise<UsageStatistic[]> {
  return await usageStatisticRepository.find(options);
}
