import { AppProviders } from './app/providers/AppProviders';
import { BuilderPage } from './pages/BuilderPage';
import { AppNotification } from './shared/ui/AppNotification';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<BuilderPage />} />
          <Route path="/discover" element={<BuilderPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <AppNotification />
    </AppProviders>
  );
}
