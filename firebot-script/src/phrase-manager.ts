import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { FindOneOptions, LessThan, Repository } from 'typeorm';

import { Phrase } from './entities/phrase';
import { Firebutt } from './firebutt';
import { newGuid } from './guid-handler';
import { Params } from './params';
import { AddPhraseProps, UpdatePhraseProps } from './types/phrase-manager';

let firebotModules: RunRequest<Params>['modules'] =
  null as unknown as RunRequest<Params>['modules'];
let phraseRepository: Repository<Phrase> =
  null as unknown as Repository<Phrase>;
const phraseCache: Record<string, Phrase> = {};
let purgeExpiredPhrasesJob: NodeJS.Timeout | null = null;

export async function addPhrase({
  originalPhrase,
  replacementPhrase,
  partOfSpeech,
  expiresAt,
  createdByUser,
}: AddPhraseProps): Promise<Phrase> {
  const existingPhrase = await phraseRepository.findOne({
    where: [{ replacementPhrase }, ...(expiresAt ? [{ expiresAt }] : [])],
  });

  if (existingPhrase) {
    const updatedPhrase = phraseRepository.merge(existingPhrase, {
      originalPhrase: [...existingPhrase.originalPhrase, ...originalPhrase],
    });
    await phraseRepository.save(updatedPhrase);

    updatedPhrase.originalPhrase.forEach((originalPhrase) => {
      phraseCache[originalPhrase] = updatedPhrase;
    });
    return updatedPhrase;
  } else {
    const twitchUser =
      await firebotModules.twitchApi.users.getUserByName(createdByUser);

    const { id, guid } = newGuid({ type: 'phrase' });
    const newPhrase = phraseRepository.merge(new Phrase(), {
      id,
      guid,
      originalPhrase,
      replacementPhrase,
      partOfSpeech,
      expiresAt,
      createdByUser: twitchUser.displayName,
      metadata: {
        twitchAvatarUrl: twitchUser.profilePictureUrl,
        twitchUserId: twitchUser.id,
        twitchUsername: createdByUser,
      },
    });
    await phraseRepository.save(newPhrase);

    newPhrase.originalPhrase.forEach((originalPhrase) => {
      phraseCache[originalPhrase] = {
        ...newPhrase,
        ...phraseCache[originalPhrase],
        originalPhrase: [
          ...(phraseCache[originalPhrase]?.originalPhrase || []),
          originalPhrase,
        ],
      };
    });
    return newPhrase;
  }
}

export async function deletePhrase({ id }: { id: string }): Promise<boolean> {
  const deleted = await phraseRepository.softDelete({ id });

  if ((deleted.affected ?? 0) > 0) {
    Object.entries(phraseCache).forEach(([key, phrase]) => {
      if (phrase.id === id) {
        delete phraseCache[key];
      }
    });
  }

  return (deleted.affected ?? 0) > 0;
}

export async function getPhrase({
  id,
}: {
  id: string;
}): Promise<Phrase | null> {
  return await phraseRepository.findOne({ where: { id } });
}

export function getPhraseCache(): Record<string, Phrase> {
  return phraseCache;
}

export async function getPhrasesBy(
  key: keyof Phrase,
  value: unknown,
  options?: FindOneOptions<Phrase> & { useCache?: boolean }
): Promise<Phrase | null> {
  if (options?.useCache) {
    const foundPhrase = Object.entries(phraseCache).find(([, phrase]) => {
      if (phrase[key] === value) {
        return phrase;
      }
    });
    return foundPhrase ? foundPhrase[1] : null;
  } else {
    return await phraseRepository.findOne({
      where: { [key]: value },
      ...options,
    });
  }
}

export function getPhraseByOriginalPhrase(
  originalPhrase: string
): Phrase | null {
  return phraseCache[originalPhrase] ?? null;
}

export async function getPhrases(): Promise<Phrase[]> {
  return await phraseRepository.find();
}

export function getPhraseRepository(): Repository<Phrase> {
  return phraseRepository;
}

export async function register(
  firebutt: Firebutt,
  { modules }: Omit<RunRequest<Params>, 'trigger'>
): Promise<void> {
  phraseRepository = firebutt.getDataSource().getRepository(Phrase);
  firebotModules = modules;
  const phrases = await getPhrases();
  phrases.forEach((phrase) => {
    phrase.originalPhrase.forEach((originalPhrase) => {
      if (!phraseCache[originalPhrase]) {
        phraseCache[originalPhrase] = phrase;
      }
    });
  });

  purgeExpiredPhrasesJob = setInterval(async () => {
    console.log('Running purgeExpiredPhrasesJob');
    await purgeExpiredPhrases();
  }, 1000 * 60);
}

export function unregister(): void {
  Object.entries(phraseCache).forEach(([key]) => {
    delete phraseCache[key];
  });

  if (purgeExpiredPhrasesJob) {
    clearInterval(purgeExpiredPhrasesJob);
    purgeExpiredPhrasesJob = null;
  }
}

export async function updatePhrase(
  phrase: Phrase,
  {
    originalPhrase,
    replacementPhrase,
    partOfSpeech,
    expiresAt,
    createdByUser,
  }: UpdatePhraseProps
): Promise<Phrase> {
  const twitchUser =
    await firebotModules.twitchApi.users.getUserByName(createdByUser);

  const updatedPhrase = phraseRepository.merge(phrase, {
    originalPhrase,
    replacementPhrase,
    partOfSpeech,
    expiresAt,
    createdByUser: twitchUser.displayName,
    metadata: {
      twitchAvatarUrl: twitchUser.profilePictureUrl,
      twitchUserId: twitchUser.id,
      twitchUsername: createdByUser,
    },
  });

  await phraseRepository.save(updatedPhrase);
  updatedPhrase.originalPhrase.forEach((originalPhrase) => {
    phraseCache[originalPhrase] = updatedPhrase;
  });
  return updatedPhrase;
}

async function purgeExpiredPhrases(): Promise<void> {
  await phraseRepository.softDelete({
    expiresAt: LessThan(new Date()),
  });

  Object.entries(phraseCache).forEach(([originalPhrase, phrase]) => {
    if (phrase.expiresAt && phrase.expiresAt < new Date()) {
      delete phraseCache[originalPhrase];
    }
  });
}
