import { AppProviders } from './app/providers/AppProviders';
import { BuilderPage } from './pages/BuilderPage';
import { AppNotification } from './shared/ui/AppNotification';

export function App() {
  return (
    <AppProviders>
      <BuilderPage />
      <AppNotification />
    </AppProviders>
  );
}