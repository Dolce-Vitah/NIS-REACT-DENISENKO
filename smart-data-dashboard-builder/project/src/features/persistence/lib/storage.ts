import type { DashboardBookmark, DashboardConfig } from '../../../entities/dashboard/types';
import type { WidgetConfig } from '../../../entities/widget/types';
import type { WidgetLayout } from '../../../entities/widget/layout';
import type { GlobalFilter } from '../../../store/filtersStore';
import type { DiscoverLayoutState } from '../../../store/discoverStore';
import type { DiscoverTimeRange } from '../../discover/lib/query';

const STORAGE_KEY = 'smart-dashboard-config-v1';
const BOOKMARKS_STORAGE_KEY = 'smart-dashboard-bookmarks-v1';

type LoadDashboardResult =
  | { status: 'ok'; data: DashboardConfig }
  | { status: 'missing' }
  | { status: 'invalid' };

type BookmarkStorageResult =
  | { status: 'ok'; data: DashboardBookmark[] }
  | { status: 'missing' }
  | { status: 'invalid' };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((item) => typeof item === 'string');
}

function isWorkspaceMode(v: unknown): v is 'build' | 'analyze' | 'present' | 'discover' {
  return v === 'build' || v === 'analyze' || v === 'present' || v === 'discover';
}

function isDiscoverTimeRange(v: unknown): v is DiscoverTimeRange {
  return v === 'all' || v === 'last15m' || v === 'last24h' || v === 'last7d' || v === 'last30d';
}

function isDiscoverLayout(value: unknown): value is DiscoverLayoutState {
  if (!isRecord(value)) return false;
  return (
    isStringArray(value.visibleFields) &&
    isFiniteNumber(value.pageSize) &&
    isFiniteNumber(value.currentPage) &&
    (value.sortField === null || typeof value.sortField === 'string') &&
    (value.sortDirection === 'asc' || value.sortDirection === 'desc') &&
    (value.statsField === null || typeof value.statsField === 'string') &&
    isFiniteNumber(value.splitRatio)
  );
}

function isWidgetLayout(v: unknown): v is WidgetLayout {
  if (!isRecord(v)) return false;
  return (
    typeof v.i === 'string' &&
    isFiniteNumber(v.x) &&
    isFiniteNumber(v.y) &&
    isFiniteNumber(v.w) &&
    isFiniteNumber(v.h) &&
    (v.minW === undefined || isFiniteNumber(v.minW)) &&
    (v.minH === undefined || isFiniteNumber(v.minH))
  );
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string';
}

function isCategoryValueWidget(v: Record<string, unknown>): boolean {
  return isOptionalString(v.categoryField) && isOptionalString(v.valueField);
}

function isWidgetStyleConfig(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const hasBackgroundColor =
    value.backgroundColor === undefined || typeof value.backgroundColor === 'string';
  return (
    isFiniteNumber(value.glassBlur) &&
    isFiniteNumber(value.cornerRadius) &&
    isFiniteNumber(value.shadowDepth) &&
    isFiniteNumber(value.borderContrast) &&
    hasBackgroundColor &&
    (value.chartPalette === 'indigo' ||
      value.chartPalette === 'emerald' ||
      value.chartPalette === 'sunset' ||
      value.chartPalette === 'mono')
  );
}

function isBaseWidgetConfig(v: unknown): v is Record<string, unknown> {
  if (!isRecord(v)) return false;
  if (typeof v.id !== 'string' || typeof v.title !== 'string') return false;
  if (v.style !== undefined && !isWidgetStyleConfig(v.style)) return false;
  return true;
}

