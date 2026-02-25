import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from 'sonner';
import { AppRouter } from './routers/AppRouter';
import { type RootState } from './store';
import { useInitAuth } from '@/features/Auth/model/useInitAuth';
import { GlobalErrorBoundary } from '@/app/providers/ErrorBoundary/ui/GlobalErrorBoundary';
import i18n from '@/shared/config/i18n/i18n';

export const App = () => {
  const theme = useSelector((state: RootState) => state.settings.theme);
  const language = useSelector((state: RootState) => state.settings.language);

  useInitAuth();

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
      root.classList.add('theme-transition');
    }

    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');

    if (!reduceMotion) {
      const id = window.setTimeout(() => root.classList.remove('theme-transition'), 220);
      return () => window.clearTimeout(id);
    }
  }, [theme]);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <GlobalErrorBoundary>
      <AppRouter />
      <Toaster 
        theme={theme}
        toastOptions={{
          className: 'ui-card',
          style: {
            background: 'rgb(var(--surface))',
            color: 'rgb(var(--text))',
            borderColor: 'rgb(var(--border))',
          }
        }}
      />
    </GlobalErrorBoundary>
  );
};

