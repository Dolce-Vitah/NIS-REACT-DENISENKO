import type { GlobalFilter } from '../../../../store/filtersStore';

export function formatFilterLabel(filter: GlobalFilter): string {
  if (filter.type === 'number-range') {
    return `${filter.field}: ${filter.min ?? '-∞'}..${filter.max ?? '+∞'}`;
  }

  if (filter.type === 'category') {
    return `${filter.field} IN (${filter.values.length})`;
  }

  return `${filter.field} ${filter.operator}${filter.value ? ` "${filter.value}"` : ''}`;
}

export function formatActiveFilterRowLabel(filter: GlobalFilter): string {
  if (filter.type === 'number-range') {
    return `${filter.field}: [${filter.min ?? '-∞'} .. ${filter.max ?? '+∞'}]`;
  }

  if (filter.type === 'category') {
    return `${filter.field}: ${filter.values.length ? filter.values.join(', ') : '(all)'}`;
  }

  return `${filter.field}: ${filter.operator}${filter.value ? ` "${filter.value}"` : ''}`;
}
