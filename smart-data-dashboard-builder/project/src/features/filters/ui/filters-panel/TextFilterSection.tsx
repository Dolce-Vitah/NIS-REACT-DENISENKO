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
import type { TextFilterOperator } from './types';

type TextFilterSectionProps = {
  textColumns: ColumnMeta[];
  textField: string;
  setTextField: (value: string) => void;
  textOperator: TextFilterOperator;
  setTextOperator: (value: TextFilterOperator) => void;
  textValue: string;
  setTextValue: (value: string) => void;
  onApply: () => void;
};

export function TextFilterSection({
  textColumns,
  textField,
  setTextField,
  textOperator,
  setTextOperator,
  textValue,
  setTextValue,
  onApply,
}: TextFilterSectionProps) {
  const { t } = useI18n();

  return (
    <Box>
      <Typography variant="subtitle2" mb={1}>
        {t.filtersPanel.textFilter}
      </Typography>
      <Stack spacing={1}>
        <FormControl fullWidth size="small">
          <InputLabel>{t.filtersPanel.textField}</InputLabel>
          <Select
            label={t.filtersPanel.textField}
            value={textField}
            onChange={(event) => setTextField(String(event.target.value))}
          >
            {textColumns.map((column) => (
              <MenuItem key={column.key} value={column.key}>
                {column.key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel>{t.filtersPanel.operator}</InputLabel>
          <Select
            label={t.filtersPanel.operator}
            value={textOperator}
            onChange={(event) => {
              const next = event.target.value;
              if (
                next === 'contains' ||
                next === 'startsWith' ||
                next === 'equals' ||
                next === 'isNull'
              ) {
                setTextOperator(next);
              }
            }}
          >
            <MenuItem value="contains">{t.filtersPanel.contains}</MenuItem>
            <MenuItem value="startsWith">{t.filtersPanel.startsWith}</MenuItem>
            <MenuItem value="equals">{t.filtersPanel.equals}</MenuItem>
            <MenuItem value="isNull">{t.filtersPanel.isNull}</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          label={t.filtersPanel.value}
          disabled={textOperator === 'isNull'}
          value={textValue}
          onChange={(event) => setTextValue(event.target.value)}
        />
        <Button variant="outlined" disabled={!textField} onClick={onApply}>
          {t.filtersPanel.applyText}
        </Button>
      </Stack>
    </Box>
  );
}
