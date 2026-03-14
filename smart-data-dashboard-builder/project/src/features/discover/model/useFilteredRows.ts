import { useMemo } from 'react';
import { useDataStore } from '../../../store/dataStore';
import { useDiscoverStore } from '../../../store/discoverStore';
import { useFiltersStore } from '../../../store/filtersStore';
import { applyFilters } from '../../filters/lib/applyFilters';
import { applyDiscoverQuery, applyDiscoverTimeFilter } from '../lib/query';

export function useFilteredRows() {
  const rows = useDataStore((s) => s.rows);
  const filters = useFiltersStore((s) => s.filters);
  const query = useDiscoverStore((s) => s.query);
  const timeField = useDiscoverStore((s) => s.timeField);
  const timeRange = useDiscoverStore((s) => s.timeRange);

  const filteredRows = useMemo(() => {
    const base = applyFilters(rows, filters);
    const queried = applyDiscoverQuery(base, query);
    return applyDiscoverTimeFilter(queried, timeField, timeRange);
  }, [rows, filters, query, timeField, timeRange]);

  return { rows, filteredRows, filtersCount: filters.length, query, timeField, timeRange };
}
