import type { DatasetRecord } from '../../../entities/dataset/types';
import type { DashboardConfig } from '../../../entities/dashboard/types';

function quoteCsvCell(value: unknown): string {
  let str = '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    str = String(value);
  } else if (value === null || value === undefined) {
    str = '';
  } else {
    str = JSON.stringify(value);
  }
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replaceAll('"', '""')}"`;
  }
  return str;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportRowsToCsv(rows: DatasetRecord[], filename: string): void {
  if (!rows.length) return;
  const headers = Array.from(
    rows.reduce((acc, row) => {
      Object.keys(row).forEach((key) => acc.add(key));
      return acc;
    }, new Set<string>())
  );

  const lines = [
    headers.map((h) => quoteCsvCell(h)).join(','),
    ...rows.map((row) => headers.map((h) => quoteCsvCell(row[h])).join(',')),
  ];
  const content = lines.join('\n');
  downloadBlob(new Blob([content], { type: 'text/csv;charset=utf-8' }), filename);
}

export function exportDashboardConfig(config: DashboardConfig, filename: string): void {
  const json = JSON.stringify(config, null, 2);
  downloadBlob(new Blob([json], { type: 'application/json;charset=utf-8' }), filename);
}
