import type { DatasetRecord } from '../../entities/dataset/types';

export function asNumber(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function groupSum(
  rows: DatasetRecord[],
  categoryField?: string,
  valueField?: string
): Array<{ label: string; value: number }> {
  if (!categoryField || !valueField) return [];

  const map = new Map<string, number>();

  rows.forEach((r) => {
    const label = String(r[categoryField] ?? 'N/A');
    const val = asNumber(r[valueField]);
    if (val === null) return;
    map.set(label, (map.get(label) ?? 0) + val);
  });

  return [...map.entries()].map(([label, value]) => ({ label, value }));
}

export function hasNumericValues(rows: DatasetRecord[], valueField?: string): boolean {
  if (!valueField) return false;
  return rows.some((row) => asNumber(row[valueField]) !== null);
}
