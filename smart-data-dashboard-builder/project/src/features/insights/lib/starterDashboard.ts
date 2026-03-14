import type { DatasetRecord, DatasetSchema } from '../../../entities/dataset/types';
import type { WidgetConfig } from '../../../entities/widget/types';
import type { WidgetLayout } from '../../../entities/widget/layout';

type StarterDashboard = {
  widgets: WidgetConfig[];
  layouts: WidgetLayout[];
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function looksLikeDateField(key: string): boolean {
  const lower = key.toLowerCase();
  return (
    lower.includes('date') ||
    lower.includes('day') ||
    lower.includes('month') ||
    lower.includes('time')
  );
}

function firstByType(
  schema: DatasetSchema,
  types: Array<'number' | 'string' | 'mixed'>
): string | undefined {
  const found = schema.columns.find((column) =>
    types.includes(column.type as 'number' | 'string' | 'mixed')
  );
  return found?.key;
}

export function generateStarterDashboard(
  rows: DatasetRecord[],
  schema: DatasetSchema
): StarterDashboard | null {
  if (!rows.length || !schema.columns.length) return null;

  const numericField = firstByType(schema, ['number', 'mixed']);
  const categoryField =
    schema.columns.find((column) => column.type === 'string' && !looksLikeDateField(column.key))
      ?.key ?? firstByType(schema, ['string', 'mixed']);
  const dateLikeField = schema.columns.find((column) => looksLikeDateField(column.key))?.key;

  const widgets: WidgetConfig[] = [];
  const layouts: WidgetLayout[] = [];

  const push = (widget: WidgetConfig, layout: Omit<WidgetLayout, 'i'>) => {
    widgets.push(widget);
    layouts.push({ i: widget.id, ...layout });
  };

  const kpiCountId = uid();
  push(
    {
      id: kpiCountId,
      type: 'kpi',
      title: 'Total Rows',
      aggregation: 'count',
      valueField: undefined,
    },
    { x: 0, y: 0, w: 3, h: 3, minW: 3, minH: 3 }
  );

  if (numericField) {
    const kpiSumId = uid();
    push(
      {
        id: kpiSumId,
        type: 'kpi',
        title: `Total ${numericField}`,
        aggregation: 'sum',
        valueField: numericField,
      },
      { x: 3, y: 0, w: 3, h: 3, minW: 3, minH: 3 }
    );
  }

  if (categoryField && numericField) {
    const barId = uid();
    push(
      {
        id: barId,
        type: 'bar',
        title: `Top ${categoryField}`,
        categoryField,
        valueField: numericField,
      },
      { x: 0, y: 3, w: 6, h: 4, minW: 3, minH: 3 }
    );
  }

  if (dateLikeField && numericField) {
    const lineId = uid();
    push(
      {
        id: lineId,
        type: 'line',
        title: `${numericField} Trend`,
        xField: dateLikeField,
        yField: numericField,
      },
      { x: 6, y: 3, w: 6, h: 4, minW: 3, minH: 3 }
    );
  } else if (categoryField && numericField) {
    const pieId = uid();
    push(
      {
        id: pieId,
        type: 'pie',
        title: `${numericField} Share`,
        categoryField,
        valueField: numericField,
      },
      { x: 6, y: 3, w: 6, h: 4, minW: 3, minH: 3 }
    );
  }

  return widgets.length ? { widgets, layouts } : null;
}
