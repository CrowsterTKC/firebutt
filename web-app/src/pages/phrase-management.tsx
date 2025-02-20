import { EnhancedColumn, EnhancedTable } from '../components/EnhancedTable';

interface PhraseData {
  id: number;
  originalPhrase: string;
  replacementPhrase: string;
  partOfSpeech: string;
  expiresAt: Date | null;
  usageCount: number;
  createdByUser: string;
}

export default function PhraseManagement() {
  const columns: EnhancedColumn<PhraseData>[] = [
    {
      id: 'originalPhrase',
      label: 'Original Phrase',
    },
    {
      id: 'replacementPhrase',
      label: 'Replacement Phrase',
    },
    {
      id: 'partOfSpeech',
      label: 'Part of Speech',
    },
    {
      id: 'expiresAt',
      label: 'Expires At',
    },
    {
      id: 'usageCount',
      label: 'Usage Count',
      numeric: true,
    },
    {
      id: 'createdByUser',
      label: 'Created By User',
    },
  ];

  const rows: PhraseData[] = [
    {
      id: 1,
      originalPhrase: 'game',
      replacementPhrase: 'butt',
      partOfSpeech: 'NN',
      expiresAt: null,
      usageCount: 0,
      createdByUser: 'Firebutt',
    },
    {
      id: 2,
      originalPhrase: 'streamer',
      replacementPhrase: 'butt',
      partOfSpeech: 'NN',
      expiresAt: null,
      usageCount: 0,
      createdByUser: 'Firebutt',
    },
  ];

  return (
    <EnhancedTable<PhraseData>
      columns={columns}
      defaultColumnForOrderBy='originalPhrase'
      rows={rows}
      tableTitle='Phrase Management'
    />
  );
}
