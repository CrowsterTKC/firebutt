import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { ChatClient, ChatMessage } from '@twurple/chat';
import { plural } from 'pluralize';
import { Lexer, Tagger } from 'pos';

import { Phrase } from './entities/phrase';
import { Firebutt } from './firebutt';
import { Params, Responder } from './params';
import { getPhraseCache } from './phrase-manager';
import { addUsageStatistic } from './usage-statistic';

let chatClient: ChatClient;

export function register(
  _: Firebutt,
  { firebot, modules, parameters }: Omit<RunRequest<Params>, 'trigger'>,
  postProcessor: (
    runRequest: Omit<RunRequest<Params>, 'trigger'>,
    message: string
  ) => string = (_, message) => message
) {
  const { logger, twitchApi } = modules;
  chatClient = new ChatClient({
    authProvider: twitchApi.getClient()._authProvider,
    channels: [firebot.accounts.streamer.username],
  });
  chatClient.connect();

  chatClient.onMessage(
    async (_, user, messageText, chatMessage) =>
      await execute(
        { firebot, modules, parameters },
        user,
        messageText,
        chatMessage,
        postProcessor
      ).catch((error) => {
        if (error instanceof Error) {
          logger.error('Firebutt:', error.message);
        } else if (typeof error === 'string') {
          logger.error('Firebutt:', error);
        }
      })
  );
}

async function execute(
  runRequest: Omit<RunRequest<Params>, 'trigger'>,
  user: string,
  messageText: string,
  chatMessage: ChatMessage,
  postProcessor: (
    runRequest: Omit<RunRequest<Params>, 'trigger'>,
    message: string
  ) => string
) {
  const {
    firebot: {
      accounts: { bot, streamer },
    },
    parameters,
    modules: { twitchApi, userDb: UserDb, utils: Utils },
  } = runRequest;

  const { ignoreRoles, ignoreUsernames, responder, responseProbability } =
    parameters as Params;

  const ignoreRolesArray = ignoreRoles.split(',').map((role) => role.trim());
  const ignoreUsernamesArray = ignoreUsernames
    .split(',')
    .map((user) => user.toLowerCase().trim());
  const userRoles =
    (await UserDb.getTwitchUserByUsername(user))?.twitchRoles.map((role) =>
      role.toLowerCase()
    ) || [];

  ignoreUsernamesArray.push(
    responder && bot.loggedIn ? bot.username : streamer.username
  );

  if (
    userRoles.some((role) => ignoreRolesArray.includes(role)) ||
    ignoreUsernamesArray.includes(user) ||
    responseProbability <= Utils.getRandomInt(1, 100)
  ) {
    return;
  }

  let response = messageText;
  const statsQueue: { originalPhrase: string; replacementPhrase: string }[] =
    [];
  const phrases = getPhraseCache();
  const matchingPhrases = Object.entries(phrases).filter(([originalPhrase]) =>
    messageText.match(new RegExp(`\\b(${originalPhrase})\\b`, 'ig'))
  );

  if (matchingPhrases.length > 0) {
    for (const [originalPhrase, { replacementPhrase }] of matchingPhrases) {
      const { casedReplacementPhrase, casedPluralReplacementPhrase } =
        getPhrasing(originalPhrase, replacementPhrase);

      response = response
        .replace(
          new RegExp(`\\b(${originalPhrase})\\b`, 'ig'),
          casedReplacementPhrase
        )
        .replace(
          new RegExp(`\\b(${plural(originalPhrase)})\\b`, 'ig'),
          casedPluralReplacementPhrase
        );
      statsQueue.push({ originalPhrase, replacementPhrase });
    }
  } else {
    const randomIndex = Utils.getRandomInt(0, Object.keys(phrases).length - 1);
    const [, { partOfSpeech, replacementPhrase }] = Object.entries(phrases).at(
      randomIndex
    ) as [string, Phrase];

    const lexer = new Lexer();
    const tagger = new Tagger();
    const taggedWords = tagger.tag(lexer.lex(messageText));

    const matchingPOSPhrases = taggedWords.filter(([, pos]) => {
      const replacementPhrasePOS = partOfSpeech;
      const [, pluralReplacementPhrasePOS] = tagger.tag([
        plural(replacementPhrase),
      ])[0];

      if (pos === replacementPhrasePOS || pos === pluralReplacementPhrasePOS) {
        return true;
      }
    }) ?? [['', '']];

    const [phrase] = matchingPOSPhrases.at(
      Utils.getRandomInt(0, matchingPOSPhrases.length - 1)
    ) ?? [''];

    if (phrase) {
      const { casedReplacementPhrase, casedPluralReplacementPhrase } =
        getPhrasing(phrase, replacementPhrase);

      response = response
        .replace(new RegExp(`\\b(${phrase})\\b`, 'ig'), casedReplacementPhrase)
        .replace(
          new RegExp(`\\b(${plural(phrase)})\\b`, 'ig'),
          casedPluralReplacementPhrase
        );

      statsQueue.push({ originalPhrase: phrase, replacementPhrase });
    }
  }

  if (response !== messageText) {
    const replacementMessage = postProcessor(runRequest, response);
    sendChatMessage(runRequest, replacementMessage);

    const streamTitle = (
      await twitchApi.channels.getChannelInformation(streamer.userId)
    ).title;
    for (const stat of statsQueue) {
      await addUsageStatistic({
        originalPhrase: stat.originalPhrase,
        replacementPhrase: stat.replacementPhrase,
        user,
        originalMessage: messageText,
        replacementMessage,
        streamTitle,
        responseProbability,
      });
    }
  }
}

