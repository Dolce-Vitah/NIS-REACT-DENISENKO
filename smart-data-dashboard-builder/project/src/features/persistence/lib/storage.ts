import type { DashboardConfig } from '../../../entities/dashboard/types';

const STORAGE_KEY = 'smart-dashboard-config-v1';

export function saveDashboardToStorage(config: DashboardConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadDashboardFromStorage(): DashboardConfig | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DashboardConfig;
    if (!parsed || parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearDashboardStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}