import { Alert, Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useDataStore } from '../../../store/dataStore';
import { useFiltersStore } from '../../../store/filtersStore';
import type { TextOperator } from '../../../store/filtersStore';
import { getUniqueValues } from '../lib/filterOptions';
import { useFilterDraftImpact } from '../lib/useFilterDraftImpact';
import { useI18n } from '../../../shared/i18n/useI18n';
import { ActiveFiltersSection } from './filters-panel/ActiveFiltersSection';
import { CategoryFilterSection } from './filters-panel/CategoryFilterSection';
import { formatFilterLabel } from './filters-panel/formatters';
import { NumberFilterSection } from './filters-panel/NumberFilterSection';
import { SavedFilterSetsSection } from './filters-panel/SavedFilterSetsSection';
import { TextFilterSection } from './filters-panel/TextFilterSection';
import type { PanelMode } from './filters-panel/types';

export function GlobalFiltersPanel({ mode = 'basic' }: { mode?: PanelMode }) {
  const { t } = useI18n();
  const rows = useDataStore((state) => state.rows);
  const schema = useDataStore((state) => state.schema);

  const filters = useFiltersStore((state) => state.filters);
  const upsertNumberRangeFilter = useFiltersStore((state) => state.upsertNumberRangeFilter);
  const upsertCategoryFilter = useFiltersStore((state) => state.upsertCategoryFilter);
  const upsertTextFilter = useFiltersStore((state) => state.upsertTextFilter);
  const removeFilter = useFiltersStore((state) => state.removeFilter);
  const resetFilters = useFiltersStore((state) => state.resetFilters);
  const savedSets = useFiltersStore((state) => state.savedSets);
  const pinnedFields = useFiltersStore((state) => state.pinnedFields);
  const togglePinnedField = useFiltersStore((state) => state.togglePinnedField);
  const saveCurrentFilterSet = useFiltersStore((state) => state.saveCurrentFilterSet);
  const applySavedFilterSet = useFiltersStore((state) => state.applySavedFilterSet);
  const removeSavedFilterSet = useFiltersStore((state) => state.removeSavedFilterSet);

  const columns = schema?.columns ?? [];
  const numberColumns = columns.filter(
    (column) => column.type === 'number' || column.type === 'mixed'
  );
  const categoryColumns = columns.filter(
    (column) => column.type === 'string' || column.type === 'mixed' || column.type === 'boolean'
  );
  const textColumns = columns.filter(
    (column) => column.type === 'string' || column.type === 'mixed'
  );

  const [numberField, setNumberField] = useState('');
  const [min, setMin] = useState<string>('');
  const [max, setMax] = useState<string>('');
  const [numberOperator, setNumberOperator] = useState<'between' | 'isNull'>('between');

  const [categoryField, setCategoryField] = useState('');
  const categoryOptions = useMemo(
    () => (categoryField ? getUniqueValues(rows, categoryField).slice(0, 200) : []),
    [rows, categoryField]
  );
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const [textField, setTextField] = useState('');
  const [textOperator, setTextOperator] = useState<TextOperator>('contains');
  const [textValue, setTextValue] = useState('');
  const [setName, setSetName] = useState('');

  const draftImpactCount = useFilterDraftImpact(rows, filters, {
    numberField,
    numberOperator,
    min,
    max,
    categoryField,
    selectedValues,
    textField,
    textOperator,
    textValue,
  });

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700}>
        {t.filtersPanel.title}
      </Typography>
      <Divider sx={{ my: 1.5 }} />

      {!schema ? (
        <Typography variant="body2" color="text.secondary">
          {t.filtersPanel.uploadFirst}
        </Typography>
      ) : (
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {filters.length === 0 ? (
              <Chip size="small" label={t.filtersPanel.noActiveFilters} />
            ) : (
              filters.map((filter) => (
                <Chip
                  key={`${filter.field}-${filter.type}`}
                  size="small"
                  label={formatFilterLabel(filter)}
                  onDelete={() => removeFilter(filter.field)}
                />
              ))
            )}
          </Stack>
          <Alert severity="info">
            {t.filtersPanel.impactPreview}: {draftImpactCount} / {rows.length} {t.filtersPanel.rows}
          </Alert>

          <NumberFilterSection
            mode={mode}
            numberColumns={numberColumns}
            numberField={numberField}
            setNumberField={setNumberField}
            min={min}
            setMin={setMin}
            max={max}
            setMax={setMax}
            numberOperator={numberOperator}
            setNumberOperator={setNumberOperator}
            onApply={() => {
              if (mode === 'advanced' && numberOperator === 'isNull') {
                upsertTextFilter(numberField, 'isNull', '');
                return;
              }
              upsertNumberRangeFilter(
                numberField,
                min === '' ? null : Number(min),
                max === '' ? null : Number(max)
              );
            }}
          />

          <CategoryFilterSection
            categoryColumns={categoryColumns}
            categoryField={categoryField}
            setCategoryField={setCategoryField}
            categoryOptions={categoryOptions}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            onApply={() => upsertCategoryFilter(categoryField, selectedValues)}
          />
          {mode === 'advanced' && (
            <TextFilterSection
              textColumns={textColumns}
              textField={textField}
              setTextField={setTextField}
              textOperator={textOperator}
              setTextOperator={setTextOperator}
              textValue={textValue}
              setTextValue={setTextValue}
              onApply={() => upsertTextFilter(textField, textOperator, textValue)}
            />
          )}

          <Divider />
          {mode === 'advanced' && (
            <SavedFilterSetsSection
              setName={setName}
              setSetName={setSetName}
              filters={filters}
              savedSets={savedSets}
              onSave={() => {
                saveCurrentFilterSet(setName.trim());
                setSetName('');
              }}
              onApply={applySavedFilterSet}
              onRemove={removeSavedFilterSet}
            />
          )}
          {mode === 'advanced' && <Divider />}

          <ActiveFiltersSection
            mode={mode}
            filters={filters}
            pinnedFields={pinnedFields}
            onTogglePin={togglePinnedField}
            onRemove={removeFilter}
          />

          <Button color="error" onClick={resetFilters}>
            {t.filtersPanel.resetAll}
          </Button>
        </Stack>
      )}
    </Box>
  );
}
