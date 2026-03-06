import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { Request, Response } from 'express';

import { Firebutt } from '../firebutt';
import { getNotificationRepository } from '../notification-manager';
import { Params } from '../params';

export function crudNotifications(
  _: Firebutt,
  { modules }: Omit<RunRequest<Params>, 'trigger'>
) {
  const { httpServer } = modules;

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/notifications',
    'GET',
    async (req: Request, res: Response) => {
      const { id } = req.query as { id?: string };

      const notificationsBase = getNotificationRepository()
        .createQueryBuilder('notification')
        .select([
          'notification.id',
          'notification.guid',
          'notification.firebotId',
          'notification.title',
          'notification.message',
          'notification.type',
          'notification.metadata',
        ])
        .where(id ? 'notification.id = :id' : '', { id });

      const notifications =
        req.query['includeDeleted'] === 'true' || id
          ? await notificationsBase.withDeleted().getMany()
          : await notificationsBase.getMany();

      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          notifications,
        })
      );
    }
  );
}
