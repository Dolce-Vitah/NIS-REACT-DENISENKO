import { useMemo } from 'react';
import { useI18nStore } from '../../store/i18nStore';
import { getTranslations } from './translations';

export function useI18n() {
  const language = useI18nStore((s) => s.language);
  const setLanguage = useI18nStore((s) => s.setLanguage);

  const t = useMemo(() => getTranslations(language), [language]);

  return { language, setLanguage, t };
}
