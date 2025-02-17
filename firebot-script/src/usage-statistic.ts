/* eslint-disable @typescript-eslint/no-unused-vars */
import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { FindManyOptions, Repository } from 'typeorm';

import { UsageStatistic } from './entities/usage-statistics';
import { Firebutt } from './firebutt';
import { newGuid } from './guid-handler';
import { Params } from './params';

let usageStatisticRepository: Repository<UsageStatistic> =
  null as unknown as Repository<UsageStatistic>;

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

export async function register(
  firebutt: Firebutt,
  _: Omit<RunRequest<Params>, 'trigger'>
) {
  usageStatisticRepository = firebutt
    .getDataSource()
    .getRepository(UsageStatistic);
}
