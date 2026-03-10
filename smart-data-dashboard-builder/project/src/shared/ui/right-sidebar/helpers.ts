import type { WidgetType } from '../../../entities/widget/types';

export const NUMERIC_WIDGET_TYPES = new Set<WidgetType>([
  'kpi',
  'bar',
  'pie',
  'three',
  'line',
  'threeScatter',
  'threeSurface',
]);

export function tr(ru: boolean, ruText: string, enText: string): string {
  return ru ? ruText : enText;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
