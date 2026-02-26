import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';

const RegisterPage = () => {
  const { t } = useAppTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="ui-card flex flex-col gap-4 p-6 w-[380px] max-w-[92vw] motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-0.5">
        <h1 className="text-2xl font-bold ui-title">{t('auth.registerTitle')}</h1>
        <p className="text-sm ui-muted">{t('auth.registerStub')}</p>

        <div className="flex flex-col gap-1">
          <label htmlFor="register-email" className="text-sm font-medium ui-muted">
            {t('auth.email')}
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t('auth.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ui-input"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="register-password" className="text-sm font-medium ui-muted">
            {t('auth.password')}
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ui-input"
            required
          />
        </div>

        <button
          type="button"
          className="ui-btn ui-btn-primary w-full"
          onClick={() => undefined}
          disabled
        >
          {t('auth.register')}
        </button>

        <div className="text-sm ui-muted">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="ui-link">
            {t('auth.goToLogin')}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;

