interface PhraseData {
  id: string;
  originalPhrase: string[];
  replacementPhrase: string;
  partOfSpeech: string;
  expiresAt: Date | null;
  usageCount: number;
  createdByUser: string;
  insertedAt: Date;
  updatedAt: Date;
}
