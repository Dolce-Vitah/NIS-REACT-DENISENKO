import { Box, Stack, Typography } from '@mui/material';
import type { BarWidgetConfig } from '../../entities/widget/types';
import type { DatasetRecord } from '../../entities/dataset/types';
import { groupSum } from '../lib/chartData';

export function BarWidget({ config, rows }: { config: BarWidgetConfig; rows: DatasetRecord[] }) {
  const data = groupSum(rows, config.categoryField, config.valueField).slice(0, 8);
  const max = Math.max(...data.map((d) => d.value), 1);

  if (!data.length) return <Typography color="text.secondary">Select category/value fields</Typography>;

  return (
    <Stack spacing={1}>
      {data.map((d) => (
        <Box key={d.label}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption">{d.label}</Typography>
            <Typography variant="caption">{d.value.toFixed(1)}</Typography>
          </Stack>
          <Box sx={{ height: 8, bgcolor: '#e9edf7', borderRadius: 5 }}>
            <Box
              sx={{
                height: 8,
                width: `${(d.value / max) * 100}%`,
                bgcolor: 'primary.main',
                borderRadius: 5,
              }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}