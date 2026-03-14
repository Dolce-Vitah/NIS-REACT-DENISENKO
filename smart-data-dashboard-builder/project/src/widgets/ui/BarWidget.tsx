import { Box, Stack, Typography } from '@mui/material';
import type { BarWidgetConfig } from '../../entities/widget/types';
import type { DatasetRecord } from '../../entities/dataset/types';
import { groupSum, hasNumericValues } from '../lib/chartData';
import { useFiltersStore } from '../../store/filtersStore';
import { useI18n } from '../../shared/i18n/useI18n';

export function BarWidget({ config, rows }: { config: BarWidgetConfig; rows: DatasetRecord[] }) {
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

  const data = groupSum(rows, config.categoryField, config.valueField).slice(0, 8);
  const max = Math.max(...data.map((d) => d.value), 1);

  const activeValues = (() => {
    if (!config.categoryField) return [];
    const existing = filters.find((f) => f.type === 'category' && f.field === config.categoryField);
    return existing?.type === 'category' ? existing.values : [];
  })();

  if (!data.length)
    return (
      <Typography color="text.secondary">
        {ru ? 'Выберите поля категории/значения' : 'Select category/value fields'}
      </Typography>
    );

  return (
    <Stack spacing={1}>
      {data.map((d) => (
        <Box key={d.label}>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              cursor: config.categoryField ? 'pointer' : 'default',
              userSelect: 'none',
            }}
            onClick={() => {
              if (config.categoryField) toggleCategoryValueFilter(config.categoryField, d.label);
            }}
          >
            <Typography variant="caption">{d.label}</Typography>
            <Typography variant="caption">{d.value.toFixed(1)}</Typography>
          </Stack>
          <Box sx={{ height: 8, bgcolor: 'var(--gpv2-chart-track)', borderRadius: 5 }}>
            <Box
              sx={{
                height: 8,
                width: `${(d.value / max) * 100}%`,
                bgcolor: 'var(--gpv2-chart-line)',
                borderRadius: 5,
                opacity: activeValues.length === 0 || activeValues.includes(d.label) ? 1 : 0.4,
                transition: 'opacity 120ms ease',
              }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
