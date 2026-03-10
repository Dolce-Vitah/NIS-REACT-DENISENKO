import { beforeEach, describe, expect, it } from 'vitest';
import { clearDashboardStorage, loadDashboardFromStorage, saveDashboardToStorage } from './storage';
import type { DashboardConfig } from '../../../entities/dashboard/types';

const validConfig: DashboardConfig = {
  version: 1,
  widgets: [
    {
      id: 'w-1',
      type: 'kpi',
      title: 'KPI',
      aggregation: 'count',
      valueField: 'revenue',
    },
  ],
  layouts: [{ i: 'w-1', x: 0, y: 0, w: 4, h: 4 }],
  filters: [{ type: 'category', field: 'region', values: ['EU'] }],
};

describe('dashboard storage', () => {
  beforeEach(() => {
    clearDashboardStorage();
  });

  it('returns missing when config is absent', () => {
    expect(loadDashboardFromStorage()).toEqual({ status: 'missing' });
  });

  it('loads a valid saved config', () => {
    saveDashboardToStorage(validConfig);
    const result = loadDashboardFromStorage();

    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.data).toEqual(validConfig);
    }
  });

  it('returns invalid for malformed saved config', () => {
    localStorage.setItem(
      'smart-dashboard-config-v1',
      JSON.stringify({ version: 1, widgets: [{ type: 'kpi' }] })
    );

    expect(loadDashboardFromStorage()).toEqual({ status: 'invalid' });
  });
});
