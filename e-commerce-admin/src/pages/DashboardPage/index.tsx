import { useSelector } from 'react-redux';
import { type RootState } from '@/app/store';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';

const DashboardPage = () => {
  const { t } = useAppTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <section className="flex flex-col gap-6" aria-label={t('nav.dashboard')}>
      <h1 className="text-3xl font-bold ui-title">{t('nav.dashboard')}</h1>
      
      <div className="ui-card p-6 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5">
        <h2 className="text-xl font-medium mb-2">
          {t('dashboard.welcome', { name: user?.firstName || user?.username || t('dashboard.admin') })}
        </h2>
        <p className="ui-muted">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="ui-card-muted p-4 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold ui-muted">{t('dashboard.cards.orders')}</div>
            <span className="ui-badge" style={{ borderColor: 'rgb(var(--primary) / 0.35)' }}>+8%</span>
          </div>
          <div className="text-3xl font-bold mt-2 ui-title">150</div>
          <div className="mt-3 h-1.5 rounded-full" style={{ background: 'rgb(var(--primary) / 0.18)' }}>
            <div className="h-1.5 rounded-full" style={{ width: '62%', background: 'rgb(var(--primary) / 0.75)' }} />
          </div>
        </div>
        <div className="ui-card-muted p-4 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold ui-muted">{t('dashboard.cards.revenue')}</div>
            <span className="ui-badge" style={{ borderColor: 'rgba(16, 185, 129, 0.35)' }}>+3%</span>
          </div>
          <div className="text-3xl font-bold mt-2 ui-title">$12,450</div>
          <div className="mt-3 h-1.5 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.16)' }}>
            <div className="h-1.5 rounded-full" style={{ width: '48%', background: 'rgba(16, 185, 129, 0.75)' }} />
          </div>
        </div>
        <div className="ui-card-muted p-4 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold ui-muted">{t('dashboard.cards.activeUsers')}</div>
            <span className="ui-badge" style={{ borderColor: 'rgba(56, 189, 248, 0.35)' }}>+12%</span>
          </div>
          <div className="text-3xl font-bold mt-2 ui-title">89</div>
          <div className="mt-3 h-1.5 rounded-full" style={{ background: 'rgba(56, 189, 248, 0.16)' }}>
            <div className="h-1.5 rounded-full" style={{ width: '74%', background: 'rgba(56, 189, 248, 0.75)' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;