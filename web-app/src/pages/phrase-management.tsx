import { useCallback, useEffect, useState } from 'react';

import { CategorySwitcher } from '../components/CategorySwitcher';
import { PartOfSpeech, TwitchUser } from '../components/Columns';
import { AddEditPhraseDialog, DeletePhraseDialog } from '../components/Dialogs';
import { EnhancedColumn, EnhancedTable } from '../components/EnhancedTable';
import { WEB } from '../constants/app';
import { useCategory } from '../hooks/use-category';

export default function PhraseManagement() {
  const { selectedCategory: categoryId } = useCategory();
  const [rows, setRows] = useState<PhraseData[]>([]);

  const columns: EnhancedColumn<PhraseData>[] = [
    {
      id: 'originalPhrase',
      label: 'Original Phrase',
      formatter: (value: string[]) =>
        value[0].startsWith('__') && value[0].endsWith('__')
          ? ''
          : value.join(', '),
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
      component: TwitchUser,
    },
  ];

  const handleRefresh = useCallback(async () => {
    const apiUrl = `${WEB.BASE_ORIGIN}${WEB.API_ROUTE}/phrases?categoryId=${categoryId}`;
    const response = await fetch(apiUrl);
    const data = (await response.json()).phrases as PhraseData[];
    setRows(data);
  }, [categoryId]);

  useEffect(() => {
    handleRefresh();
  }, [categoryId, handleRefresh]);

  return (
    <>
      <CategorySwitcher />
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
    </>
  );
}
