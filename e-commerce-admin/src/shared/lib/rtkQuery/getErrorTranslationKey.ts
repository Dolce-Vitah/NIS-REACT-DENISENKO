import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { type SerializedError } from '@reduxjs/toolkit';

export function getErrorTranslationKey(
  error: FetchBaseQueryError | SerializedError | undefined,
): string {
  if (!error) return 'errors.unknown';

  if ('status' in error) {
    const status = error.status;
    if (status === 'FETCH_ERROR') return 'errors.network';
    if (status === 'PARSING_ERROR') return 'errors.parse';
    if (status === 401) return 'errors.unauthorized';
    if (status === 403) return 'errors.forbidden';
    if (status === 404) return 'errors.notFound';
    if (typeof status === 'number' && status >= 500) return 'errors.server';
    return 'errors.request';
  }

  return 'errors.unknown';
}

