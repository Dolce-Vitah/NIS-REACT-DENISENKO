import { parseCsv } from '../lib/csv';
import { parseJson } from '../lib/json';
import { buildSchema } from '../lib/schema';
import { readFileAsText } from '../lib/readFile';
import type { DatasetRecord, DatasetSchema } from '../../../entities/dataset/types';

type ImportResult = {
  rows: DatasetRecord[];
  schema: DatasetSchema;
};

export async function importDataFromFile(file: File): Promise<ImportResult> {
  if (!file) throw new Error('No file selected.');
  if (file.size === 0) throw new Error('File is empty.');

  const ext = file.name.split('.').pop()?.toLowerCase();
  const text = await readFileAsText(file);

  let rows: DatasetRecord[];

  if (ext === 'csv') {
    rows = parseCsv(text);
  } else if (ext === 'json') {
    rows = parseJson(text);
  } else {
    throw new Error('Only CSV and JSON files are supported.');
  }

  if (!rows.length) throw new Error('No rows found in file.');

  const schema = buildSchema(rows);
  return { rows, schema };
}
