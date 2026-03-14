import { create } from 'zustand';
import type { DatasetRecord, DatasetSchema } from '../entities/dataset/types';
import { applyFormula, type FormulaOperator } from '../features/data-model/lib/formulas';
import { buildSchema } from '../features/data-import/lib/schema';

type DataStatus = 'idle' | 'loading' | 'success' | 'error';

type DataState = {
  rows: DatasetRecord[];
  schema: DatasetSchema | null;
  status: DataStatus;
  error: string | null;
  setLoading: () => void;
  setData: (rows: DatasetRecord[], schema: DatasetSchema) => void;
  addCalculatedField: (
    name: string,
    leftField: string,
    operator: FormulaOperator,
    rightField: string
  ) => void;
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
  addCalculatedField: (name, leftField, operator, rightField) =>
    set((state) => {
      if (!state.rows.length || !name.trim()) return state;
      const nextRows = applyFormula(state.rows, name.trim(), leftField, operator, rightField);
      return {
        rows: nextRows,
        schema: buildSchema(nextRows),
      };
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
