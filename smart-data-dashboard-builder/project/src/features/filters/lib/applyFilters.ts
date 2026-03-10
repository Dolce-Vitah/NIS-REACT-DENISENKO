import type { DatasetRecord } from '../../../entities/dataset/types';
import type { GlobalFilter } from '../../../store/filtersStore';

function asNumber(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function applyFilters(rows: DatasetRecord[], filters: GlobalFilter[]): DatasetRecord[] {
  if (!filters.length) return rows;

  return rows.filter((row) => {
    for (const f of filters) {
      const value = row[f.field];

      if (f.type === 'number-range') {
        const num = asNumber(value);
        if (num === null) return false;
        if (f.min !== null && num < f.min) return false;
        if (f.max !== null && num > f.max) return false;
      }

      if (f.type === 'category') {
        const str = String(value ?? '');
        if (f.values.length > 0 && !f.values.includes(str)) return false;
      }
    }
    return true;
  });
}