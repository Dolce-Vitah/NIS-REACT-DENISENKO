import type { DatasetRecord } from '../../../entities/dataset/types';

type NumericOperator = '>=' | '<=' | '>' | '<' | '=';

type QueryClause =
  | {
      kind: 'field-text';
      field: string;
      value: string;
    }
  | {
      kind: 'field-number';
      field: string;
      operator: NumericOperator;
      value: number;
    }
  | {
      kind: 'global-text';
      value: string;
    };

export type DiscoverTimeRange = 'all' | 'last15m' | 'last24h' | 'last7d' | 'last30d';

const NUMERIC_CLAUSE_RE = /^([a-zA-Z0-9_.-]+)\s*(>=|<=|>|<|=)\s*(-?\d+(?:\.\d+)?)$/;
const TEXT_CLAUSE_RE = /^([a-zA-Z0-9_.-]+)\s*:\s*(.+)$/;

function parseQuery(query: string): QueryClause[] {
  const compact = query.trim();
  if (!compact) return [];

  const parts = compact
    .split(/\s+AND\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.map((part): QueryClause => {
    const numericMatch = part.match(NUMERIC_CLAUSE_RE);
    if (numericMatch) {
      return {
        kind: 'field-number',
        field: numericMatch[1],
        operator: numericMatch[2] as NumericOperator,
        value: Number(numericMatch[3]),
      };
    }

    const textMatch = part.match(TEXT_CLAUSE_RE);
    if (textMatch) {
      return {
        kind: 'field-text',
        field: textMatch[1],
        value: textMatch[2].trim(),
      };
    }

    return {
      kind: 'global-text',
      value: part,
    };
  });
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asText(value: unknown): string {
  if (typeof value === 'string') return value.toLowerCase();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value).toLowerCase();
  if (value === null || value === undefined) return '';
  return '';
}

function matchesNumber(operator: NumericOperator, left: number, right: number): boolean {
  if (operator === '>=') return left >= right;
  if (operator === '<=') return left <= right;
  if (operator === '>') return left > right;
  if (operator === '<') return left < right;
  return left === right;
}

export function applyDiscoverQuery(rows: DatasetRecord[], query: string): DatasetRecord[] {
  const clauses = parseQuery(query);
  if (!clauses.length) return rows;

  return rows.filter((row) =>
    clauses.every((clause) => {
      if (clause.kind === 'global-text') {
        const expected = clause.value.toLowerCase();
        return Object.values(row).some((value) => asText(value).includes(expected));
      }

      if (clause.kind === 'field-text') {
        const raw = row[clause.field];
        return asText(raw).includes(clause.value.toLowerCase());
      }

      const raw = row[clause.field];
      const numeric = asNumber(raw);
      if (numeric === null) return false;
      return matchesNumber(clause.operator, numeric, clause.value);
    })
  );
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'number' && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function getRangeStart(range: DiscoverTimeRange): number | null {
  const now = Date.now();
  if (range === 'last15m') return now - 15 * 60 * 1000;
  if (range === 'last24h') return now - 24 * 60 * 60 * 1000;
  if (range === 'last7d') return now - 7 * 24 * 60 * 60 * 1000;
  if (range === 'last30d') return now - 30 * 24 * 60 * 60 * 1000;
  return null;
}

export function applyDiscoverTimeFilter(
  rows: DatasetRecord[],
  timeField: string | null,
  timeRange: DiscoverTimeRange
): DatasetRecord[] {
  if (!timeField || timeRange === 'all') return rows;
  const from = getRangeStart(timeRange);
  if (from === null) return rows;

  return rows.filter((row) => {
    const date = toDate(row[timeField]);
    if (!date) return false;
    return date.getTime() >= from;
  });
}
