import {
  Container,
  createTheme,
  GlobalStyles,
  ThemeProvider,
} from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import { Header } from './components/Header';
import { WEB } from './constants/app';
import { Routes } from './routes';

export default function App() {
  const appTheme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  return (
    <ThemeProvider theme={appTheme} defaultMode='light'>
      <BrowserRouter basename={WEB.BASE_ROUTE}>
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
      </BrowserRouter>
    </ThemeProvider>
  );
}
