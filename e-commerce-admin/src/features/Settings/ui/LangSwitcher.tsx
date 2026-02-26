import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { type RootState } from '@/app/store';
import { setLanguage } from '@/entities/Settings/model/settingsSlice';
import i18n from '@/shared/config/i18n/i18n';

export const LangSwitcher = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.settings.language);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);

  const toggleLanguage = () => {
    const newLang = language === 'ru' ? 'en' : 'ru';
    dispatch(setLanguage(newLang));
    
    // We use i18n.getFixedT here because the component might not have re-rendered with new lang yet
    const tNext = i18n.getFixedT(newLang);
    const langName = newLang === 'ru' ? 'Русский' : 'English';
    toast.success(tNext('settings.languageChanged', { defaultValue: `Language changed to ${langName}` }));
  };

  return (
    <button onClick={toggleLanguage} className="ui-btn ui-btn-secondary h-10 px-3">
      {language.toUpperCase()}
    </button>
  );
};