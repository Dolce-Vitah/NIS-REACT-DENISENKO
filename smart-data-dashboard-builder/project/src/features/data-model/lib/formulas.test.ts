import { describe, expect, it } from 'vitest';
import { applyFormula } from './formulas';

describe('applyFormula', () => {
  it('adds calculated field for arithmetic operations', () => {
    const rows = [
      { revenue: 120, cost: 30 },
      { revenue: 80, cost: 20 },
    ];

    const withMargin = applyFormula(rows, 'margin', 'revenue', '-', 'cost');
    expect(withMargin[0]?.margin).toBe(90);
    expect(withMargin[1]?.margin).toBe(60);
  });

  it('handles divide-by-zero safely', () => {
    const rows = [{ revenue: 100, users: 0 }];
    const withRatio = applyFormula(rows, 'arpu', 'revenue', '/', 'users');
    expect(withRatio[0]?.arpu).toBeNull();
  });
});
