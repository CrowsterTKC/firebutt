import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import { useCategory } from '../../hooks/use-category';
import { DialogComponentProps } from '../EnhancedTable';
import {
  Item,
  ReorderableMuiList,
  SortableListItem,
} from '../ReorderableMuiList';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ReorderCategoryDialogProps extends DialogComponentProps {}

export function ReorderCategoryDialog({
  handleClose,
  handleRefresh,
  open,
}: ReorderCategoryDialogProps) {
  const { categories: categoryData, updateCategoryOrders } = useCategory();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems(
      categoryData
        .filter(({ id }) => id !== '00000000-0000-0000-0000-000000000000')
        .map(
          (category) =>
            ({
              id: category.id,
              label: category.name,
            }) as Item
        )
    );
  }, [categoryData]);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await updateCategoryOrders(
        items
          .filter((item) => item.id !== '00000000-0000-0000-0000-000000000000')
          .map((item, index) => ({
            ...categoryData.find((category) => category.id === item.id)!,
            order: index,
          }))
      );
      await handleRefresh();
      handleClose();
    },
    [items, categoryData, handleRefresh, handleClose, updateCategoryOrders]
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth='sm'
        slotProps={{
          paper: {
            component: 'form',
            onSubmit,
          },
        }}
      >
        <DialogTitle>Reorder Categories</DialogTitle>
        <DialogContent>
          <SortableListItem
            item={{
              id: '00000000-0000-0000-0000-000000000000',
              label: 'General Phrases',
            }}
            disabled
          />
          <Divider sx={{ my: 1 }} />
          <ReorderableMuiList items={items} setItems={setItems} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type='submit'>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
