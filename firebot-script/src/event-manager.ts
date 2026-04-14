import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { EventSubSubscription } from '@twurple/eventsub-base';
import { EventSubWsListener } from '@twurple/eventsub-ws';

import { Firebutt } from './firebutt';
import { Params } from './params';
import { localConsole } from './utils/local-console';

let eventSubWsListener: EventSubWsListener;
const subscriptions: Array<EventSubSubscription> = [];

export async function register(
  { setCategory }: Firebutt,
  { firebot, modules }: Omit<RunRequest<Params>, 'trigger' | 'scriptDataDir'>
) {
  const {
    accounts: {
      streamer: { userId },
    },
  } = firebot;
  const { twitchApi } = modules;

  eventSubWsListener = new EventSubWsListener({
    apiClient: twitchApi.getClient(),
  });

  await eventSubWsListener.start();

  const channelUpdateSubscription = eventSubWsListener.onChannelUpdate(
    userId,
    async (event) => {
      localConsole.log(
        `Received channel update event for category "${event.categoryName}".`
      );
      setCategory(event.categoryName ?? 'unknown');
    }
  );

  subscriptions.push(channelUpdateSubscription);

  const response = await twitchApi.channels.getChannelInformation(userId);
  setCategory(response?.gameName ?? 'unknown');
}

export function unregister() {}
