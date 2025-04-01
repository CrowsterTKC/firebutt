import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { Request, Response } from 'express';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { Firebutt } from '../firebutt';
import { Params } from '../params';
import { getUsageStatistics } from '../usage-statistic';

export function rqUsageStatistics(
  firebutt: Firebutt,
  { modules }: Omit<RunRequest<Params>, 'trigger'>
) {
  const { httpServer } = modules;

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/usage-statistics',
    'GET',
    async (req: Request, res: Response) => {
      const { id, beginDate, endDate, ...rest } = req.query as {
        beginDate?: string;
        endDate?: string;
        id?: string;
        originalPhrase?: string;
        replacementPhrase?: string;
        streamTitle?: string;
        user?: string;
      };

      const whereClaue = id
        ? { id }
        : {
            ...(beginDate && {
              insertedAt: MoreThanOrEqual(new Date(beginDate)),
            }),
            ...(endDate && {
              insertedAt: LessThanOrEqual(new Date(endDate)),
            }),
            ...Object.entries(rest).reduce(
              (acc, [key, value]) => ({ ...acc, [key]: value }),
              {}
            ),
          };

      const stats = await getUsageStatistics({
        where: whereClaue,
      });

      const aggregatedStats = stats.reduce((acc, stat) => {
        const { replacementPhrase, insertedAt } = stat;
        const dateKey = insertedAt.toISOString().split('T')[0];

        if (!acc[dateKey]) {
          acc[dateKey] = {};
        }

        if (!acc[dateKey][replacementPhrase]) {
          acc[dateKey][replacementPhrase] = 0;
        }
        acc[dateKey][replacementPhrase] += 1;
        return acc;
      }, {} as UsageStatisticAggregated);

      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          aggregated: aggregatedStats,
          usage_statistics: stats,
        })
      );
    }
  );

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/usage-statistics/raw-query',
    'POST',
    async (req: Request, res: Response) => {
      const { query } = req.body as { query: string };

      const results = await firebutt.getDataSource().query(query);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(results));
    }
  );
}
