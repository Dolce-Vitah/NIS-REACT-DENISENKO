import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getDefaultWidgetStyleByType } from '../entities/widget/types';
import type {
  BarWidgetConfig,
  KpiWidgetConfig,
  LineWidgetConfig,
  PieWidgetConfig,
  TableWidgetConfig,
  WidgetStyleConfig,
  ThreeScatterWidgetConfig,
  ThreeSurfaceWidgetConfig,
  ThreeWidgetConfig,
  WidgetConfig,
  WidgetType,
} from '../entities/widget/types';
import type { WidgetLayout } from '../entities/widget/layout';

type DashboardSnapshot = {
  widgets: WidgetConfig[];
  layouts: WidgetLayout[];
  activeWidgetId: string | null;
};

type DashboardState = {
  widgets: WidgetConfig[];
  layouts: WidgetLayout[];
  activeWidgetId: string | null;
  historyPast: DashboardSnapshot[];
  historyFuture: DashboardSnapshot[];

  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  duplicateWidget: (id: string) => void;
  setActiveWidget: (id: string | null) => void;
  setWidgetTitle: (id: string, title: string) => void;
  updateWidgetStyle: (id: string, patch: Partial<WidgetStyleConfig>) => void;
  updateKpiWidget: (
    id: string,
    patch: Partial<
      Pick<KpiWidgetConfig, 'aggregation' | 'valueField' | 'comparisonField' | 'comparisonValue'>
    >
  ) => void;
  updateTableWidget: (
    id: string,
    patch: Partial<Pick<TableWidgetConfig, 'columns' | 'limit'>>
  ) => void;
  updateBarWidget: (
    id: string,
    patch: Partial<Pick<BarWidgetConfig, 'categoryField' | 'valueField'>>
  ) => void;
  updateLineWidget: (
    id: string,
    patch: Partial<Pick<LineWidgetConfig, 'xField' | 'yField'>>
  ) => void;
  updatePieWidget: (
    id: string,
    patch: Partial<Pick<PieWidgetConfig, 'categoryField' | 'valueField'>>
  ) => void;
  updateThreeWidget: (
    id: string,
    patch: Partial<Pick<ThreeWidgetConfig, 'categoryField' | 'valueField'>>
  ) => void;
  updateThreeScatterWidget: (
    id: string,
    patch: Partial<Pick<ThreeScatterWidgetConfig, 'xField' | 'yField' | 'zField' | 'categoryField'>>
  ) => void;
  updateThreeSurfaceWidget: (
    id: string,
    patch: Partial<Pick<ThreeSurfaceWidgetConfig, 'xField' | 'yField' | 'zField'>>
  ) => void;
  setLayouts: (layouts: WidgetLayout[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  setDashboardState: (payload: { widgets: WidgetConfig[]; layouts: WidgetLayout[] }) => void;
  clearDashboardState: () => void;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultWidget(type: WidgetType): WidgetConfig {
  const id = uid();
  const style = getDefaultWidgetStyleByType(type);

  if (type === 'kpi')
    return { id, type, title: 'KPI', aggregation: 'count', valueField: undefined, style };
  if (type === 'table') return { id, type, title: 'Table', columns: [], limit: 10, style };
  if (type === 'bar')
    return { id, type, title: 'Bar Chart', categoryField: undefined, valueField: undefined, style };
  if (type === 'line')
    return { id, type, title: 'Line Chart', xField: undefined, yField: undefined, style };
  if (type === 'pie')
    return {
      id,
      type: 'pie',
      title: 'Pie Chart',
      categoryField: undefined,
      valueField: undefined,
      style,
    };
  if (type === 'threeScatter') {
    return {
      id,
      type: 'threeScatter',
      title: '3D Scatter',
      xField: undefined,
      yField: undefined,
      zField: undefined,
      categoryField: undefined,
      style,
    };
  }
  if (type === 'threeSurface') {
    return {
      id,
      type: 'threeSurface',
      title: '3D Surface',
      xField: undefined,
      yField: undefined,
      zField: undefined,
      style,
    };
  }
  return {
    id,
    type: 'three',
    title: '3D Bars',
    categoryField: undefined,
    valueField: undefined,
    style,
  };
}

function defaultLayout(i: string, index: number): WidgetLayout {
  return { i, x: (index * 4) % 12, y: Math.floor(index / 3) * 4, w: 4, h: 4, minW: 3, minH: 3 };
}

function cloneWidget(original: WidgetConfig, copyId: string): WidgetConfig {
  const title = `${original.title} (copy)`;
  if (original.type === 'kpi') {
    return {
      ...original,
      id: copyId,
      title,
      style: original.style ? { ...original.style } : undefined,
    };
  }
  if (original.type === 'table') {
    return {
      ...original,
      id: copyId,
      title,
      columns: [...original.columns],
      style: original.style ? { ...original.style } : undefined,
    };
  }
  if (original.type === 'bar') {
    return {
      ...original,
      id: copyId,
      title,
      style: original.style ? { ...original.style } : undefined,
    };
  }
  if (original.type === 'line') {
    return {
      ...original,
      id: copyId,
      title,
      style: original.style ? { ...original.style } : undefined,
    };
  }
  if (original.type === 'pie') {
    return {
      ...original,
      id: copyId,
      title,
      style: original.style ? { ...original.style } : undefined,
    };
  }
  if (original.type === 'threeScatter') {
    return {
      ...original,
      id: copyId,
      title,
      style: original.style ? { ...original.style } : undefined,
    };
  }
  if (original.type === 'threeSurface') {
    return {
      ...original,
      id: copyId,
      title,
      style: original.style ? { ...original.style } : undefined,
    };
  }
  return {
    ...original,
    id: copyId,
    title,
    style: original.style ? { ...original.style } : undefined,
  };
}

function currentSnapshot(state: DashboardState): DashboardSnapshot {
  return {
    widgets: state.widgets,
    layouts: state.layouts,
    activeWidgetId: state.activeWidgetId,
  };
}

function withHistory(
  set: (
    partial: Partial<DashboardState> | ((state: DashboardState) => Partial<DashboardState>)
  ) => void,
  get: () => DashboardState,
  updater: (state: DashboardState) => Partial<DashboardState>
): void {
  set((state) => {
    const next = updater(state);
    const nextWidgets = next.widgets ?? state.widgets;
    const nextLayouts = next.layouts ?? state.layouts;
    if (nextWidgets === state.widgets && nextLayouts === state.layouts) return next;
    const past = [...state.historyPast, currentSnapshot(state)].slice(-60);
    return { ...next, historyPast: past, historyFuture: [] };
  });
  // keep store get referenced to satisfy caller contracts and ensure closure stability
  void get;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: [],
      layouts: [],
      activeWidgetId: null,
      historyPast: [],
      historyFuture: [],

      addWidget: (type) =>
        withHistory(set, get, (state) => {
          const widget = defaultWidget(type);
          const layout = defaultLayout(widget.id, state.widgets.length);
          return {
            widgets: [...state.widgets, widget],
            layouts: [...state.layouts, layout],
            activeWidgetId: widget.id,
          };
        }),

      removeWidget: (id) =>
        withHistory(set, get, (state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
          layouts: state.layouts.filter((l) => l.i !== id),
          activeWidgetId: state.activeWidgetId === id ? null : state.activeWidgetId,
        })),

      duplicateWidget: (id) =>
        withHistory(set, get, (state) => {
          const original = state.widgets.find((w) => w.id === id);
          const originalLayout = state.layouts.find((l) => l.i === id);
          if (!original) return state;
          const copyId = uid();
          const copy = cloneWidget(original, copyId);
          const copyLayout: WidgetLayout = originalLayout
            ? {
                ...originalLayout,
                i: copyId,
                x: (originalLayout.x + 1) % 12,
                y: originalLayout.y + 1,
              }
            : defaultLayout(copyId, state.widgets.length);
          return {
            widgets: [...state.widgets, copy],
            layouts: [...state.layouts, copyLayout],
            activeWidgetId: copyId,
          };
        }),

      setActiveWidget: (id) => set({ activeWidgetId: id }),

      setWidgetTitle: (id, title) =>
        withHistory(set, get, (state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, title } : w)),
        })),

      updateWidgetStyle: (id, patch) =>
        withHistory(set, get, (state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id
              ? { ...w, style: { ...getDefaultWidgetStyleByType(w.type), ...w.style, ...patch } }
              : w
          ),
        })),

      updateKpiWidget: (id, patch) =>
        withHistory(set, get, (state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id && w.type === 'kpi' ? { ...w, ...patch } : w
          ),
        })),

      updateTableWidget: (id, patch) =>
        withHistory(set, get, (state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id && w.type === 'table' ? { ...w, ...patch } : w
          ),
        })),

      updateBarWidget: (id, patch) =>
        withHistory(set, get, (state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id && w.type === 'bar' ? { ...w, ...patch } : w
          ),
        })),

      updateLineWidget: (id, patch) =>
        withHistory(set, get, (state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id && w.type === 'line' ? { ...w, ...patch } : w
          ),
        })),

      updatePieWidget: (id, patch) =>
        withHistory(set, get, (state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id && w.type === 'pie' ? { ...w, ...patch } : w
          ),
        })),

      updateThreeWidget: (id, patch) =>
        withHistory(set, get, (state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id && w.type === 'three' ? { ...w, ...patch } : w
          ),
        })),

      updateThreeScatterWidget: (id, patch) =>
        withHistory(set, get, (state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id && w.type === 'threeScatter' ? { ...w, ...patch } : w
          ),
        })),
      updateThreeSurfaceWidget: (id, patch) =>
        withHistory(set, get, (state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id && w.type === 'threeSurface' ? { ...w, ...patch } : w
          ),
        })),

      setLayouts: (layouts) =>
        withHistory(set, get, () => ({
          layouts,
        })),

      undo: () =>
        set((state) => {
          const previous = state.historyPast[state.historyPast.length - 1];
          if (!previous) return state;
          return {
            widgets: previous.widgets,
            layouts: previous.layouts,
            activeWidgetId: previous.activeWidgetId,
            historyPast: state.historyPast.slice(0, -1),
            historyFuture: [currentSnapshot(state), ...state.historyFuture].slice(0, 60),
          };
        }),

      redo: () =>
        set((state) => {
          const next = state.historyFuture[0];
          if (!next) return state;
          return {
            widgets: next.widgets,
            layouts: next.layouts,
            activeWidgetId: next.activeWidgetId,
            historyPast: [...state.historyPast, currentSnapshot(state)].slice(-60),
            historyFuture: state.historyFuture.slice(1),
          };
        }),

      canUndo: () => get().historyPast.length > 0,
      canRedo: () => get().historyFuture.length > 0,

      setDashboardState: ({ widgets, layouts }) =>
        withHistory(set, get, () => ({
          widgets,
          layouts,
          activeWidgetId: widgets.length ? widgets[0].id : null,
        })),

      clearDashboardState: () =>
        withHistory(set, get, () => ({
          widgets: [],
          layouts: [],
          activeWidgetId: null,
        })),
    }),
    {
      name: 'dashboard-store-v1',
      version: 2,
      partialize: (state) => ({
        widgets: state.widgets,
        layouts: state.layouts,
        activeWidgetId: state.activeWidgetId,
      }),
    }
  )
);
