import { Box, Stack, Typography } from '@mui/material';
import type { PieWidgetConfig } from '../../entities/widget/types';
import type { DatasetRecord } from '../../entities/dataset/types';
import { groupSum } from '../lib/chartData';

const COLORS = ['#1976d2', '#7c4dff', '#ff7043', '#26a69a', '#ab47bc', '#ec407a'];

export function PieWidget({ config, rows }: { config: PieWidgetConfig; rows: DatasetRecord[] }) {
  const data = groupSum(rows, config.categoryField, config.valueField).slice(0, 6);
  const total = data.reduce((a, b) => a + b.value, 0);

  if (!data.length || total <= 0) {
    return <Typography color="text.secondary">Select category/value fields</Typography>;
  }

  let acc = 0;
  const radius = 50;
  const cx = 60;
  const cy = 60;

  const arcs = data.map((d, i) => {
    const start = (acc / total) * Math.PI * 2;
    acc += d.value;
    const end = (acc / total) * Math.PI * 2;

    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;

    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;

    return { path, color: COLORS[i % COLORS.length], label: d.label, value: d.value };
  });

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} />)}
        </svg>
      </Box>
      <Stack spacing={0.5}>
        {arcs.map((a, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, bgcolor: a.color, borderRadius: '2px' }} />
            <Typography variant="caption">
              {a.label}: {a.value.toFixed(1)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}