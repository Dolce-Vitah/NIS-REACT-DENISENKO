import { create } from 'zustand';

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

export type GlobalFilter = NumberRangeFilter | CategoryFilter;

type FiltersState = {
  filters: GlobalFilter[];
  upsertNumberRangeFilter: (field: string, min: number | null, max: number | null) => void;
  upsertCategoryFilter: (field: string, values: string[]) => void;
  removeFilter: (field: string) => void;
  resetFilters: () => void;
  setFilters: (filters: GlobalFilter[]) => void;
};

export const useFiltersStore = create<FiltersState>((set) => ({
  filters: [],

  upsertNumberRangeFilter: (field, min, max) =>
    set((s) => {
      const next = s.filters.filter((f) => f.field !== field);
      next.push({ type: 'number-range', field, min, max });
      return { filters: next };
    }),

  upsertCategoryFilter: (field, values) =>
    set((s) => {
      const next = s.filters.filter((f) => f.field !== field);
      next.push({ type: 'category', field, values });
      return { filters: next };
    }),

  removeFilter: (field) =>
    set((s) => ({ filters: s.filters.filter((f) => f.field !== field) })),

  resetFilters: () => set({ filters: [] }),

  setFilters: (filters) => set({ filters }),
}));