import { Box } from '@mui/material';
import semver from 'semver';

import { partOfSpeechV1, partOfSpeechV2 } from '../../constants/pos';
import { useVersion } from '../../hooks/use-version';
import { ColumnComponentProps } from '../EnhancedTable';

export function PartOfSpeech({
  value: { partOfSpeech: tag },
}: ColumnComponentProps<PhraseData>) {
  const { scriptVersion } = useVersion();

  const tagParsed = tag ?? 'undefined';
  const { description } = tag
    ? semver.satisfies(scriptVersion ?? '1.0.0', '>=1.2.0')
      ? partOfSpeechV2[tag]
      : partOfSpeechV1[tag]
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
