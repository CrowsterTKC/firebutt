import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import semver from 'semver';
import { FindOneOptions, Repository } from 'typeorm';

import { Notification } from './entities/notification';
import { Firebutt } from './firebutt';
import { newGuid } from './guid-handler';
import { Params } from './params';
import { version } from '../package.json';

enum NotificationType {
  INFO = 'info',
  TIP = 'tip',
  UPDATE = 'update',
  ALERT = 'alert',
}

const NOTIFCATION_URL =
  'https://raw.githubusercontent.com/CrowsterTKC/main/firebot-script/public/notifications.json';
let notificationRepository: Repository<Notification> =
  null as unknown as Repository<Notification>;
let checkForNotificationsJob: NodeJS.Timeout | null = null;

export async function addNotification(
  { modules }: Omit<RunRequest<Params>, 'trigger'>,
  {
    id: remoteId,
    guid: remoteGuid,
    title,
    message,
    type,
    metadata,
  }: Omit<Notification, 'firebotId | insertedAt |  updatedAt | deletedAt'>
): Promise<Notification | undefined> {
  try {
    const existingNotification = await getNotificationsBy('metadata', {
      remoteId,
    });

    if (
      (metadata?.version &&
        !semver.satisfies(version, metadata.version as string)) ||
      (existingNotification?.length || 0) > 0
    ) {
      return;
    }

    const { id, guid } = newGuid({ type: 'notification' });
    const firebotNotification = modules.notificationManager.addNotification(
      {
        title,
        message,
        type: NotificationType[type as keyof typeof NotificationType],
        metadata: { ...metadata, remoteId, remoteGuid },
      },
      (metadata?.permanentlySave as boolean) ?? false
    );

    const newNotification = notificationRepository.merge(new Notification(), {
      id,
      guid,
      firebotId: firebotNotification.id,
      title,
      message,
      type,
      metadata: { ...metadata, remoteId, remoteGuid },
    });
    await notificationRepository.save(newNotification);
    return newNotification;
  } catch (error) {
    if (error instanceof Error) {
      modules.logger.error('addNotification:', error.message, error.stack);
    } else {
      modules.logger.error('addNotification:', error);
    }
  }
}

export async function deleteNotification(id: string): Promise<boolean> {
  const deleted = await notificationRepository.softDelete(id);
  return deleted.affected === 1;
}

export async function getNotification({
  id,
}: {
  id: string;
}): Promise<Notification | null> {
  return await notificationRepository.findOne({ where: { id } });
}

export async function getNotifications(): Promise<Notification[]> {
  return await notificationRepository.find();
}

export async function getNotificationsBy(
  key: keyof Notification,
  value: unknown,
  options?: FindOneOptions<Notification>
): Promise<Notification[] | null> {
  if (key === 'metadata') {
    return await notificationRepository
      .createQueryBuilder('notifications')
      .where('json_extract(notifications.metadata, :key) = :value', {
        key: `$.${Object.keys(value as object)[0]}`,
        value: Object.values(value as object)[0],
      })
      .getMany();
  }

  return await notificationRepository.find({
    where: { [key]: value },
    ...options,
  });
}

export async function register(
  firebutt: Firebutt,
  { firebot, modules, parameters }: Omit<RunRequest<Params>, 'trigger'>
) {
  notificationRepository = firebutt.getDataSource().getRepository(Notification);
  checkForNotificationsJob = setInterval(
    async () => {
      console.log('Running checkForNotificationsJob');
      await checkForNotifications({ firebot, modules, parameters });
    },
    1 * 60 * 1000
  );
}

export function unregister() {
  if (checkForNotificationsJob) {
    clearInterval(checkForNotificationsJob);
    checkForNotificationsJob = null;
  }
}

async function checkForNotifications({
  firebot,
  modules,
  parameters,
}: Omit<RunRequest<Params>, 'trigger'>) {
  const notifications = (await (await fetch(NOTIFCATION_URL)).json()) as Omit<
    Notification,
    'firebotId | insertedAt | updatedAt | deletedAt'
  >[];

  if (notifications) {
    notifications.forEach(async (notification) => {
      await addNotification({ firebot, modules, parameters }, notification);
    });
  }
}
