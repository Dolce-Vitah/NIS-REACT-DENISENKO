import { describe, expect, it } from 'vitest';
import { applyFilters } from './applyFilters';
import type { DatasetRecord } from '../../../entities/dataset/types';
import type { GlobalFilter } from '../../../store/filtersStore';

const rows: DatasetRecord[] = [
  { city: 'Berlin', revenue: 120, active: true },
  { city: 'Paris', revenue: 80, active: false },
  { city: 'Berlin', revenue: 60, active: true },
];

describe('applyFilters', () => {
  it('returns all rows when filter list is empty', () => {
    expect(applyFilters(rows, [])).toEqual(rows);
  });

  it('applies number range filters', () => {
    const filters: GlobalFilter[] = [{ type: 'number-range', field: 'revenue', min: 70, max: 130 }];
    const filtered = applyFilters(rows, filters);

    expect(filtered).toHaveLength(2);
    expect(filtered.map((r) => r.city)).toEqual(['Berlin', 'Paris']);
  });

  it('applies category filters', () => {
    const filters: GlobalFilter[] = [{ type: 'category', field: 'city', values: ['Paris'] }];
    const filtered = applyFilters(rows, filters);

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.city).toBe('Paris');
  });
});
