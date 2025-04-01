interface AddUsageStateProps {
  originalPhrase: string;
  replacementPhrase: string;
  user: string;
  originalMessage: string;
  replacementMessage: string;
  streamTitle: string;
  responseProbability: number;
}

interface UsageStatisticAggregated {
  [key: string]: { [key: string]: number };
}
