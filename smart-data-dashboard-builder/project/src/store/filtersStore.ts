import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NumberRangeFilter = {
  type: 'number-range';
  field: string;
  min: number | null;
  max: number | null;
};

export type CategoryFilter = {
  type: 'category';
  field: string;
  values: string[];
};

export type TextOperator = 'contains' | 'startsWith' | 'equals' | 'isNull';

export type TextFilter = {
  type: 'text';
  field: string;
  operator: TextOperator;
  value: string;
};

export type GlobalFilter = NumberRangeFilter | CategoryFilter | TextFilter;

export type SavedFilterSet = {
  id: string;
  name: string;
  filters: GlobalFilter[];
};

type FiltersState = {
  filters: GlobalFilter[];
  historyPast: GlobalFilter[][];
  historyFuture: GlobalFilter[][];
  savedSets: SavedFilterSet[];
  pinnedFields: string[];
  upsertNumberRangeFilter: (field: string, min: number | null, max: number | null) => void;
  upsertCategoryFilter: (field: string, values: string[]) => void;
  upsertTextFilter: (field: string, operator: TextOperator, value: string) => void;
  toggleCategoryValueFilter: (field: string, value: string) => void;
  removeFilter: (field: string) => void;
  resetFilters: () => void;
  setFilters: (filters: GlobalFilter[]) => void;
  togglePinnedField: (field: string) => void;
  saveCurrentFilterSet: (name: string) => void;
  applySavedFilterSet: (setId: string) => void;
  removeSavedFilterSet: (setId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set, get) => ({
      filters: [],
      historyPast: [],
      historyFuture: [],
      savedSets: [],
      pinnedFields: [],

      upsertNumberRangeFilter: (field, min, max) =>
        set((state) => {
          const next = state.filters.filter((f) => f.field !== field);
          next.push({ type: 'number-range', field, min, max });
          return {
            filters: next,
            historyPast: [...state.historyPast, state.filters].slice(-40),
            historyFuture: [],
          };
        }),

      upsertCategoryFilter: (field, values) =>
        set((state) => {
          const next = state.filters.filter((f) => f.field !== field);
          next.push({ type: 'category', field, values });
          return {
            filters: next,
            historyPast: [...state.historyPast, state.filters].slice(-40),
            historyFuture: [],
          };
        }),

      upsertTextFilter: (field, operator, value) =>
        set((state) => {
          const next = state.filters.filter((f) => f.field !== field);
          next.push({ type: 'text', field, operator, value });
          return {
            filters: next,
            historyPast: [...state.historyPast, state.filters].slice(-40),
            historyFuture: [],
          };
        }),

      toggleCategoryValueFilter: (field, value) =>
        set((state) => {
          const existing = state.filters.find(
            (f): f is CategoryFilter => f.field === field && f.type === 'category'
          );
          const next = state.filters.filter((f) => f.field !== field);
          let nextValues: string[] = [value];

          if (existing) {
            if (existing.values.includes(value)) {
              nextValues = existing.values.filter((v) => v !== value);
            } else {
              nextValues = [...existing.values, value];
            }
          }

          if (nextValues.length) {
            next.push({ type: 'category', field, values: nextValues });
          }

          return {
            filters: next,
            historyPast: [...state.historyPast, state.filters].slice(-40),
            historyFuture: [],
          };
        }),

      removeFilter: (field) =>
        set((state) => ({
          filters: state.filters.filter((f) => f.field !== field),
          historyPast: [...state.historyPast, state.filters].slice(-40),
          historyFuture: [],
        })),

      resetFilters: () =>
        set((state) => ({
          filters: [],
          historyPast: [...state.historyPast, state.filters].slice(-40),
          historyFuture: [],
        })),

      setFilters: (filters) =>
        set((state) => ({
          filters,
          historyPast: [...state.historyPast, state.filters].slice(-40),
          historyFuture: [],
        })),
      togglePinnedField: (field) =>
        set((state) => ({
          pinnedFields: state.pinnedFields.includes(field)
            ? state.pinnedFields.filter((f) => f !== field)
            : [...state.pinnedFields, field],
        })),
      saveCurrentFilterSet: (name) =>
        set((state) => ({
          savedSets: [
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name,
              filters: state.filters,
            },
            ...state.savedSets,
          ].slice(0, 20),
        })),
      applySavedFilterSet: (setId) =>
        set((state) => {
          const selected = state.savedSets.find((setItem) => setItem.id === setId);
          if (!selected) return state;
          return {
            filters: selected.filters,
            historyPast: [...state.historyPast, state.filters].slice(-40),
            historyFuture: [],
          };
        }),
      removeSavedFilterSet: (setId) =>
        set((state) => ({
          savedSets: state.savedSets.filter((setItem) => setItem.id !== setId),
        })),
      undo: () =>
        set((state) => {
          const previous = state.historyPast[state.historyPast.length - 1];
          if (!previous) return state;
          return {
            filters: previous,
            historyPast: state.historyPast.slice(0, -1),
            historyFuture: [state.filters, ...state.historyFuture].slice(0, 40),
          };
        }),
      redo: () =>
        set((state) => {
          const next = state.historyFuture[0];
          if (!next) return state;
          return {
            filters: next,
            historyPast: [...state.historyPast, state.filters].slice(-40),
            historyFuture: state.historyFuture.slice(1),
          };
        }),
      canUndo: () => get().historyPast.length > 0,
      canRedo: () => get().historyFuture.length > 0,
    }),
    {
      name: 'filters-store-v1',
      version: 2,
      partialize: (state) => ({
        filters: state.filters,
        savedSets: state.savedSets,
        pinnedFields: state.pinnedFields,
      }),
    }
  )
);
