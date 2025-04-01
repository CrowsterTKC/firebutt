import { useCallback, useEffect, useState } from 'react';

import { PartOfSpeech } from '../components/Columns';
import { AddEditPhraseDialog, DeletePhraseDialog } from '../components/Dialogs';
import { EnhancedColumn, EnhancedTable } from '../components/EnhancedTable';
import { WEB } from '../constants/app';

export default function PhraseManagement() {
  const [rows, setRows] = useState<PhraseData[]>([]);
  const [refresh, setRefresh] = useState(true);

  const columns: EnhancedColumn<PhraseData>[] = [
    {
      id: 'originalPhrase',
      label: 'Original Phrase',
      formatter: (value: string[]) =>
        value[0] === '__any__' ? '' : value.join(', '),
    },
    {
      id: 'replacementPhrase',
      label: 'Replacement Phrase',
    },
    {
      id: 'partOfSpeech',
      label: 'Part of Speech',
      component: PartOfSpeech,
    },
    {
      id: 'expiresAt',
      label: 'Expires At',
      formatter: (value: Date | null) =>
        value ? new Date(value).toLocaleString() : '',
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

  const handleRefresh = useCallback(() => {
    setRefresh(true);
  }, [setRefresh]);

  useEffect(() => {
    if (!refresh) return;
    (async () => {
      const apiUrl = `${WEB.BASE_ORIGIN}${WEB.API_ROUTE}/phrases`;
      const response = await fetch(apiUrl);
      const data = (await response.json()).phrases as PhraseData[];
      setRows(data);
    })();
    setRefresh(false);
  }, [refresh, setRows]);

  return (
    <EnhancedTable<PhraseData>
      addItemComponent={AddEditPhraseDialog}
      columns={columns}
      defaultColumnForOrderBy='originalPhrase'
      deleteItemComponent={DeletePhraseDialog}
      editItemComponent={AddEditPhraseDialog}
      entityNameForTooltips='Phrase'
      handleRefresh={handleRefresh}
      rows={rows}
      tableTitle='Phrase Management'
    />
  );
}
