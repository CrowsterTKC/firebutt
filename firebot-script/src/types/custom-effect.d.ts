export interface AddRemoveEffectModel {
  action: string;
  expiresInDays: string | null;
  originalPhrase: string;
  replacementPhrase: string;
}

export interface UpdateResponseProbablityEffectModel {
  mode: string;
  value: string;
}
