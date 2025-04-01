import { Box } from '@mui/material';

import { partOfSpeech } from '../../constants/pos';

interface PartOfSpeechProps {
  value: string;
}

export function PartOfSpeech({ value: tag }: PartOfSpeechProps) {
  const { description } = partOfSpeech[tag];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box>
        {description}{' '}
        <Box sx={{ color: '#bbb', display: 'inline' }}>({tag})</Box>
      </Box>
    </Box>
  );
}
