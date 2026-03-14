import { Typography } from '@mui/material';
import type { KpiWidgetConfig } from '../../entities/widget/types';
import type { DatasetRecord } from '../../entities/dataset/types';
import { asNumber } from '../lib/chartData';
import { useI18n } from '../../shared/i18n/useI18n';

function tr(ru: boolean, ruText: string, enText: string): string {
  return ru ? ruText : enText;
}

function getCompareLabel(
  ru: boolean,
  comparisonField: string | undefined,
  comparisonValueTarget: string | undefined
): string | null {
  if (!comparisonField || !comparisonValueTarget) return null;
  return tr(
    ru,
    `сравнение с остальными, исключая ${comparisonField}=${comparisonValueTarget}`,
    `vs rest excluding ${comparisonField}=${comparisonValueTarget}`
  );
}

function getAggregationSuffix(ru: boolean, valueField: string | undefined): string {
  if (!valueField) return '';
  return tr(ru, `по полю ${valueField}`, `of ${valueField}`);
}

function aggregate(config: KpiWidgetConfig, rows: DatasetRecord[]): number {
  if (config.aggregation === 'count') return rows.length;
  const field = config.valueField;
  if (!field) return 0;

  const nums = rows.map((r) => asNumber(r[field])).filter((v): v is number => v !== null);

  if (config.aggregation === 'sum') return nums.reduce((a, b) => a + b, 0);
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

export function KpiWidget({ config, rows }: { config: KpiWidgetConfig; rows: DatasetRecord[] }) {
  const { language } = useI18n();
  const ru = language === 'ru';
  const value = aggregate(config, rows);
  const comparisonField = config.comparisonField;
  const comparisonValueTarget = config.comparisonValue;
  const comparisonRows =
    comparisonField && comparisonValueTarget !== undefined
      ? rows.filter((row) => String(row[comparisonField] ?? '') !== comparisonValueTarget)
      : null;
  const comparisonValue = comparisonRows ? aggregate(config, comparisonRows) : null;
  const delta = comparisonValue !== null ? value - comparisonValue : null;
  const deltaPct =
    delta !== null && comparisonValue !== null && comparisonValue !== 0
      ? (delta / Math.abs(comparisonValue)) * 100
      : null;

  const deltaPrefix = delta && delta > 0 ? '+' : '';
  const deltaText =
    delta === null
      ? null
      : `${deltaPrefix}${delta.toFixed(2).replace(/\.00$/, '')}${
          deltaPct !== null && Number.isFinite(deltaPct)
            ? ` (${deltaPrefix}${deltaPct.toFixed(1)}%)`
            : ''
        }`;

  const compareLabel = getCompareLabel(ru, comparisonField, comparisonValueTarget);

  if (comparisonField && !comparisonValueTarget) {
    return (
      <>
        <Typography variant="h4" fontWeight={800}>
          {Number.isFinite(value) ? value.toFixed(2).replace(/\.00$/, '') : '-'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {tr(
            ru,
            'Выберите значение сравнения, чтобы включить сравнительный KPI',
            'Select compare value to enable comparative KPI'
          )}
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant="h4" fontWeight={800}>
        {Number.isFinite(value) ? value.toFixed(2).replace(/\.00$/, '') : '-'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {config.aggregation.toUpperCase()} {getAggregationSuffix(ru, config.valueField)}
      </Typography>
      {deltaText && (
        <Typography
          variant="caption"
          color={delta !== null && delta >= 0 ? 'success.main' : 'error.main'}
        >
          {deltaText}
        </Typography>
      )}
      {compareLabel && (
        <Typography variant="caption" color="text.secondary">
          {compareLabel}
        </Typography>
      )}
    </>
  );
}
