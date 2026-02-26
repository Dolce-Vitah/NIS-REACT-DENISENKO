import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetailsPage')); 
const ProfilePage = lazy(() => import('@/pages/ProfilePage')); 
const SettingsPage = lazy(() => import('@/pages/SettingsPage')); 
const LogoutPage = lazy(() => import('@/pages/LogoutPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const MainLayout = lazy(() => import('@/widgets/MainLayout'));

export const AppRouter = () => {
  const { t } = useAppTranslation();
  return (
    <Suspense fallback={<div className="p-6 ui-muted">{t('common.loading')}...</div>}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};