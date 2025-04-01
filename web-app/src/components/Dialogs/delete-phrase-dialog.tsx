import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useCallback, useMemo } from 'react';

import { WEB } from '../../constants/app';
import { DialogComponentProps } from '../EnhancedTable';

interface DeletePhraseDialogProps extends DialogComponentProps {
  formData: PhraseData[];
}

export function DeletePhraseDialog({
  formData: phraseData,
  handleClose,
  handleRefresh,
  open,
}: DeletePhraseDialogProps) {
  const dialogText = useMemo(() => {
    return phraseData.length === 1
      ? 'Are you sure you want to delete this phrase?'
      : 'Are you sure you want to delete these phrases?';
  }, [phraseData]);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const apiUrl = `${WEB.BASE_ORIGIN}${WEB.API_ROUTE}/phrases`;
      phraseData.forEach(async (phrase) => {
        const url = new URL(apiUrl);
        url.searchParams.append('id', phrase.id);

        await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });

      handleRefresh();
      handleClose();
    },
    [handleClose, handleRefresh, phraseData]
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
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type='submit'>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
