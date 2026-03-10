import { create } from 'zustand';
import type { DatasetRecord, DatasetSchema } from '../entities/dataset/types';

type DataStatus = 'idle' | 'loading' | 'success' | 'error';

type DataState = {
  rows: DatasetRecord[];
  schema: DatasetSchema | null;
  status: DataStatus;
  error: string | null;
  setLoading: () => void;
  setData: (rows: DatasetRecord[], schema: DatasetSchema) => void;
  setError: (message: string) => void;
  clear: () => void;
};

export const useDataStore = create<DataState>((set) => ({
  rows: [],
  schema: null,
  status: 'idle',
  error: null,

  setLoading: () => set({ status: 'loading', error: null }),
  setData: (rows, schema) =>
    set({
      rows,
      schema,
      status: 'success',
      error: null,
    }),
  setError: (message) =>
    set({
      status: 'error',
      error: message,
    }),
  clear: () =>
    set({
      rows: [],
      schema: null,
      status: 'idle',
      error: null,
    }),
}));