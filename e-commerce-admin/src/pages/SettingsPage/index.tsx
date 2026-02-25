import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/app/store';
import { setLanguage, toggleTheme, setItemsPerPage } from '@/entities/Settings/model/settingsSlice';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';

const SettingsPage = () => {
  const { t } = useAppTranslation();
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  return (
    <section className="max-w-2xl ui-card p-6" aria-label={t('nav.settings')}>
      <h1 className="text-2xl font-bold mb-6 ui-title">{t('nav.settings')}</h1>
      
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: 'rgb(var(--border))' }}>
          <span className="text-lg font-semibold">{t('settings.theme')}</span>
          <button 
            onClick={() => dispatch(toggleTheme())}
            className="ui-btn ui-btn-primary"
          >
            {settings.theme === 'light' ? t('settings.themeDark') : t('settings.themeLight')}
          </button>
        </div>

        <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: 'rgb(var(--border))' }}>
          <span className="text-lg font-semibold">{t('settings.language')}</span>
          <button
            onClick={() => dispatch(setLanguage(settings.language === 'ru' ? 'en' : 'ru'))}
            className="ui-btn ui-btn-secondary"
          >
            {settings.language.toUpperCase()}
          </button>
        </div>

        <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: 'rgb(var(--border))' }}>
          <label htmlFor="items-per-page" className="text-lg font-semibold">
            {t('settings.itemsPerPage')}
          </label>
          <select 
            id="items-per-page"
            value={settings.itemsPerPage}
            onChange={(e) => dispatch(setItemsPerPage(Number(e.target.value)))}
            className="ui-input"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;