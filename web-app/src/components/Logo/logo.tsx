/* eslint-disable import/no-unresolved */
import { Box, SxProps } from '@mui/system';

import Fire from './fire.svg?react';
import Peach from './peach.svg?react';

interface LogoProps {
  size?: number;
  sx?: SxProps;
  variant?: 'fire' | 'peach' | 'random';
}

export function Logo({ size = 24, sx, variant = 'random' }: LogoProps) {
  const componentProps = { height: size, width: size };
  const randomLogo =
    Math.random() > 0.5 ? (
      <Fire {...componentProps} />
    ) : (
      <Peach {...componentProps} />
    );

  switch (variant) {
    case 'fire':
      return (
        <Box sx={sx}>
          <Fire {...componentProps} />
        </Box>
      );
    case 'peach':
      return (
        <Box sx={sx}>
          <Peach {...componentProps} />
        </Box>
      );
    default:
      return <Box sx={sx}>{randomLogo}</Box>;
  }
}