function isWidgetConfig(v: unknown): v is WidgetConfig {
  if (!isBaseWidgetConfig(v)) return false;
  if (v.type === 'kpi') {
    return (
      (v.valueField === undefined || typeof v.valueField === 'string') &&
      (v.comparisonField === undefined || typeof v.comparisonField === 'string') &&
      (v.comparisonValue === undefined || typeof v.comparisonValue === 'string') &&
      (v.aggregation === 'count' || v.aggregation === 'sum' || v.aggregation === 'avg')
    );
  }
  if (v.type === 'table') {
    return isStringArray(v.columns) && isFiniteNumber(v.limit);
  }
  if (v.type === 'bar' || v.type === 'pie' || v.type === 'three') {
    return isCategoryValueWidget(v);
  }
  if (v.type === 'line') {
    return isOptionalString(v.xField) && isOptionalString(v.yField);
  }
  if (v.type === 'threeScatter') {
    return (
      isOptionalString(v.xField) &&
      isOptionalString(v.yField) &&
      isOptionalString(v.zField) &&
      isOptionalString(v.categoryField)
    );
  }
  if (v.type === 'threeSurface') {
    return isOptionalString(v.xField) && isOptionalString(v.yField) && isOptionalString(v.zField);
  }
  return false;
}

function isGlobalFilter(v: unknown): v is GlobalFilter {
  if (!isRecord(v) || typeof v.field !== 'string') return false;
  if (v.type === 'number-range') {
    return (v.min === null || isFiniteNumber(v.min)) && (v.max === null || isFiniteNumber(v.max));
  }
  if (v.type === 'category') {
    return isStringArray(v.values);
  }
  if (v.type === 'text') {
    return (
      typeof v.value === 'string' &&
      (v.operator === 'contains' ||
        v.operator === 'startsWith' ||
        v.operator === 'equals' ||
        v.operator === 'isNull')
    );
  }
  return false;
}

function parseDashboardConfig(value: unknown): DashboardConfig | null {
  if (!isRecord(value) || value.version !== 1) return null;
  if (!Array.isArray(value.widgets) || !value.widgets.every(isWidgetConfig)) return null;
  if (!Array.isArray(value.layouts) || !value.layouts.every(isWidgetLayout)) return null;
  if (!Array.isArray(value.filters) || !value.filters.every(isGlobalFilter)) return null;
  let discover: DashboardConfig['discover'] | undefined;
  if (value.discover !== undefined) {
    if (!isRecord(value.discover)) return null;
    if (typeof value.discover.query !== 'string') return null;
    if (value.discover.timeField !== null && typeof value.discover.timeField !== 'string')
      return null;
    if (!isDiscoverTimeRange(value.discover.timeRange)) return null;
    if (value.discover.layout !== undefined && !isDiscoverLayout(value.discover.layout))
      return null;
    discover = {
      query: value.discover.query,
      timeField: value.discover.timeField,
      timeRange: value.discover.timeRange,
      layout: value.discover.layout,
    };
  }
  return {
    version: 1,
    widgets: value.widgets,
    layouts: value.layouts,
    filters: value.filters,
    discover,
  };
}

export function saveDashboardToStorage(config: DashboardConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadDashboardFromStorage(): LoadDashboardResult {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { status: 'missing' };

  try {
    const parsed = parseDashboardConfig(JSON.parse(raw));
    if (!parsed) return { status: 'invalid' };
    return { status: 'ok', data: parsed };
  } catch {
    return { status: 'invalid' };
  }
}

export function clearDashboardStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function isDashboardBookmark(v: unknown): v is DashboardBookmark {
  if (!isRecord(v)) return false;
  if (typeof v.id !== 'string' || typeof v.name !== 'string' || typeof v.createdAt !== 'string') {
    return false;
  }
  if (!isRecord(v.payload) || !isWorkspaceMode(v.payload.workspaceMode)) {
    return false;
  }
  return parseDashboardConfig(v.payload) !== null;
}

export function loadBookmarksFromStorage(): BookmarkStorageResult {
  const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
  if (!raw) return { status: 'missing' };

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isDashboardBookmark)) {
      return { status: 'invalid' };
    }
    return { status: 'ok', data: parsed };
  } catch {
    return { status: 'invalid' };
  }
}

export function saveBookmarksToStorage(bookmarks: DashboardBookmark[]): void {
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
}
