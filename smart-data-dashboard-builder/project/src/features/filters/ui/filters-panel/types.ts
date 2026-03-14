import type { GlobalFilter, TextOperator } from '../../../../store/filtersStore';

export type PanelMode = 'basic' | 'advanced';

export type FilterFormatFn = (filter: GlobalFilter) => string;

export type TextFilterOperator = TextOperator;
