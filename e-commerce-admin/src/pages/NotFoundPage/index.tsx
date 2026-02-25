import { useNavigate } from 'react-router-dom';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';

const NotFoundPage = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="ui-card p-10 text-center max-w-lg w-full">
        <div className="text-6xl font-black ui-title mb-2" style={{ color: 'rgb(var(--primary))' }}>
          404
        </div>
        <h2 className="text-2xl font-semibold mb-3 ui-title">{t('notFound.title')}</h2>
        <p className="ui-muted mb-6">{t('notFound.subtitle')}</p>
        <button onClick={() => navigate('/')} className="ui-btn ui-btn-primary w-full">
          {t('notFound.goHome')}
        </button>
      </div>
    </main>
  );
};

export default NotFoundPage;