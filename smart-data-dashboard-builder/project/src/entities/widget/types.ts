export type WidgetType = 'kpi' | 'table' | 'bar' | 'line' | 'pie' | 'three';

export type AggregationType = 'count' | 'sum' | 'avg';

export type BaseWidgetConfig = {
  id: string;
  type: WidgetType;
  title: string;
};

export type KpiWidgetConfig = BaseWidgetConfig & {
  type: 'kpi';
  valueField?: string;
  aggregation: AggregationType;
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

export type WidgetConfig =
  | KpiWidgetConfig
  | TableWidgetConfig
  | BarWidgetConfig
  | LineWidgetConfig
  | PieWidgetConfig
  | ThreeWidgetConfig;