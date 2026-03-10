import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
} from '@mui/x-data-grid';
import { useDataStore } from '../../../store/dataStore';
import { useFiltersStore } from '../../../store/filtersStore';
import { useDiscoverStore } from '../../../store/discoverStore';
import { useFilteredRows } from '../model/useFilteredRows';
import { useI18n } from '../../../shared/i18n/useI18n';

function toDisplay(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function percentile(values: number[], p: number): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = (p / 100) * (sorted.length - 1);
  const low = Math.floor(rank);
  const high = Math.ceil(rank);
  if (low === high) return sorted[low];
  const weight = rank - low;
  return sorted[low] * (1 - weight) + sorted[high] * weight;
}

function buildHistogram(values: number[], bins = 8): Array<{ label: string; count: number }> {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return [{ label: `${min.toFixed(2)}..${max.toFixed(2)}`, count: values.length }];

  const width = (max - min) / bins;
  const counts = Array.from({ length: bins }, () => 0);
  for (const value of values) {
    const idx = Math.min(bins - 1, Math.floor((value - min) / width));
    counts[idx] += 1;
  }

  return counts.map((count, idx) => {
    const start = min + idx * width;
    const end = idx === bins - 1 ? max : start + width;
    return {
      label: `${start.toFixed(1)}-${end.toFixed(1)}`,
      count,
    };
  });
}

function tr(ru: boolean, ruText: string, enText: string): string {
  return ru ? ruText : enText;
}

