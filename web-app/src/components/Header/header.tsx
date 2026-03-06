import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faLineChart,
  faMoon,
  faPiggyBank,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import {
  AppBar,
  Badge,
  Box,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { APP } from '../../constants/app';
import { useYearlyRecap } from '../../hooks/use-yearly-recap';
import { FontAwesomeSvgIcon } from '../FontAwesomeSvgIcon';
import { Logo } from '../Logo';

const disableHeaderRoutes = ['/recap'];

export function Header() {
  const [displayHeader, setDisplayHeader] = useState(true);
  const { mode, setMode } = useColorScheme();
  const { isAvailable: isYearlyRecapAvailable, year: yearlyRecapYear } =
    useYearlyRecap();

  const onClickDiscord = useCallback(() => {
    window.open(APP.DISCORD_INVITE_URL, '_blank');
  }, []);

  const onClickDonate = useCallback(() => {
    window.open(APP.DONATE_URL, '_blank');
  }, []);

  const onClickGitHub = useCallback(() => {
    window.open(APP.GITHUB_URL, '_blank');
  }, []);

  const onClickToggleTheme = useCallback(() => {
    setMode((mode ?? 'light') === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const onClickYearlyRecap = useCallback(() => {
    window.location.href = `/recap`;
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const shouldDisplayHeader = !disableHeaderRoutes.includes(currentPath);
    setDisplayHeader(shouldDisplayHeader);
  }, []);

  return (
    displayHeader && (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Container>
            <Toolbar>
              <Link
                to='/'
                style={{
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'row',
                  textDecoration: 'none',
                }}
              >
                <Logo
                  sx={{ mr: 1 }}
                  variant={mode === 'light' ? 'fire' : 'peach'}
                />
                <Typography
                  variant='h6'
                  component='div'
                  sx={{ color: 'inherit', fontWeight: 'bold' }}
                >
                  Firebutt
                </Typography>
              </Link>
              <Box sx={{ flexGrow: 1 }} />
              {isYearlyRecapAvailable && (
                <Tooltip title={`View ${yearlyRecapYear} Recap`}>
                  <IconButton
                    aria-label={`View ${yearlyRecapYear} Recap`}
                    onClick={onClickYearlyRecap}
                    sx={{ color: 'inherit' }}
                  >
                    <Badge badgeContent={yearlyRecapYear} max={9999}>
                      <FontAwesomeSvgIcon icon={faLineChart} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title='Toggle theme'>
                <IconButton
                  aria-label='Toggle theme'
                  onClick={onClickToggleTheme}
                  sx={{ color: 'inherit' }}
                >
                  <FontAwesomeSvgIcon
                    icon={mode === 'light' ? faSun : faMoon}
                    key={'ToggleThemeIconButton'}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title='Join Discord'>
                <IconButton
                  aria-label='Join Discord'
                  onClick={onClickDiscord}
                  sx={{ color: 'inherit' }}
                >
                  <FontAwesomeSvgIcon icon={faDiscord} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Browse project on GitHub'>
                <IconButton
                  aria-label='Browse project on GitHub'
                  onClick={onClickGitHub}
                  sx={{ color: 'inherit' }}
                >
                  <FontAwesomeSvgIcon icon={faGithub} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Donate'>
                <IconButton
                  aria-label='Donate'
                  onClick={onClickDonate}
                  sx={{ color: 'inherit' }}
                >
                  <FontAwesomeSvgIcon icon={faPiggyBank} />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    )
  );
}
