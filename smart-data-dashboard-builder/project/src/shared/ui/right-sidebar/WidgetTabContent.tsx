import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { AggregationType } from '../../../entities/widget/types';
import { tr } from './helpers';
import { FieldSelect } from './FieldSelect';
import type { WidgetTabContentProps } from './types';

export function WidgetTabContent({
  ru,
  active,
  sectionSx,
  showNoNumericHint,
  allColumns,
  numericColumns,
  categoryColumns,
  rows,
  showMoreOptions,
  hasSecondaryOptions,
  setShowMoreOptions,
  resetWidgetSettings,
  handlers,
}: WidgetTabContentProps) {
  if (!active) {
    return (
      <Box sx={{ px: 0.5, color: 'text.secondary', fontSize: 13 }}>
        {tr(ru, 'Выберите виджет на канвасе.', 'Select a widget on canvas.')}
      </Box>
    );
  }

  return (
    <Stack spacing={1.25}>
      <Box sx={sectionSx}>
        <Stack spacing={1.25}>
          <Typography variant="subtitle2">{tr(ru, 'Виджет', 'Widget')}</Typography>
          <Typography variant="caption" color="text.secondary">
            {tr(ru, 'Тип', 'Type')}: {active.type}
          </Typography>
          <TextField
            size="small"
            label={tr(ru, 'Название', 'Title')}
            value={active.title}
            onChange={(event) => handlers.setWidgetTitle(active.id, event.target.value)}
          />
        </Stack>
      </Box>
      {showNoNumericHint && (
        <Typography variant="caption" color="text.secondary">
          {tr(
            ru,
            'В наборе данных не найдены числовые колонки. Для числовых визуализаций нужна минимум одна number/mixed колонка.',
            'No numeric columns detected in dataset. Numeric visualizations require at least one number/mixed column.'
          )}
        </Typography>
      )}
      <Box sx={sectionSx}>
        <Stack spacing={1.25}>
          <Typography variant="subtitle2">{tr(ru, 'Настройки данных', 'Data settings')}</Typography>
          {active.type === 'kpi' && (
            <>
              <FormControl fullWidth size="small">
                <InputLabel>{tr(ru, 'Агрегация', 'Aggregation')}</InputLabel>
                <Select
                  label={tr(ru, 'Агрегация', 'Aggregation')}
                  value={active.aggregation}
                  onChange={(event) =>
                    handlers.updateKpiWidget(active.id, {
                      aggregation: event.target.value as AggregationType,
                    })
                  }
                >
                  <MenuItem value="count">{tr(ru, 'кол-во', 'count')}</MenuItem>
                  <MenuItem value="sum">{tr(ru, 'сумма', 'sum')}</MenuItem>
                  <MenuItem value="avg">{tr(ru, 'среднее', 'avg')}</MenuItem>
                </Select>
              </FormControl>
              <FieldSelect
                label={tr(ru, 'Поле значения', 'Value field')}
                value={active.valueField}
                options={numericColumns}
                search
                onChange={(value) => handlers.updateKpiWidget(active.id, { valueField: value })}
              />
              {showMoreOptions && (
                <>
                  <FieldSelect
                    label={tr(ru, 'Сравнить по полю (опционально)', 'Compare by field (optional)')}
                    value={active.comparisonField}
                    options={allColumns}
                    search
                    onChange={(value) =>
                      handlers.updateKpiWidget(active.id, {
                        comparisonField: value,
                        comparisonValue: undefined,
                      })
                    }
                  />
                  <FieldSelect
                    label={tr(ru, 'Значение сравнения', 'Compare value')}
                    value={active.comparisonValue}
                    options={(() => {
                      const field = active.comparisonField;
                      if (!field) return [];
                      return Array.from(new Set(rows.map((row) => String(row[field] ?? '')))).slice(
                        0,
                        200
                      );
                    })()}
                    search
                    onChange={(value) =>
                      handlers.updateKpiWidget(active.id, { comparisonValue: value })
                    }
                  />
                </>
              )}
            </>
          )}
          {active.type === 'table' && (
            <>
              <FieldSelect
                label={tr(ru, 'Основная колонка', 'Primary column')}
                value={active.columns[0]}
                options={allColumns}
                search
                onChange={(value) => handlers.updateTableWidget(active.id, { columns: [value] })}
              />
              {showMoreOptions && (
                <TextField
                  size="small"
                  type="number"
                  label={tr(ru, 'Лимит', 'Limit')}
                  value={active.limit}
                  onChange={(event) =>
                    handlers.updateTableWidget(active.id, {
                      limit: Number(event.target.value) || 10,
                    })
                  }
                />
              )}
            </>
          )}
          {(active.type === 'bar' || active.type === 'pie' || active.type === 'three') && (
            <>
              <FieldSelect
                label={tr(ru, 'Категория', 'Category')}
                value={active.categoryField}
                options={categoryColumns}
                search
                onChange={(value) => {
                  if (active.type === 'bar')
                    handlers.updateBarWidget(active.id, { categoryField: value });
                  if (active.type === 'pie')
                    handlers.updatePieWidget(active.id, { categoryField: value });
                  if (active.type === 'three') {
                    handlers.updateThreeWidget(active.id, { categoryField: value });
                  }
                }}
              />
              <FieldSelect
                label={tr(ru, 'Значение', 'Value')}
                value={active.valueField}
                options={numericColumns}
                search
                onChange={(value) => {
                  if (active.type === 'bar')
                    handlers.updateBarWidget(active.id, { valueField: value });
                  if (active.type === 'pie')
                    handlers.updatePieWidget(active.id, { valueField: value });
                  if (active.type === 'three')
                    handlers.updateThreeWidget(active.id, { valueField: value });
                }}
              />
            </>
          )}
          {active.type === 'line' && (
            <>
              <FieldSelect
                label={tr(ru, 'Поле X', 'X field')}
                value={active.xField}
                options={allColumns}
                search
                onChange={(value) => handlers.updateLineWidget(active.id, { xField: value })}
              />
              <FieldSelect
                label={tr(ru, 'Поле Y', 'Y field')}
                value={active.yField}
                options={numericColumns}
                search
                onChange={(value) => handlers.updateLineWidget(active.id, { yField: value })}
              />
            </>
          )}
          {active.type === 'threeScatter' && (
            <>
              <FieldSelect
                label={tr(ru, 'Поле X', 'X field')}
                value={active.xField}
                options={numericColumns}
                search
                onChange={(value) =>
                  handlers.updateThreeScatterWidget(active.id, { xField: value })
                }
              />
              <FieldSelect
                label={tr(ru, 'Поле Y', 'Y field')}
                value={active.yField}
                options={numericColumns}
                search
                onChange={(value) =>
                  handlers.updateThreeScatterWidget(active.id, { yField: value })
                }
              />
              <FieldSelect
                label={tr(ru, 'Поле Z', 'Z field')}
                value={active.zField}
                options={numericColumns}
                search
                onChange={(value) =>
                  handlers.updateThreeScatterWidget(active.id, { zField: value })
                }
              />
              {showMoreOptions && (
                <FieldSelect
                  label={tr(ru, 'Категория (детализация)', 'Category (drilldown)')}
                  value={active.categoryField}
                  options={categoryColumns}
                  search
                  onChange={(value) =>
                    handlers.updateThreeScatterWidget(active.id, { categoryField: value })
                  }
                />
              )}
            </>
          )}
          {active.type === 'threeSurface' && (
            <>
              <FieldSelect
                label={tr(ru, 'Поле X', 'X field')}
                value={active.xField}
                options={numericColumns}
                search
                onChange={(value) =>
                  handlers.updateThreeSurfaceWidget(active.id, { xField: value })
                }
              />
              <FieldSelect
                label={tr(ru, 'Поле Y', 'Y field')}
                value={active.yField}
                options={numericColumns}
                search
                onChange={(value) =>
                  handlers.updateThreeSurfaceWidget(active.id, { yField: value })
                }
              />
              <FieldSelect
                label={tr(ru, 'Поле Z', 'Z field')}
                value={active.zField}
                options={numericColumns}
                search
                onChange={(value) =>
                  handlers.updateThreeSurfaceWidget(active.id, { zField: value })
                }
              />
            </>
          )}
        </Stack>
      </Box>
      {hasSecondaryOptions && (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={() => setShowMoreOptions(!showMoreOptions)}
        >
          {showMoreOptions
            ? tr(ru, 'Меньше настроек', 'Less options')
            : tr(ru, 'Больше настроек', 'More options')}
        </Button>
      )}
      <Button variant="outlined" size="small" fullWidth onClick={resetWidgetSettings}>
        {tr(ru, 'Сбросить настройки виджета', 'Reset widget settings')}
      </Button>
    </Stack>
  );
}
