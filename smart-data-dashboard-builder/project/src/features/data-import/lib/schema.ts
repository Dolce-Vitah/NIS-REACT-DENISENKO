import type {
  ColumnMeta,
  ColumnType,
  DatasetRecord,
  DatasetSchema,
} from '../../../entities/dataset/types';

function detectType(values: unknown[]): ColumnType {
  const detected = new Set<string>();

  for (const v of values) {
    if (v === null) detected.add('null');
    else detected.add(typeof v);
  }

  if (detected.size === 1) {
    const only = [...detected][0];
    if (only === 'string' || only === 'number' || only === 'boolean' || only === 'null') {
      return only as ColumnType;
    }
  }

  if (detected.size === 0) return 'null';
  return 'mixed';
}

export function buildSchema(rows: DatasetRecord[]): DatasetSchema {
  if (!rows.length) {
    return { columns: [], rowCount: 0 };
  }

  const allKeys = Array.from(
    rows.reduce((acc, row) => {
      Object.keys(row).forEach((k) => acc.add(k));
      return acc;
    }, new Set<string>())
  );

  const columns: ColumnMeta[] = allKeys.map((key) => {
    const values = rows.map((r) => r[key] ?? null);
    return { key, type: detectType(values) };
  });

  return {
    columns,
    rowCount: rows.length,
  };
}
