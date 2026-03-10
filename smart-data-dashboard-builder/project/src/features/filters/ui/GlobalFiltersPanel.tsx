import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useDataStore } from '../../../store/dataStore';
import { useFiltersStore } from '../../../store/filtersStore';
import { getUniqueValues } from '../lib/filterOptions';

export function GlobalFiltersPanel() {
  const rows = useDataStore((s) => s.rows);
  const schema = useDataStore((s) => s.schema);

  const filters = useFiltersStore((s) => s.filters);
  const upsertNumberRangeFilter = useFiltersStore((s) => s.upsertNumberRangeFilter);
  const upsertCategoryFilter = useFiltersStore((s) => s.upsertCategoryFilter);
  const removeFilter = useFiltersStore((s) => s.removeFilter);
  const resetFilters = useFiltersStore((s) => s.resetFilters);

  const columns = schema?.columns ?? [];
  const numberColumns = columns.filter((c) => c.type === 'number' || c.type === 'mixed');
  const categoryColumns = columns.filter((c) => c.type === 'string' || c.type === 'mixed' || c.type === 'boolean');

  const [numberField, setNumberField] = useState('');
  const [min, setMin] = useState<string>('');
  const [max, setMax] = useState<string>('');

  const [categoryField, setCategoryField] = useState('');
  const categoryOptions = useMemo(
    () => (categoryField ? getUniqueValues(rows, categoryField).slice(0, 200) : []),
    [rows, categoryField]
  );
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700}>Global Filters</Typography>
      <Divider sx={{ my: 1.5 }} />

      {!schema ? (
        <Typography variant="body2" color="text.secondary">
          Сначала загрузи данные.
        </Typography>
      ) : (
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" mb={1}>Number range filter</Typography>
            <Stack spacing={1}>
              <FormControl fullWidth size="small">
                <InputLabel>Numeric field</InputLabel>
                <Select
                  label="Numeric field"
                  value={numberField}
                  onChange={(e) => setNumberField(String(e.target.value))}
                >
                  {numberColumns.map((c) => (
                    <MenuItem key={c.key} value={c.key}>{c.key}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  label="Min"
                  type="number"
                  fullWidth
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                />
                <TextField
                  size="small"
                  label="Max"
                  type="number"
                  fullWidth
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
              </Stack>

              <Button
                variant="outlined"
                disabled={!numberField}
                onClick={() =>
                  upsertNumberRangeFilter(
                    numberField,
                    min === '' ? null : Number(min),
                    max === '' ? null : Number(max)
                  )
                }
              >
                Apply numeric filter
              </Button>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" mb={1}>Category filter</Typography>
            <Stack spacing={1}>
              <FormControl fullWidth size="small">
                <InputLabel>Category field</InputLabel>
                <Select
                  label="Category field"
                  value={categoryField}
                  onChange={(e) => {
                    setCategoryField(String(e.target.value));
                    setSelectedValues([]);
                  }}
                >
                  {categoryColumns.map((c) => (
                    <MenuItem key={c.key} value={c.key}>{c.key}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" disabled={!categoryField}>
                <InputLabel>Values</InputLabel>
                <Select
                  multiple
                  value={selectedValues}
                  onChange={(e) => setSelectedValues(e.target.value as string[])}
                  input={<OutlinedInput label="Values" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {selected.map((v) => <Chip key={v} label={v} size="small" />)}
                    </Box>
                  )}
                >
                  {categoryOptions.map((v) => (
                    <MenuItem key={v} value={v}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                disabled={!categoryField}
                onClick={() => upsertCategoryFilter(categoryField, selectedValues)}
              >
                Apply category filter
              </Button>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" mb={1}>Active filters</Typography>
            <Stack spacing={1}>
              {filters.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Нет активных фильтров.
                </Typography>
              )}
              {filters.map((f) => (
                <Stack
                  key={f.field}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="caption">
                    {f.type === 'number-range'
                      ? `${f.field}: [${f.min ?? '-∞'} .. ${f.max ?? '+∞'}]`
                      : `${f.field}: ${f.values.length ? f.values.join(', ') : '(all)'}`}
                  </Typography>
                  <Button size="small" color="error" onClick={() => removeFilter(f.field)}>
                    remove
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Button color="error" onClick={resetFilters}>
            Reset all filters
          </Button>
        </Stack>
      )}
    </Box>
  );
}