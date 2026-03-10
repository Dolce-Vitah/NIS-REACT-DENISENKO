import type { DatasetRecord } from '../../../entities/dataset/types';

export type FormulaOperator = '+' | '-' | '*' | '/' | '%';

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function applyFormula(
  rows: DatasetRecord[],
  name: string,
  leftField: string,
  operator: FormulaOperator,
  rightField: string
): DatasetRecord[] {
  return rows.map((row) => {
    const left = asNumber(row[leftField]);
    const right = asNumber(row[rightField]);
    let value: number | null = null;

    if (left !== null && right !== null) {
      if (operator === '+') value = left + right;
      if (operator === '-') value = left - right;
      if (operator === '*') value = left * right;
      if (operator === '/') value = right === 0 ? null : left / right;
      if (operator === '%') value = right === 0 ? null : (left / right) * 100;
    }

    return { ...row, [name]: value };
  });
}
