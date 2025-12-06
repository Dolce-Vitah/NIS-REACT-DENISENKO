import React from 'react';
import Dashboard from './pages/Dashboard';
import EventLog from './components/EventLog/EventLog';
import { EventProvider } from './context/EventContext';
import './styles/global.scss';
import { Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f3ff',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1f1f1f',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <EventProvider>
        <Box sx={{ display: 'flex' }}>       
          <Box component="main" sx={{ flexGrow: 1, p: 3, marginRight: '300px' }}>
            <Dashboard />
          </Box>
          <EventLog />
        </Box>
      </EventProvider>
    </ThemeProvider>
  );
};

export default App;