export function DiscoverTable() {
  const schema = useDataStore((s) => s.schema);
  const status = useDataStore((s) => s.status);
  const error = useDataStore((s) => s.error);
  const { t, language } = useI18n();
  const ru = language === 'ru';

  const pinnedFields = useFiltersStore((s) => s.pinnedFields);
  const togglePinnedField = useFiltersStore((s) => s.togglePinnedField);

  const layout = useDiscoverStore((s) => s.layout);
  const setLayout = useDiscoverStore((s) => s.setLayout);
  const savedSearches = useDiscoverStore((s) => s.savedSearches);
  const applySavedSearch = useDiscoverStore((s) => s.applySavedSearch);
  const removeSavedSearch = useDiscoverStore((s) => s.removeSavedSearch);

  const [selectedSavedId, setSelectedSavedId] = useState('');

  const { rows, filteredRows, filtersCount, query, timeField, timeRange } = useFilteredRows();

  const allFields = useMemo(() => schema?.columns.map((c) => c.key) ?? [], [schema]);
  const normalizedVisibleFields = useMemo(() => {
    const valid = layout.visibleFields.filter((field) => allFields.includes(field));
    return valid.length ? valid : allFields;
  }, [layout.visibleFields, allFields]);

  const orderedFields = useMemo(() => {
    const visibleSet = new Set(normalizedVisibleFields);
    const pinnedVisible = pinnedFields.filter((field) => visibleSet.has(field));
    const restVisible = normalizedVisibleFields.filter((field) => !pinnedVisible.includes(field));
    return [...pinnedVisible, ...restVisible];
  }, [normalizedVisibleFields, pinnedFields]);

  const gridCols = useMemo<GridColDef[]>(
    () =>
      orderedFields.map((field) => ({
        field,
        headerName: field,
        minWidth: 140,
        flex: 1,
        sortable: true,
      })),
    [orderedFields]
  );

  const gridRows = useMemo(
    () =>
      filteredRows.map((row, idx) => {
        const normalized = orderedFields.reduce<Record<string, string>>((acc, field) => {
          acc[field] = toDisplay(row[field]);
          return acc;
        }, {});
        return {
          id: `${idx}-${orderedFields.map((field) => normalized[field]).join('|')}`,
          ...normalized,
        };
      }),
    [filteredRows, orderedFields]
  );

  const activeStatsField = useMemo(() => {
    if (layout.statsField && allFields.includes(layout.statsField)) return layout.statsField;
    return normalizedVisibleFields[0] ?? null;
  }, [layout.statsField, allFields, normalizedVisibleFields]);

  const stats = useMemo(() => {
    if (!activeStatsField) return null;

    const type = schema?.columns.find((column) => column.key === activeStatsField)?.type ?? 'mixed';
    const values = filteredRows.map((row) => row[activeStatsField]);
    const nonEmpty = values.filter((value) => toDisplay(value).trim() !== '').length;
    const counts = new Map<string, number>();
    for (const value of values) {
      const key = toDisplay(value);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const topValues = [...counts.entries()]
      .filter(([label]) => label.trim() !== '')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const numericValues = values.map(asNumber).filter((value): value is number => value !== null);
    const min = numericValues.length ? Math.min(...numericValues) : null;
    const max = numericValues.length ? Math.max(...numericValues) : null;
    const avg = numericValues.length
      ? numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
      : null;
    const p50 = percentile(numericValues, 50);
    const p90 = percentile(numericValues, 90);
    const p95 = percentile(numericValues, 95);
    const histogram = buildHistogram(numericValues, 8);

    return {
      type,
      total: values.length,
      nonEmpty,
      unique: counts.size,
      topValues,
      numeric: {
        count: numericValues.length,
        min,
        max,
        avg,
        p50,
        p90,
        p95,
        histogram,
      },
    };
  }, [activeStatsField, filteredRows, schema]);

  const sortModel: GridSortModel = layout.sortField
    ? [{ field: layout.sortField, sort: layout.sortDirection }]
    : [];
  const paginationModel: GridPaginationModel = {
    page: layout.currentPage,
    pageSize: layout.pageSize,
  };
  const splitRatio = clamp(layout.splitRatio, 0.55, 0.85);

  if (status === 'idle') {
    return (
      <Typography color="text.secondary">
        {tr(
          ru,
          'Загрузите CSV/JSON, чтобы начать работу в режиме Discover.',
          'Upload CSV/JSON to start using Discover mode.'
        )}
      </Typography>
    );
  }

  if (status === 'loading') {
    return <Typography>{t.common.loading}</Typography>;
  }

  if (status === 'error') {
    return (
      <Typography color="error">{error ?? tr(ru, 'Ошибка импорта.', 'Import failed.')}</Typography>
    );
  }

  if (!schema || !rows.length) {
    return <Typography color="text.secondary">{t.common.noData}</Typography>;
  }

  return (
    <Stack spacing={1.5}>
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            size="small"
            label={`${tr(ru, 'Строки', 'Rows')}: ${filteredRows.length}/${rows.length}`}
            color="primary"
          />
          <Chip size="small" label={`${tr(ru, 'Фильтры', 'Filters')}: ${filtersCount}`} />
          <Chip
            size="small"
            label={`${tr(ru, 'Запрос', 'Query')}: ${
              query.trim() ? tr(ru, 'активен', 'active') : tr(ru, 'нет', 'none')
            }`}
          />
          <Chip
            size="small"
            label={
              timeField
                ? `${tr(ru, 'Время', 'Time')}: ${timeField} (${timeRange})`
                : `${tr(ru, 'Время', 'Time')}: ${tr(ru, 'выкл', 'off')}`
            }
          />
        </Stack>
        <Divider sx={{ my: 1.25 }} />
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
          <Typography variant="body2" sx={{ minWidth: 110 }}>
            {tr(ru, 'Видимые колонки', 'Visible columns')}
          </Typography>
          <Select
            size="small"
            multiple
            value={normalizedVisibleFields}
            onChange={(event) => setLayout({ visibleFields: event.target.value as string[] })}
            renderValue={(selected) =>
              `${tr(ru, 'Выбрано', 'Selected')}: ${Array.isArray(selected) ? selected.length : 0}`
            }
            sx={{ minWidth: 200 }}
          >
            {allFields.map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
          <Button size="small" onClick={() => setLayout({ visibleFields: allFields })}>
            {tr(ru, 'Показать все', 'Show all')}
          </Button>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mt: 1, flexWrap: 'wrap', gap: 0.75 }}
        >
          <Typography variant="body2" sx={{ minWidth: 110 }}>
            {tr(ru, 'Закрепленные поля', 'Pinned fields')}
          </Typography>
          {allFields.map((field) => (
            <Chip
              key={field}
              size="small"
              label={field}
              variant={pinnedFields.includes(field) ? 'filled' : 'outlined'}
              color={pinnedFields.includes(field) ? 'primary' : 'default'}
              onClick={() => togglePinnedField(field)}
            />
          ))}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
          <Typography variant="body2" sx={{ minWidth: 110 }}>
            {tr(ru, 'Сохраненные поиски', 'Saved searches')}
          </Typography>
          <Select
            size="small"
            value={selectedSavedId}
            displayEmpty
            onChange={(event) => setSelectedSavedId(String(event.target.value))}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">
              {tr(ru, 'Выберите сохраненный поиск', 'Select saved search')}
            </MenuItem>
            {savedSearches.map((search) => (
              <MenuItem key={search.id} value={search.id}>
                {search.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            size="small"
            variant="outlined"
            disabled={!selectedSavedId}
            onClick={() => selectedSavedId && applySavedSearch(selectedSavedId)}
          >
            {tr(ru, 'Применить', 'Apply')}
          </Button>
          <Button
            size="small"
            color="error"
            disabled={!selectedSavedId}
            onClick={() => {
              if (!selectedSavedId) return;
              removeSavedSearch(selectedSavedId);
              setSelectedSavedId('');
            }}
          >
            {tr(ru, 'Удалить', 'Remove')}
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 1, flexWrap: 'wrap', gap: 0.75 }}
        >
          <Typography variant="body2" sx={{ minWidth: 110 }}>
            {tr(ru, 'Разделенный вид', 'Split view')}
          </Typography>
          <Slider
            size="small"
            min={55}
            max={85}
            step={1}
            value={Math.round(splitRatio * 100)}
            onChange={(_, value) => setLayout({ splitRatio: Number(value) / 100 })}
            valueLabelDisplay="auto"
            sx={{ width: 180 }}
          />
          <Typography variant="caption" color="text.secondary">
            {tr(ru, 'Соотношение таблица/статистика', 'Table / Stats ratio')}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'stretch' }}>
          <Box sx={{ flex: `${splitRatio} 1 0`, minWidth: 0, height: 500 }}>
            <DataGrid
              rows={gridRows}
              columns={gridCols}
              disableRowSelectionOnClick
              pageSizeOptions={[25, 50, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={(model) => {
                setLayout({
                  currentPage: model.page,
                  pageSize: model.pageSize,
                });
              }}
              sortModel={sortModel}
              onSortModelChange={(model) => {
                const first = model[0];
                if (!first || !first.sort) {
                  setLayout({ sortField: null, sortDirection: 'asc' });
                  return;
                }
                setLayout({
                  sortField: first.field,
                  sortDirection: first.sort === 'desc' ? 'desc' : 'asc',
                });
              }}
              density="compact"
            />
          </Box>
          <Paper
            variant="outlined"
            sx={{
              flex: `${1 - splitRatio} 1 0`,
              minWidth: 250,
              p: 1.25,
              overflowY: 'auto',
              maxHeight: 500,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {tr(ru, 'Статистика поля', 'Field stats')}
            </Typography>
            <Select
              size="small"
              value={activeStatsField ?? ''}
              onChange={(event) => setLayout({ statsField: String(event.target.value) })}
              sx={{ mb: 1.25, width: '100%' }}
            >
              {allFields.map((field) => (
                <MenuItem key={field} value={field}>
                  {field}
                </MenuItem>
              ))}
            </Select>
            {!stats ? (
              <Typography variant="body2" color="text.secondary">
                {tr(ru, 'Поле не выбрано.', 'No selected field.')}
              </Typography>
            ) : (
              <Stack spacing={0.75}>
                <Chip size="small" label={`${tr(ru, 'Тип', 'Type')}: ${stats.type}`} />
                <Chip size="small" label={`${tr(ru, 'Строки', 'Rows')}: ${stats.total}`} />
                <Chip
                  size="small"
                  label={`${tr(ru, 'Непустые', 'Non-empty')}: ${stats.nonEmpty}`}
                />
                <Chip size="small" label={`${tr(ru, 'Уникальные', 'Unique')}: ${stats.unique}`} />
                <Divider sx={{ my: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {tr(ru, 'Топ значений', 'Top values')}
                </Typography>
                {stats.topValues.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {tr(ru, 'Нет значений.', 'No values.')}
                  </Typography>
                ) : (
                  stats.topValues.map(([value, count]) => (
                    <Chip key={`${value}-${count}`} size="small" label={`${value} (${count})`} />
                  ))
                )}
                {stats.numeric.count > 0 && (
                  <>
                    <Divider sx={{ my: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {tr(ru, 'Числовая сводка', 'Numeric summary')}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${tr(ru, 'Кол-во', 'Count')}: ${stats.numeric.count}`}
                    />
                    <Chip
                      size="small"
                      label={`${tr(ru, 'Мин', 'Min')}: ${stats.numeric.min ?? '-'}`}
                    />
                    <Chip
                      size="small"
                      label={`${tr(ru, 'Макс', 'Max')}: ${stats.numeric.max ?? '-'}`}
                    />
                    <Chip
                      size="small"
                      label={`${tr(ru, 'Среднее', 'Avg')}: ${
                        stats.numeric.avg === null ? '-' : stats.numeric.avg.toFixed(2)
                      }`}
                    />
                    <Chip
                      size="small"
                      label={`P50: ${stats.numeric.p50 === null ? '-' : stats.numeric.p50.toFixed(2)}`}
                    />
                    <Chip
                      size="small"
                      label={`P90: ${stats.numeric.p90 === null ? '-' : stats.numeric.p90.toFixed(2)}`}
                    />
                    <Chip
                      size="small"
                      label={`P95: ${stats.numeric.p95 === null ? '-' : stats.numeric.p95.toFixed(2)}`}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {tr(ru, 'Гистограмма', 'Histogram')}
                    </Typography>
                    {stats.numeric.histogram.map((bucket) => (
                      <Chip
                        key={bucket.label}
                        size="small"
                        label={`${bucket.label}: ${bucket.count}`}
                      />
                    ))}
                  </>
                )}
              </Stack>
            )}
          </Paper>
        </Stack>
      </Paper>
    </Stack>
  );
}
