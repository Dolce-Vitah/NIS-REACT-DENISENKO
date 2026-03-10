import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppLanguage = 'en' | 'ru';

type I18nState = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
};

function detectLanguage(): AppLanguage {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: detectLanguage(),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'i18n-store-v1',
      version: 1,
    }
  )
);
