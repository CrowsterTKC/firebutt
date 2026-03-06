import { Box } from '@mui/material';

import { partOfSpeech } from '../../constants/pos';
import { ColumnComponentProps } from '../EnhancedTable';

export function PartOfSpeech({
  value: { partOfSpeech: tag },
}: ColumnComponentProps<PhraseData>) {
  const tagParsed = tag ?? 'undefined';
  const { description } = tag
    ? partOfSpeech[tag]
    : { description: 'Undefined' };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Box>
        {description}{' '}
        <Box sx={{ color: '#bbb', display: 'inline' }}>({tagParsed})</Box>
      </Box>
    </Box>
  );
}
