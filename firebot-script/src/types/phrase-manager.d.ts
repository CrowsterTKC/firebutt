export interface AddPhraseProps {
  originalPhrase: string[];
  replacementPhrase: string;
  partOfSpeech: string | null;
  expiresAt: Date | null;
  createdByUser: string;
  category?: string | null;
}

export interface UpdatePhraseProps {
  originalPhrase: string[];
  replacementPhrase: string;
  partOfSpeech: string | null;
  expiresAt: Date | null;
  createdByUser: string;
  category?: string | null;
}
