import { Box, Stack, Typography } from '@mui/material';
import type { PieWidgetConfig } from '../../entities/widget/types';
import type { DatasetRecord } from '../../entities/dataset/types';
import { groupSum, hasNumericValues } from '../lib/chartData';
import { useFiltersStore } from '../../store/filtersStore';
import { useI18n } from '../../shared/i18n/useI18n';

const COLORS = [
  'var(--gpv2-chart-pie-1)',
  'var(--gpv2-chart-pie-2)',
  'var(--gpv2-chart-pie-3)',
  'var(--gpv2-chart-pie-4)',
  'var(--gpv2-chart-pie-5)',
  'var(--gpv2-chart-pie-6)',
];

export function PieWidget({ config, rows }: { config: PieWidgetConfig; rows: DatasetRecord[] }) {
  const { language } = useI18n();
  const ru = language === 'ru';
  const filters = useFiltersStore((s) => s.filters);
  const toggleCategoryValueFilter = useFiltersStore((s) => s.toggleCategoryValueFilter);
  if (config.valueField && !hasNumericValues(rows, config.valueField)) {
    return (
      <Typography color="text.secondary">
        {ru
          ? 'Выбранное поле значения не содержит числовых значений'
          : 'Selected value field has no numeric values'}
      </Typography>
    );
  }

  const data = groupSum(rows, config.categoryField, config.valueField).slice(0, 6);
  const total = data.reduce((a, b) => a + b.value, 0);

  const activeValues = (() => {
    if (!config.categoryField) return [];
    const existing = filters.find((f) => f.type === 'category' && f.field === config.categoryField);
    return existing?.type === 'category' ? existing.values : [];
  })();

  if (!data.length || total <= 0) {
    return (
      <Typography color="text.secondary">
        {ru ? 'Выберите поля категории/значения' : 'Select category/value fields'}
      </Typography>
    );
  }

  const radius = 50;
  const cx = 60;
  const cy = 60;

  const { arcs } = data.reduce<{
    angle: number;
    arcs: Array<{ path: string; color: string; label: string; value: number }>;
  }>(
    (state, d, i) => {
      const start = state.angle;
      const end = start + (d.value / total) * Math.PI * 2;

      const x1 = cx + radius * Math.cos(start);
      const y1 = cy + radius * Math.sin(start);
      const x2 = cx + radius * Math.cos(end);
      const y2 = cy + radius * Math.sin(end);
      const large = end - start > Math.PI ? 1 : 0;

      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
      const arc = { path, color: COLORS[i % COLORS.length], label: d.label, value: d.value };

      return { angle: end, arcs: [...state.arcs, arc] };
    },
    { angle: 0, arcs: [] }
  );

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {arcs.map((a, i) => (
            <path
              key={i}
              d={a.path}
              fill={a.color}
              style={{
                cursor: config.categoryField ? 'pointer' : 'default',
                opacity: activeValues.length === 0 || activeValues.includes(a.label) ? 1 : 0.38,
                transition: 'opacity 120ms ease',
              }}
              onClick={() => {
                if (config.categoryField) toggleCategoryValueFilter(config.categoryField, a.label);
              }}
            />
          ))}
        </svg>
      </Box>
      <Stack spacing={0.5}>
        {arcs.map((a, i) => (
          <Stack
            key={i}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ cursor: config.categoryField ? 'pointer' : 'default' }}
            onClick={() => {
              if (config.categoryField) toggleCategoryValueFilter(config.categoryField, a.label);
            }}
          >
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
