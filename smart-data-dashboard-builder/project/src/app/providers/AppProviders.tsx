import { CssBaseline, ThemeProvider } from '@mui/material';
import { type PropsWithChildren, useMemo } from 'react';
import { buildAppTheme } from '../theme/theme';
import { useUiStore } from '../../store/uiStore';

export function AppProviders({ children }: PropsWithChildren) {
  const themeMode = useUiStore((s) => s.themeMode);
  const theme = useMemo(() => buildAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}