import { useMemo } from 'react';
import type { DatasetRecord } from '../../../entities/dataset/types';
import type { GlobalFilter, TextOperator } from '../../../store/filtersStore';
import { applyFilters } from './applyFilters';

type DraftFilterState = {
  numberField: string;
  numberOperator: 'between' | 'isNull';
  min: string;
  max: string;
  categoryField: string;
  selectedValues: string[];
  textField: string;
  textOperator: TextOperator;
  textValue: string;
};

export function useFilterDraftImpact(
  rows: DatasetRecord[],
  filters: GlobalFilter[],
  draft: DraftFilterState
): number {
  const {
    numberField,
    numberOperator,
    min,
    max,
    categoryField,
    selectedValues,
    textField,
    textOperator,
    textValue,
  } = draft;

  return useMemo(() => {
    const base = filters.filter(
      (filter) =>
        filter.field !== numberField && filter.field !== categoryField && filter.field !== textField
    );

    if (numberField) {
      if (numberOperator === 'isNull') {
        base.push({
          type: 'text',
          field: numberField,
          operator: 'isNull',
          value: '',
        });
      } else {
        base.push({
          type: 'number-range',
          field: numberField,
          min: min === '' ? null : Number(min),
          max: max === '' ? null : Number(max),
        });
      }
    }

    if (categoryField && selectedValues.length > 0) {
      base.push({ type: 'category', field: categoryField, values: selectedValues });
    }

    if (textField) {
      base.push({
        type: 'text',
        field: textField,
        operator: textOperator,
        value: textValue,
      });
    }

    return applyFilters(rows, base).length;
  }, [
    filters,
    numberField,
    categoryField,
    textField,
    numberOperator,
    min,
    max,
    selectedValues,
    textOperator,
    textValue,
    rows,
  ]);
}
