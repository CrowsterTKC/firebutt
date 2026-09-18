import { Category } from '../entities/categories';

export interface AddPhraseProps {
  originalPhrase: string[];
  replacementPhrase: string;
  partOfSpeech: string | null;
  expiresAt: Date | null;
  createdByUser: string;
  category?: Category | null;
}

export interface UpdatePhraseProps {
  originalPhrase: string[];
  replacementPhrase: string;
  partOfSpeech: string | null;
  expiresAt: Date | null;
  createdByUser: string;
  category?: Category | null;
}
