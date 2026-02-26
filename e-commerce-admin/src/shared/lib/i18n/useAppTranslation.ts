import { useTranslation, type UseTranslationResponse } from 'react-i18next';

export function useAppTranslation(): UseTranslationResponse<'translation', undefined> {
  return useTranslation();
}

