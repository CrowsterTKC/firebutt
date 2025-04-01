import { Avatar, Box } from '@mui/material';

import { ColumnComponentProps } from '../EnhancedTable';

export function TwitchUser({
  value: { createdByUser, metadata },
}: ColumnComponentProps<PhraseData>) {
  console.log('TwitchUser', createdByUser, metadata);
  return (
    <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
      {metadata?.twitchAvatarUrl && (
        <Avatar
          alt={createdByUser}
          src={metadata?.twitchAvatarUrl}
          sx={{ height: 24, mr: 0.5, width: 24 }}
        />
      )}
      <Box>{createdByUser}</Box>
    </Box>
  );
}
