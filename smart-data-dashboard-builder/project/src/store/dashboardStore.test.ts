import { beforeEach, describe, expect, it } from 'vitest';
import { useDashboardStore } from './dashboardStore';

describe('dashboardStore', () => {
  beforeEach(() => {
    useDashboardStore.setState({ widgets: [], layouts: [], activeWidgetId: null });
  });

  it('adds and updates a KPI widget with type-safe updater', () => {
    const state = useDashboardStore.getState();
    state.addWidget('kpi');

    const widget = useDashboardStore.getState().widgets[0];
    expect(widget?.type).toBe('kpi');
    expect(widget?.title).toBe('KPI');

    if (!widget || widget.type !== 'kpi') return;
    useDashboardStore.getState().setWidgetTitle(widget.id, 'Revenue KPI');
    useDashboardStore.getState().updateKpiWidget(widget.id, {
      aggregation: 'sum',
      valueField: 'revenue',
    });

    const updated = useDashboardStore.getState().widgets[0];
    expect(updated?.title).toBe('Revenue KPI');
    if (!updated || updated.type !== 'kpi') return;
    expect(updated.aggregation).toBe('sum');
    expect(updated.valueField).toBe('revenue');
  });

  it('duplicates table widget and preserves data shape', () => {
    const state = useDashboardStore.getState();
    state.addWidget('table');

    const widget = useDashboardStore.getState().widgets[0];
    if (!widget || widget.type !== 'table') return;

    useDashboardStore
      .getState()
      .updateTableWidget(widget.id, { columns: ['city', 'sales'], limit: 25 });
    useDashboardStore.getState().duplicateWidget(widget.id);

    const widgets = useDashboardStore.getState().widgets;
    expect(widgets).toHaveLength(2);

    const copy = widgets[1];
    expect(copy?.title).toContain('(copy)');
    if (!copy || copy.type !== 'table') return;
    expect(copy.columns).toEqual(['city', 'sales']);
    expect(copy.limit).toBe(25);
  });
});
