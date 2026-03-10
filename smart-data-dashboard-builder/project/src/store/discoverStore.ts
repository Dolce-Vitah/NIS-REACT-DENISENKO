import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiscoverTimeRange } from '../features/discover/lib/query';

export type DiscoverSortDirection = 'asc' | 'desc';

export type DiscoverLayoutState = {
  visibleFields: string[];
  pageSize: number;
  currentPage: number;
  sortField: string | null;
  sortDirection: DiscoverSortDirection;
  statsField: string | null;
  splitRatio: number;
};

export type SavedSearch = {
  id: string;
  name: string;
  query: string;
  timeField: string | null;
  timeRange: DiscoverTimeRange;
  layout: DiscoverLayoutState;
};

type DiscoverState = {
  query: string;
  timeField: string | null;
  timeRange: DiscoverTimeRange;
  layout: DiscoverLayoutState;
  savedSearches: SavedSearch[];
  setQuery: (query: string) => void;
  setTimeField: (field: string | null) => void;
  setTimeRange: (range: DiscoverTimeRange) => void;
  setLayout: (patch: Partial<DiscoverLayoutState>) => void;
  setDiscoverState: (state: {
    query: string;
    timeField: string | null;
    timeRange: DiscoverTimeRange;
    layout?: Partial<DiscoverLayoutState>;
  }) => void;
  resetDiscoverState: () => void;
  saveCurrentSearch: (name: string) => void;
  applySavedSearch: (searchId: string) => void;
  removeSavedSearch: (searchId: string) => void;
};

const DEFAULT_LAYOUT: DiscoverLayoutState = {
  visibleFields: [],
  pageSize: 25,
  currentPage: 0,
  sortField: null,
  sortDirection: 'asc',
  statsField: null,
  splitRatio: 0.72,
};

const DEFAULT_DISCOVER = {
  query: '',
  timeField: null as string | null,
  timeRange: 'all' as DiscoverTimeRange,
  layout: DEFAULT_LAYOUT,
};

export const useDiscoverStore = create<DiscoverState>()(
  persist(
    (set) => ({
      ...DEFAULT_DISCOVER,
      savedSearches: [],
      setQuery: (query) => set({ query }),
      setTimeField: (timeField) => set({ timeField }),
      setTimeRange: (timeRange) => set({ timeRange }),
      setLayout: (patch) =>
        set((state) => ({
          layout: {
            ...state.layout,
            ...patch,
          },
        })),
      setDiscoverState: (next) =>
        set(() => ({
          query: next.query,
          timeField: next.timeField,
          timeRange: next.timeRange,
          layout: {
            ...DEFAULT_LAYOUT,
            ...(next.layout ?? {}),
          },
        })),
      resetDiscoverState: () => set({ ...DEFAULT_DISCOVER }),
      saveCurrentSearch: (name) =>
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed) return state;

          const next: SavedSearch = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: trimmed,
            query: state.query,
            timeField: state.timeField,
            timeRange: state.timeRange,
            layout: state.layout,
          };
          return { savedSearches: [next, ...state.savedSearches].slice(0, 30) };
        }),
      applySavedSearch: (searchId) =>
        set((state) => {
          const selected = state.savedSearches.find((item) => item.id === searchId);
          if (!selected) return state;
          return {
            query: selected.query,
            timeField: selected.timeField,
            timeRange: selected.timeRange,
            layout: selected.layout ?? DEFAULT_LAYOUT,
          };
        }),
      removeSavedSearch: (searchId) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter((item) => item.id !== searchId),
        })),
    }),
    {
      name: 'discover-store-v1',
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object')
          return persistedState as DiscoverState;
        const state = persistedState as Partial<DiscoverState> & {
          savedSearches?: Array<Partial<SavedSearch>>;
        };
        const savedSearches = (state.savedSearches ?? []).map((search) => ({
          id: search.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: search.name ?? 'Saved search',
          query: search.query ?? '',
          timeField: search.timeField ?? null,
          timeRange: search.timeRange ?? 'all',
          layout: {
            ...DEFAULT_LAYOUT,
            ...(search.layout ?? {}),
          },
        }));
        return {
          ...state,
          query: state.query ?? '',
          timeField: state.timeField ?? null,
          timeRange: state.timeRange ?? 'all',
          layout: {
            ...DEFAULT_LAYOUT,
            ...(state.layout ?? {}),
          },
          savedSearches,
        } as DiscoverState;
      },
      partialize: (state) => ({
        query: state.query,
        timeField: state.timeField,
        timeRange: state.timeRange,
        layout: state.layout,
        savedSearches: state.savedSearches,
      }),
    }
  )
);
