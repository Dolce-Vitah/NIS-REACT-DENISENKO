import { CssBaseline, ThemeProvider } from '@mui/material';
import { type PropsWithChildren, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { buildAppTheme } from '../theme/theme';
import { useUiStore } from '../../store/uiStore';

export function AppProviders({ children }: PropsWithChildren) {
  const themeMode = useUiStore((s) => s.themeMode);
  const density = useUiStore((s) => s.density);
  const glassBlur = useUiStore((s) => s.glassBlur);
  const cornerRadius = useUiStore((s) => s.cornerRadius);
  const reducedMotion = useUiStore((s) => s.reducedMotion);
  const surfaceIntensity = useUiStore((s) => s.surfaceIntensity);
  const borderContrast = useUiStore((s) => s.borderContrast);
  const shadowDepth = useUiStore((s) => s.shadowDepth);
  const chartPalette = useUiStore((s) => s.chartPalette);
  const theme = useMemo(
    () =>
      buildAppTheme(themeMode, {
        density,
        glassBlur,
        cornerRadius,
        reducedMotion,
        surfaceIntensity,
        borderContrast,
        shadowDepth,
        chartPalette,
      }),
    [
      themeMode,
      density,
      glassBlur,
      cornerRadius,
      reducedMotion,
      surfaceIntensity,
      borderContrast,
      shadowDepth,
      chartPalette,
    ]
  );
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
          mutations: { retry: 0 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