export function unregister() {
  if (chatClient && chatClient.isConnected) {
    chatClient.removeListener();
    chatClient.quit();
  }
}

function getPhrasing(originalPhrase: string, replacementPhrase: string) {
  const casedReplacementPhrase = matchCase(originalPhrase, replacementPhrase);
  const casedPluralReplacementPhrase = matchCase(
    originalPhrase,
    plural(replacementPhrase)
  );

  return { casedReplacementPhrase, casedPluralReplacementPhrase };
}

function matchCase(originalPhrase: string, replacementPhrase: string) {
  // Lowercase
  if (originalPhrase === originalPhrase.toLowerCase()) {
    return replacementPhrase.toLowerCase();
  }

  // Uppercase
  if (originalPhrase === originalPhrase.toUpperCase()) {
    return replacementPhrase.toUpperCase();
  }

  // Proper case
  if (
    originalPhrase[0] === originalPhrase[0].toUpperCase() &&
    originalPhrase.slice(1) === originalPhrase.slice(1).toLowerCase()
  ) {
    return replacementPhrase[0].toUpperCase() + replacementPhrase.slice(1);
  }

  // Title case
  if (
    originalPhrase
      .split(' ')
      .every(
        (word) =>
          word[0] === word[0].toUpperCase() &&
          word.slice(1) === word.slice(1).toLowerCase()
      )
  ) {
    return replacementPhrase
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Alternating case
  if (
    originalPhrase
      .split(' ')
      .every(
        (word, index) =>
          (index % 2 === 0 && word === word.toLowerCase()) ||
          (index % 2 !== 0 && word === word.toUpperCase())
      )
  ) {
    return replacementPhrase
      .split(' ')
      .map((word, index) =>
        index % 2 === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .join(' ');
  }

  // Reverse Alternating case
  if (
    originalPhrase
      .split(' ')
      .every(
        (word, index) =>
          (index % 2 === 0 && word === word.toUpperCase()) ||
          (index % 2 !== 0 && word === word.toLowerCase())
      )
  ) {
    return replacementPhrase
      .split(' ')
      .map((word, index) =>
        index % 2 === 0 ? word.toUpperCase() : word.toLowerCase()
      )
      .join(' ');
  }

  // Mixed case
  let nextStartIteration = 0;
  for (let i = 0; i < originalPhrase.length; i++) {
    const originalPhrasePercentage = (i + 1) / originalPhrase.length;
    const lastCharOfIteration = Math.round(
      replacementPhrase.length * originalPhrasePercentage
    );

    for (let j = nextStartIteration; j < lastCharOfIteration; j++) {
      if (originalPhrase[i] === originalPhrase[i].toUpperCase()) {
        replacementPhrase =
          replacementPhrase.slice(0, j) +
          replacementPhrase[j].toUpperCase() +
          replacementPhrase.slice(j + 1);
      } else if (originalPhrase[i] === originalPhrase[i].toLowerCase()) {
        replacementPhrase =
          replacementPhrase.slice(0, j) +
          replacementPhrase[j].toLowerCase() +
          replacementPhrase.slice(j + 1);
      }
    }
    nextStartIteration = lastCharOfIteration;
  }

  return replacementPhrase;
}

function sendChatMessage(
  runRequest: Omit<RunRequest<Params>, 'trigger'>,
  message: string
) {
  const {
    firebot: {
      accounts: { bot },
    },
    modules: { twitchChat },
    parameters: { responder },
  } = runRequest;

  let accountType: 'bot' | 'streamer';
  if (responder === Responder.Bot && bot.loggedIn) {
    accountType = 'bot';
  } else {
    accountType = 'streamer';
  }

  twitchChat.sendChatMessage(message, undefined, accountType, undefined);
}
