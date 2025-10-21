import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    info: {
      main: '#0288d1', // club color
    },
    success: {
      main: '#2e7d32', // sport color
    },
    warning: {
      main: '#ed6c02', // team color
    },
    error: {
      main: '#d32f2f', // user color
    },
  },
  spacing: 8, // 8px grid
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44, // touch target
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          minWidth: 44,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          minHeight: 32,
        },
      },
    },
  },
});
