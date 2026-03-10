import type { DatasetRecord } from '../../../entities/dataset/types';

export function parseJson(text: string): DatasetRecord[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON format.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('JSON must be an array of objects.');
  }

  if (parsed.length === 0) {
    throw new Error('JSON array is empty.');
  }

  const rows = parsed as unknown[];

  const valid = rows.every(
    (item) => typeof item === 'object' && item !== null && !Array.isArray(item)
  );

  if (!valid) {
    throw new Error('JSON array items must be objects.');
  }

  return rows as DatasetRecord[];
}