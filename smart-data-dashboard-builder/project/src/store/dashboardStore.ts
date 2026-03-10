import { create } from 'zustand';
import type { WidgetConfig, WidgetType } from '../entities/widget/types';
import type { WidgetLayout } from '../entities/widget/layout';

type DashboardState = {
  widgets: WidgetConfig[];
  layouts: WidgetLayout[];
  activeWidgetId: string | null;

  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  duplicateWidget: (id: string) => void;
  setActiveWidget: (id: string | null) => void;
  updateWidget: (id: string, patch: Partial<WidgetConfig>) => void;
  setLayouts: (layouts: WidgetLayout[]) => void;

  setDashboardState: (payload: { widgets: WidgetConfig[]; layouts: WidgetLayout[] }) => void;
  clearDashboardState: () => void;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultWidget(type: WidgetType): WidgetConfig {
  const id = uid();

  if (type === 'kpi') return { id, type, title: 'KPI', aggregation: 'count', valueField: undefined };
  if (type === 'table') return { id, type, title: 'Table', columns: [], limit: 10 };
  if (type === 'bar') return { id, type, title: 'Bar Chart', categoryField: undefined, valueField: undefined };
  if (type === 'line') return { id, type, title: 'Line Chart', xField: undefined, yField: undefined };
  if (type === 'pie') return { id, type: 'pie', title: 'Pie Chart', categoryField: undefined, valueField: undefined };
  return { id, type: 'three', title: '3D Bars', categoryField: undefined, valueField: undefined };
}

function defaultLayout(i: string, index: number): WidgetLayout {
  return { i, x: (index * 4) % 12, y: Math.floor(index / 3) * 4, w: 4, h: 4, minW: 3, minH: 3 };
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  widgets: [],
  layouts: [],
  activeWidgetId: null,

  addWidget: (type) => {
    const w = defaultWidget(type);
    const l = defaultLayout(w.id, get().widgets.length);
    set((s) => ({ widgets: [...s.widgets, w], layouts: [...s.layouts, l], activeWidgetId: w.id }));
  },

  removeWidget: (id) =>
    set((s) => ({
      widgets: s.widgets.filter((w) => w.id !== id),
      layouts: s.layouts.filter((l) => l.i !== id),
      activeWidgetId: s.activeWidgetId === id ? null : s.activeWidgetId,
    })),

  duplicateWidget: (id) =>
    set((s) => {
      const original = s.widgets.find((w) => w.id === id);
      const originalLayout = s.layouts.find((l) => l.i === id);
      if (!original) return s;

      const copyId = uid();
      const copy = { ...original, id: copyId, title: `${original.title} (copy)` } as WidgetConfig;
      const copyLayout: WidgetLayout = originalLayout
        ? { ...originalLayout, i: copyId, x: (originalLayout.x + 1) % 12, y: originalLayout.y + 1 }
        : defaultLayout(copyId, s.widgets.length);

      return { widgets: [...s.widgets, copy], layouts: [...s.layouts, copyLayout], activeWidgetId: copyId };
    }),

  setActiveWidget: (id) => set({ activeWidgetId: id }),

  updateWidget: (id, patch) =>
    set((s) => ({
      widgets: s.widgets.map((w) => (w.id === id ? ({ ...w, ...patch } as WidgetConfig) : w)),
    })),

  setLayouts: (layouts) => set({ layouts }),

  setDashboardState: ({ widgets, layouts }) =>
    set({
      widgets,
      layouts,
      activeWidgetId: widgets.length ? widgets[0].id : null,
    }),

  clearDashboardState: () =>
    set({
      widgets: [],
      layouts: [],
      activeWidgetId: null,
    }),
}));