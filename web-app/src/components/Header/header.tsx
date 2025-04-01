import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faMoon, faPiggyBank, faSun } from '@fortawesome/free-solid-svg-icons';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { APP } from '../../constants/app';
import { FontAwesomeSvgIcon } from '../FontAwesomeSvgIcon';
import { Logo } from '../Logo';

export function Header() {
  const { mode, setMode } = useColorScheme();

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

  return (
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
  );
}
