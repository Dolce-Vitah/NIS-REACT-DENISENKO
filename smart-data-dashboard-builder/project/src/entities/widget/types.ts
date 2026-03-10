export type WidgetType =
  | 'kpi'
  | 'table'
  | 'bar'
  | 'line'
  | 'pie'
  | 'three'
  | 'threeScatter'
  | 'threeSurface';

export type AggregationType = 'count' | 'sum' | 'avg';
export type WidgetChartPalette = 'indigo' | 'emerald' | 'sunset' | 'mono';

export type WidgetStyleConfig = {
  glassBlur: number;
  cornerRadius: number;
  shadowDepth: number;
  borderContrast: number;
  backgroundColor: string;
  chartPalette: WidgetChartPalette;
};

export const DEFAULT_WIDGET_STYLE: WidgetStyleConfig = {
  glassBlur: 92,
  cornerRadius: 20,
  shadowDepth: 55,
  borderContrast: 1,
  backgroundColor: '#ffffff',
  chartPalette: 'indigo',
};

const WIDGET_STYLE_BY_TYPE: Record<WidgetType, WidgetStyleConfig> = {
  kpi: {
    ...DEFAULT_WIDGET_STYLE,
    shadowDepth: 62,
    borderContrast: 2,
    chartPalette: 'sunset',
  },
  table: {
    ...DEFAULT_WIDGET_STYLE,
    glassBlur: 98,
    cornerRadius: 14,
    shadowDepth: 34,
    borderContrast: 1,
    backgroundColor: '#f8fafc',
    chartPalette: 'mono',
  },
  bar: {
    ...DEFAULT_WIDGET_STYLE,
    chartPalette: 'indigo',
  },
  line: {
    ...DEFAULT_WIDGET_STYLE,
    backgroundColor: '#f0fdf4',
    chartPalette: 'emerald',
  },
  pie: {
    ...DEFAULT_WIDGET_STYLE,
    backgroundColor: '#fff7ed',
    chartPalette: 'sunset',
  },
  three: {
    ...DEFAULT_WIDGET_STYLE,
    glassBlur: 90,
    shadowDepth: 66,
    borderContrast: 1.5,
    backgroundColor: '#f1f5f9',
    chartPalette: 'indigo',
  },
  threeScatter: {
    ...DEFAULT_WIDGET_STYLE,
    glassBlur: 88,
    shadowDepth: 68,
    borderContrast: 1.5,
    backgroundColor: '#ecfeff',
    chartPalette: 'emerald',
  },
  threeSurface: {
    ...DEFAULT_WIDGET_STYLE,
    glassBlur: 90,
    shadowDepth: 64,
    borderContrast: 1.5,
    backgroundColor: '#eff6ff',
    chartPalette: 'mono',
  },
};

export function getDefaultWidgetStyleByType(type: WidgetType): WidgetStyleConfig {
  return { ...WIDGET_STYLE_BY_TYPE[type] };
}

export type BaseWidgetConfig = {
  id: string;
  type: WidgetType;
  title: string;
  style?: WidgetStyleConfig;
};

export type KpiWidgetConfig = BaseWidgetConfig & {
  type: 'kpi';
  valueField?: string;
  aggregation: AggregationType;
  comparisonField?: string;
  comparisonValue?: string;
};

export type TableWidgetConfig = BaseWidgetConfig & {
  type: 'table';
  columns: string[];
  limit: number;
};

export type BarWidgetConfig = BaseWidgetConfig & {
  type: 'bar';
  categoryField?: string;
  valueField?: string;
};

export type LineWidgetConfig = BaseWidgetConfig & {
  type: 'line';
  xField?: string;
  yField?: string;
};

export type PieWidgetConfig = BaseWidgetConfig & {
  type: 'pie';
  categoryField?: string;
  valueField?: string;
};

export type ThreeWidgetConfig = BaseWidgetConfig & {
  type: 'three';
  categoryField?: string;
  valueField?: string;
};

export type ThreeScatterWidgetConfig = BaseWidgetConfig & {
  type: 'threeScatter';
  xField?: string;
  yField?: string;
  zField?: string;
  categoryField?: string;
};

export type ThreeSurfaceWidgetConfig = BaseWidgetConfig & {
  type: 'threeSurface';
  xField?: string;
  yField?: string;
  zField?: string;
};

export type WidgetConfig =
  | KpiWidgetConfig
  | TableWidgetConfig
  | BarWidgetConfig
  | LineWidgetConfig
  | PieWidgetConfig
  | ThreeWidgetConfig
  | ThreeScatterWidgetConfig
  | ThreeSurfaceWidgetConfig;
