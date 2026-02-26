import { LoginForm } from '@/features/Auth/ui/LoginForm';
import { Link } from 'react-router-dom';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';

const LoginPage = () => {
  const { t } = useAppTranslation();
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col gap-4 items-center">
        <LoginForm />
        <div className="text-sm ui-muted">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="ui-link">
            {t('auth.goToRegister')}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;