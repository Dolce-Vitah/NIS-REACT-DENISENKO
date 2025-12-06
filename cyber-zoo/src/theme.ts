import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f3ff', 
    },
    secondary: {
      main: '#ff00c1', 
    },
    background: {
      default: '#050505',
      paper: '#0f0f1a', 
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Rajdhani", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Orbitron", sans-serif' },
    h2: { fontFamily: '"Orbitron", sans-serif' },
    h3: { fontFamily: '"Orbitron", sans-serif' },
    button: {
      fontFamily: '"Orbitron", sans-serif',
      letterSpacing: '1px',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', 
          border: '1px solid #333',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 243, 255, 0.05)',
          '&:hover': {
            backgroundColor: 'rgba(0, 243, 255, 0.1)',
          },
          '&:before': {
            borderBottom: '1px solid #333',
          },
          '&:after': {
            borderBottom: '2px solid #00f3ff', 
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 243, 255, 0.08)', 
        },
      },
    },
  },
});