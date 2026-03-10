import { Box, Typography } from '@mui/material';
import type { LineWidgetConfig } from '../../entities/widget/types';
import type { DatasetRecord } from '../../entities/dataset/types';
import { asNumber } from '../lib/chartData';

export function LineWidget({ config, rows }: { config: LineWidgetConfig; rows: DatasetRecord[] }) {
  if (!config.xField || !config.yField) {
    return <Typography color="text.secondary">Select X/Y fields</Typography>;
  }

  const points = rows
    .slice(0, 30)
    .map((r) => ({ x: String(r[config.xField!]), y: asNumber(r[config.yField!]) }))
    .filter((p) => p.y !== null) as Array<{ x: string; y: number }>;

  if (!points.length) return <Typography color="text.secondary">No numeric Y values</Typography>;

  const w = 320;
  const h = 120;
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));
  const span = maxY - minY || 1;

  const poly = points
    .map((p, i) => {
      const px = (i / Math.max(points.length - 1, 1)) * (w - 8) + 4;
      const py = h - ((p.y - minY) / span) * (h - 8) - 4;
      return `${px},${py}`;
    })
    .join(' ');

  return (
    <Box>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`}>
        <polyline fill="none" stroke="#1976d2" strokeWidth="2.5" points={poly} />
      </svg>
    </Box>
  );
}