import { describe, expect, it } from 'vitest';
import { buildSchema } from './schema';

describe('buildSchema', () => {
  it('builds schema with detected column types', () => {
    const schema = buildSchema([
      { name: 'A', amount: 10, active: true },
      { name: 'B', amount: 20, active: false },
    ]);

    expect(schema.rowCount).toBe(2);
    expect(schema.columns).toEqual(
      expect.arrayContaining([
        { key: 'name', type: 'string' },
        { key: 'amount', type: 'number' },
        { key: 'active', type: 'boolean' },
      ])
    );
  });

  it('returns empty schema for empty rows', () => {
    expect(buildSchema([])).toEqual({ columns: [], rowCount: 0 });
  });
});
