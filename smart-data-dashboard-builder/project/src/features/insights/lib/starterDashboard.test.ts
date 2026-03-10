import { describe, expect, it } from 'vitest';
import { generateStarterDashboard } from './starterDashboard';

describe('generateStarterDashboard', () => {
  it('generates starter widgets from schema and rows', () => {
    const rows = [
      { date: '2026-01-01', region: 'EU', revenue: 120 },
      { date: '2026-01-02', region: 'US', revenue: 90 },
    ];
    const schema = {
      rowCount: rows.length,
      columns: [
        { key: 'date', type: 'string' as const },
        { key: 'region', type: 'string' as const },
        { key: 'revenue', type: 'number' as const },
      ],
    };

    const starter = generateStarterDashboard(rows, schema);
    expect(starter).not.toBeNull();
    expect(starter?.widgets.length).toBeGreaterThanOrEqual(3);
    expect(starter?.layouts.length).toBe(starter?.widgets.length);
  });
});
