import { FindOneOptions, LessThan } from 'typeorm';

import { dataSource } from './data-source';
import { Phrase } from './entities/phrase';
import { newGuid } from './guid-handler';
import { AddPhraseProps, UpdatePhraseProps } from './types/phrase-manager';

const phraseRepository = dataSource?.getRepository(Phrase);
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
    where: { replacementPhrase },
  });

  if (existingPhrase) {
    const updatedPhrase = phraseRepository.merge(existingPhrase, {
      originalPhrase: [...existingPhrase.originalPhrase, originalPhrase],
    });

    await phraseRepository.save(updatedPhrase);
    phraseCache[originalPhrase] = updatedPhrase;
    return updatedPhrase;
  } else {
    const { id, guid } = newGuid({ type: 'phrase' });
    const newPhrase = phraseRepository.merge(new Phrase(), {
      id,
      guid,
      originalPhrase: [originalPhrase],
      replacementPhrase,
      partOfSpeech,
      expiresAt,
      createdByUser,
    });

    await phraseRepository.save(newPhrase);
    phraseCache[originalPhrase] = newPhrase;
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

export async function register(): Promise<void> {
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

export function registerSync(): void {
  register().catch((error) => {
    console.error('Error registering phrase manager:', error);
  });
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
  const updatedPhrase = phraseRepository.merge(phrase, {
    originalPhrase,
    replacementPhrase,
    partOfSpeech,
    expiresAt,
    createdByUser,
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
