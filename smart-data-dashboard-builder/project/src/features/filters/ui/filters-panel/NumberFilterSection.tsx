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
import type { ColumnMeta } from '../../../../entities/dataset/types';
import { useI18n } from '../../../../shared/i18n/useI18n';
import type { PanelMode } from './types';

type NumberFilterSectionProps = {
  mode: PanelMode;
  numberColumns: ColumnMeta[];
  numberField: string;
  setNumberField: (value: string) => void;
  min: string;
  setMin: (value: string) => void;
  max: string;
  setMax: (value: string) => void;
  numberOperator: 'between' | 'isNull';
  setNumberOperator: (value: 'between' | 'isNull') => void;
  onApply: () => void;
};

export function NumberFilterSection({
  mode,
  numberColumns,
  numberField,
  setNumberField,
  min,
  setMin,
  max,
  setMax,
  numberOperator,
  setNumberOperator,
  onApply,
}: NumberFilterSectionProps) {
  const { t } = useI18n();

  return (
    <Box>
      <Typography variant="subtitle2" mb={1}>
        {t.filtersPanel.numberRange}
      </Typography>
      <Stack spacing={1}>
        <FormControl fullWidth size="small">
          <InputLabel>{t.filtersPanel.numericField}</InputLabel>
          <Select
            label={t.filtersPanel.numericField}
            value={numberField}
            onChange={(event) => setNumberField(String(event.target.value))}
          >
            {numberColumns.map((column) => (
              <MenuItem key={column.key} value={column.key}>
                {column.key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {mode === 'advanced' && (
          <FormControl fullWidth size="small">
            <InputLabel>{t.filtersPanel.operator}</InputLabel>
            <Select
              label={t.filtersPanel.operator}
              value={numberOperator}
              onChange={(event) => {
                const next = event.target.value;
                setNumberOperator(next === 'isNull' ? 'isNull' : 'between');
              }}
            >
              <MenuItem value="between">{t.filtersPanel.between}</MenuItem>
              <MenuItem value="isNull">{t.filtersPanel.isNull}</MenuItem>
            </Select>
          </FormControl>
        )}

        <Stack direction="row" spacing={1} display={numberOperator === 'between' ? 'flex' : 'none'}>
          <TextField
            size="small"
            label={t.filtersPanel.min}
            type="number"
            fullWidth
            value={min}
            onChange={(event) => setMin(event.target.value)}
          />
          <TextField
            size="small"
            label={t.filtersPanel.max}
            type="number"
            fullWidth
            value={max}
            onChange={(event) => setMax(event.target.value)}
          />
        </Stack>

        <Button variant="outlined" disabled={!numberField} onClick={onApply}>
          {t.filtersPanel.applyNumeric}
        </Button>
      </Stack>
    </Box>
  );
}
