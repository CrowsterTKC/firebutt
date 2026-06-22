interface PhraseData {
  id: string;
  originalPhrase: string[];
  replacementPhrase: string;
  partOfSpeech: string;
  expiresAt: Date | null;
  usageCount: number;
  createdByUser: string;
  categoryId: string | null;
  metadata: {
    twitchAvatarUrl?: string;
    twitchUserId?: string;
    twitchUsername?: string;
  };
  insertedAt: Date;
  updatedAt: Date;
}
