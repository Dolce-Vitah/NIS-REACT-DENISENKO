export type Primitive = string | number | boolean | null;

export type DatasetRecord = Record<string, Primitive>;

export type ColumnType = 'string' | 'number' | 'boolean' | 'null' | 'mixed';

export type ColumnMeta = {
  key: string;
  type: ColumnType;
};

export type DatasetSchema = {
  columns: ColumnMeta[];
  rowCount: number;
};
