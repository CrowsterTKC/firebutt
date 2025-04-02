import { InfoOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';

import { WEB } from '../../constants/app';
import { partOfSpeech } from '../../constants/pos';
import { DialogComponentProps } from '../EnhancedTable';

interface AddEditPhraseDialogProps extends DialogComponentProps {
  formData?: PhraseData;
  mode: 'add' | 'edit';
}

interface FormPhraseData extends Omit<PhraseData, 'originalPhrase'> {
  originalPhrase: string | string[];
  expiresInDays: number;
}

export function AddEditPhraseDialog({
  formData: phraseData,
  handleClose,
  handleRefresh,
  mode,
  open,
}: AddEditPhraseDialogProps) {
  const dialogTitle = useMemo(() => {
    return mode === 'add' ? 'Add Phrase' : 'Edit Phrase';
  }, [mode]);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const {
        createdByUser,
        expiresAt,
        expiresInDays,
        id,
        originalPhrase,
        partOfSpeech,
        replacementPhrase,
      } = Object.fromEntries(formData) as unknown as FormPhraseData;

      const addDays = (date: Date, days: number) => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        return newDate;
      };

      if (mode === 'add') {
        const originalPhraseArray =
          originalPhrase === ''
            ? [`__${replacementPhrase}__`]
            : (originalPhrase as string)
                .split(',')
                .map((phrase) => phrase.trim());

        const newPhraseData = {
          originalPhrase: [...originalPhraseArray],
          replacementPhrase,
          partOfSpeech,
          expiresAt:
            expiresInDays && Number(expiresInDays) > 0
              ? addDays(new Date(), Number(expiresInDays))
              : null,
          createdByUser,
        };

        const response = await fetch(
          `${WEB.BASE_ORIGIN}${WEB.API_ROUTE}/phrases`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPhraseData),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to add phrase');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
      }

      if (mode === 'edit') {
        const originalPhraseArray =
          originalPhrase === ''
            ? [`__${replacementPhrase}__`]
            : (originalPhrase as string)
                .split(',')
                .map((phrase) => phrase.trim());
        const updatedPhraseData = {
          id,
          originalPhrase: originalPhraseArray,
          replacementPhrase,
          partOfSpeech,
          expiresAt,
          createdByUser,
        };

        const response = await fetch(
          `${WEB.BASE_ORIGIN}${WEB.API_ROUTE}/phrases/?id=${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPhraseData),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update phrase');
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
          value={phraseData?.id}
          variant='standard'
        />
        <TextField
          autoFocus
          defaultValue={
            !phraseData?.originalPhrase[0].startsWith('__') &&
            !phraseData?.originalPhrase[0].endsWith('__')
              ? phraseData?.originalPhrase.join(', ')
              : ''
          }
          fullWidth
          id='originalPhrase'
          label='Original Phrase'
          margin='dense'
          name='originalPhrase'
          type='text'
          variant='standard'
        />
        <TextField
          defaultValue={phraseData?.replacementPhrase}
          fullWidth
          id='replacementPhrase'
          label='Replacement Phrase'
          margin='dense'
          name='replacementPhrase'
          required
          type='text'
          variant='standard'
        />
        <FormControl fullWidth margin='dense' variant='standard'>
          <InputLabel id='partOfSpeechLabel'>Part of Speech</InputLabel>
          <Select
            defaultValue={phraseData?.partOfSpeech}
            id='partOfSpeech'
            label='Part of Speech'
            labelId='partOfSpeechLabel'
            margin='dense'
            required
            variant='standard'
          >
            {Object.entries(partOfSpeech).map(
              ([tag, { description, examples }]) => (
                <MenuItem value={tag}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Box>
                      {description}{' '}
                      <Box sx={{ color: '#bbb', display: 'inline' }}>
                        ({tag})
                      </Box>
                    </Box>
                    <Tooltip title={examples.join(', ')} placement='right'>
                      <InfoOutlined sx={{ color: '#bbb' }} />
                    </Tooltip>
                  </Box>
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        {mode === 'add' ? (
          <TextField
            fullWidth
            id='expiresInDays'
            label='Expires In Days'
            margin='dense'
            name='expiresInDays'
            type='number'
            variant='standard'
          />
        ) : (
          <DateTimePicker
            defaultValue={
              phraseData?.expiresAt ? dayjs(phraseData?.expiresAt) : null
            }
            disablePast
            label='Expires At'
            name='expiresAt'
            slotProps={{
              textField: {
                fullWidth: true,
                id: 'expiresAt',
                margin: 'dense',
                variant: 'standard',
              },
            }}
          />
        )}
        <TextField
          defaultValue={phraseData?.createdByUser}
          fullWidth
          id='createdByUser'
          label='Created By User'
          margin='dense'
          name='createdByUser'
          type='text'
          variant='standard'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type='submit'>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
