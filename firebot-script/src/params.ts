import { ParametersConfig } from '@crowbartools/firebot-custom-scripts-types/types/modules/firebot-parameters';

export const enum Responder {
  Bot = 'Bot',
  Streamer = 'Streamer',
}

export interface Params extends Record<string, unknown> {
  // enableAutoUpdate: boolean;
  ignoreRoles: string;
  ignoreUsernames: string;
  isEnabled: boolean;
  // populateDefaultPhrases: boolean;
  responseProbability: number;
  responder: string;
}

export function getDefaultParameters(): ParametersConfig<Params> {
  return {
    // enableAutoUpdate: {
    //   type: 'boolean',
    //   default: true,
    //   title: 'Enable Auto Update',
    //   description:
    //     'If enabled, Firebutt will automatically update itself whenever a new version is available.',
    // },
    ignoreRoles: {
      type: 'string',
      default: '',
      title: 'Ignore Roles',
      description:
        'A comma-separated list of roles that Firebutt will ignore when responding to messages.',
    },
    ignoreUsernames: {
      type: 'string',
      default: '',
      title: 'Ignore Usernames',
      description:
        'A comma-separated list of usernames that Firebutt will ignore when responding to messages.',
    },
    isEnabled: {
      type: 'boolean',
      default: true,
      title: 'Is Enabled',
      description:
        "Toggle to enable or disable Firebutt's responses to messages.",
    },
    // populateDefaultPhrases: {
    //   type: 'boolean',
    //   default: true,
    //   title: 'Populate Default Phrases',
    //   description:
    //     'If enabled, Firebutt will automatically load a set of default phrases into its dictionary. NOTE: Requires a restart to take effect.',
    // },
    responseProbability: {
      type: 'number',
      default: 15,
      title: 'Response Probability',
      description:
        'The likelihood (in percentage) that Firebutt will respond to a given message.',
    },
    responder: {
      type: 'chatter-select',
      default: Responder.Bot,
      title: 'Responder',
      description:
        'Select the account that Firebutt will use to send responses.',
    },
  };
}
