import {
  Container,
  createTheme,
  GlobalStyles,
  ThemeProvider,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BrowserRouter } from 'react-router-dom';

import { Header } from './components/Header';
import { WEB } from './constants/app';
import { VersionProvider } from './providers/version-provider';
import { Routes } from './routes';

export default function App() {
  const appTheme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  return (
    <ThemeProvider theme={appTheme} defaultMode='light'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter basename={WEB.BASE_ROUTE}>
          <VersionProvider>
            <GlobalStyles
              styles={(theme) => ({
                body: {
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  margin: 0,
                  padding: 0,
                },
              })}
            />
            <Header />
            <Container
              sx={{ mx: 'auto', px: '48px !important', py: '24px !important' }}
            >
              <Routes />
            </Container>
          </VersionProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
