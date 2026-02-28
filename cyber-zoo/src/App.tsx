import React from 'react';
import Dashboard from './pages/Dashboard';
import EventLog from './components/EventLog/EventLog';
import { EventProvider } from './context/EventContext';
import './styles/global.scss';
import {theme} from './theme';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';


const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
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