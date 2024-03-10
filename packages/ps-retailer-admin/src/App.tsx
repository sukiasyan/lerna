import { ThemeProvider } from '@mui/material';

import { MainContent } from './components/Main/Main';

import { defaultTheme } from '~/components/defaultTheme.ts';

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <MainContent />
    </ThemeProvider>
  );
}
