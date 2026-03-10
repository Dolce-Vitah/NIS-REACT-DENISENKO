import { Typography } from '@mui/material';
import type { KpiWidgetConfig } from '../../entities/widget/types';
import type { DatasetRecord } from '../../entities/dataset/types';
import { asNumber } from '../lib/chartData';

export function KpiWidget({ config, rows }: { config: KpiWidgetConfig; rows: DatasetRecord[] }) {
  let value = 0;

  if (config.aggregation === 'count') {
    value = rows.length;
  } else if (config.valueField) {
    const nums = rows.map((r) => asNumber(r[config.valueField!])).filter((v): v is number => v !== null);
    if (config.aggregation === 'sum') value = nums.reduce((a, b) => a + b, 0);
    if (config.aggregation === 'avg') value = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  }

  return (
    <>
      <Typography variant="h4" fontWeight={800}>
        {Number.isFinite(value) ? value.toFixed(2).replace(/\.00$/, '') : '-'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {config.aggregation.toUpperCase()} {config.valueField ? `of ${config.valueField}` : ''}
      </Typography>
    </>
  );
}