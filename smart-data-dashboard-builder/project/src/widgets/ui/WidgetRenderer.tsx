import type { DatasetRecord } from '../../entities/dataset/types';
import type { WidgetConfig } from '../../entities/widget/types';
import { KpiWidget } from './KpiWidget';
import { TableWidget } from './TableWidget';
import { BarWidget } from './BarWidget';
import { LineWidget } from './LineWidget';
import { PieWidget } from './PieWidget';
import { ThreeBarWidget } from './ThreeBarWidget';
import { ThreeScatterWidget } from './ThreeScatterWidget';
import { ThreeSurfaceWidget } from './ThreeSurfaceWidget';

export function WidgetRenderer({ widget, rows }: { widget: WidgetConfig; rows: DatasetRecord[] }) {
  if (widget.type === 'kpi') return <KpiWidget config={widget} rows={rows} />;
  if (widget.type === 'table') return <TableWidget config={widget} rows={rows} />;
  if (widget.type === 'bar') return <BarWidget config={widget} rows={rows} />;
  if (widget.type === 'line') return <LineWidget config={widget} rows={rows} />;
  if (widget.type === 'pie') return <PieWidget config={widget} rows={rows} />;
  if (widget.type === 'threeScatter') return <ThreeScatterWidget config={widget} rows={rows} />;
  if (widget.type === 'threeSurface') return <ThreeSurfaceWidget config={widget} rows={rows} />;
  return <ThreeBarWidget config={widget} rows={rows} />;
}
