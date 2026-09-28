import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { useCallback, useMemo } from 'react';

import { WEB } from '../../constants/app';
import { DialogComponentProps } from '../EnhancedTable';

interface AddEditCategoryDialogProps extends DialogComponentProps {
  formData?: CategoryData;
  mode: 'add' | 'edit';
}

export function AddEditCategoryDialog({
  formData: categoryData,
  handleClose,
  handleRefresh,
  mode,
  open,
}: AddEditCategoryDialogProps) {
  const dialogTitle = useMemo(() => {
    return mode === 'add' ? 'Add Category' : 'Edit Category';
  }, [mode]);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const { id, name, isEnabled, order } = Object.fromEntries(
        formData
      ) as unknown as CategoryData;

      if (mode === 'add') {
        const newCategoryData = {
          name,
          isEnabled,
          order: Number(order),
        };

        const response = await fetch(
          `${WEB.BASE_ORIGIN}${WEB.API_ROUTE}/categories`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCategoryData),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to add category');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
      }

      if (mode === 'edit') {
        const updatedCategoryData = {
          id,
          name,
          isEnabled,
          order: Number(order),
        };

        const response = await fetch(
          `${WEB.BASE_ORIGIN}${WEB.API_ROUTE}/categories/?id=${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCategoryData),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update category');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
      }

      handleClose();
      handleRefresh();
    },
    [handleClose, handleRefresh, mode]
  );

  return (
    <Dialog
      open={open as boolean}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit,
        },
      }}
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <TextField
          id='id'
          name='id'
          type='hidden'
          value={categoryData?.id}
          variant='standard'
        />
        <TextField
          autoFocus
          defaultValue={categoryData?.name}
          fullWidth
          id='name'
          label='Name'
          margin='dense'
          name='name'
          type='text'
          variant='standard'
        />
        <FormControlLabel
          control={
            <Checkbox
              id='isEnabled'
              name='isEnabled'
              defaultChecked={categoryData?.isEnabled ?? true}
            />
          }
          label='Is Enabled'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type='submit'>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
