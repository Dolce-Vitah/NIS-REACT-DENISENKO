import type { WidgetConfig } from '../widget/types';
import type { WidgetLayout } from '../widget/layout';
import type { GlobalFilter } from '../../store/filtersStore';
import type { WorkspaceMode } from '../../store/layoutUiStore';
import type { DiscoverTimeRange } from '../../features/discover/lib/query';
import type { DiscoverLayoutState } from '../../store/discoverStore';

export type DashboardDiscoverState = {
  query: string;
  timeField: string | null;
  timeRange: DiscoverTimeRange;
  layout?: DiscoverLayoutState;
};

export type DashboardConfig = {
  version: 1;
  widgets: WidgetConfig[];
  layouts: WidgetLayout[];
  filters: GlobalFilter[];
  discover?: DashboardDiscoverState;
};

export type DashboardBookmark = {
  id: string;
  name: string;
  createdAt: string;
  payload: DashboardConfig & { workspaceMode: WorkspaceMode };
};
