import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { ColumnMeta } from '../../../../entities/dataset/types';
import { useI18n } from '../../../../shared/i18n/useI18n';

type CategoryFilterSectionProps = {
  categoryColumns: ColumnMeta[];
  categoryField: string;
  setCategoryField: (value: string) => void;
  categoryOptions: string[];
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
  onApply: () => void;
};

export function CategoryFilterSection({
  categoryColumns,
  categoryField,
  setCategoryField,
  categoryOptions,
  selectedValues,
  setSelectedValues,
  onApply,
}: CategoryFilterSectionProps) {
  const { t } = useI18n();

  return (
    <Box>
      <Typography variant="subtitle2" mb={1}>
        {t.filtersPanel.categoryFilter}
      </Typography>
      <Stack spacing={1}>
        <FormControl fullWidth size="small">
          <InputLabel>{t.filtersPanel.categoryField}</InputLabel>
          <Select
            label={t.filtersPanel.categoryField}
            value={categoryField}
            onChange={(event) => {
              setCategoryField(String(event.target.value));
              setSelectedValues([]);
            }}
          >
            {categoryColumns.map((column) => (
              <MenuItem key={column.key} value={column.key}>
                {column.key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" disabled={!categoryField}>
          <InputLabel>{t.filtersPanel.values}</InputLabel>
          <Select
            multiple
            value={selectedValues}
            onChange={(event) => setSelectedValues(event.target.value as string[])}
            input={<OutlinedInput label={t.filtersPanel.values} />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {categoryOptions.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="outlined" disabled={!categoryField} onClick={onApply}>
          {t.filtersPanel.applyCategory}
        </Button>
      </Stack>
    </Box>
  );
}
