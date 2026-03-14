import type { DatasetRecord } from '../../../entities/dataset/types';

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
      continue;
    }

    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  result.push(current.trim());
  return result;
}

function parseValue(raw: string): string | number | boolean | null {
  const v = raw.trim();

  if (v === '' || v.toLowerCase() === 'null') return null;
  if (v.toLowerCase() === 'true') return true;
  if (v.toLowerCase() === 'false') return false;

  const num = Number(v);
  if (!Number.isNaN(num) && v !== '') return num;

  return v;
}

export function parseCsv(text: string): DatasetRecord[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('CSV must contain header and at least 1 data row.');
  }

  const headers = splitCsvLine(lines[0]);
  if (headers.length === 0 || headers.some((h) => !h)) {
    throw new Error('CSV header is invalid.');
  }

  const rows: DatasetRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);

    if (values.length !== headers.length) {
      throw new Error(`CSV row ${i + 1} has invalid column count.`);
    }

    const record: DatasetRecord = {};
    headers.forEach((h, idx) => {
      record[h] = parseValue(values[idx] ?? '');
    });

    rows.push(record);
  }

  return rows;
}
