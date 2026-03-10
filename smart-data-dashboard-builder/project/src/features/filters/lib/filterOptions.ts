import type { DatasetRecord } from '../../../entities/dataset/types';

export function getUniqueValues(rows: DatasetRecord[], field: string): string[] {
  const set = new Set<string>();
  rows.forEach((r) => set.add(String(r[field] ?? '')));
  return [...set].sort((a, b) => a.localeCompare(b));
}