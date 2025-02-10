import { TwitchChat } from '@crowbartools/firebot-custom-scripts-types/types/modules/twitch-chat';

export type TwitchChatExt = TwitchChat & {
  chatIsConnected(): boolean;
};
