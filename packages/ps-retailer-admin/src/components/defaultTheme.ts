import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme({
  palette: {
    primary: {
      light: '#6D73FF',
      main: '#0047FF',
      dark: '#001FCA'
    },
    secondary: {
      light: '#5336A5',
      main: '#1B0C75',
      dark: '#000049'
    },
    background: {
      default: '#fafafa'
    },
    success: {
      main: '#4CAF50'
    },
    warning: {
      main: '#FF9800'
    },
    error: {
      main: '#F44336'
    }
  },
  typography: {
    allVariants: {
      letterSpacing: 'normal'
    }
  }
});
