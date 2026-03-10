import type { WidgetConfig } from '../widget/types';
import type { WidgetLayout } from '../widget/layout';
import type { GlobalFilter } from '../../store/filtersStore';

export type DashboardConfig = {
  version: 1;
  widgets: WidgetConfig[];
  layouts: WidgetLayout[];
  filters: GlobalFilter[];
};