import {
  Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Chip, Stack
} from '@mui/material';
import { useDataStore } from '../../../store/dataStore';

const PREVIEW_LIMIT = 20;

export function DataPreviewTable() {
  const rows = useDataStore((s) => s.rows);
  const schema = useDataStore((s) => s.schema);
  const status = useDataStore((s) => s.status);
  const error = useDataStore((s) => s.error);

  if (status === 'idle') {
    return <Typography color="text.secondary">Загрузи CSV/JSON, чтобы увидеть предпросмотр.</Typography>;
  }

  if (status === 'loading') {
    return <Typography>Загрузка данных...</Typography>;
  }

  if (status === 'error') {
    return <Typography color="error">{error ?? 'Ошибка импорта данных.'}</Typography>;
  }

  if (!schema || !rows.length) {
    return <Typography color="text.secondary">Нет данных для отображения.</Typography>;
  }

  const columns = schema.columns.map((c) => c.key);
  const previewRows = rows.slice(0, PREVIEW_LIMIT);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2">
          Rows: {schema.rowCount}
        </Typography>
        {schema.columns.map((c) => (
          <Chip key={c.key} size="small" label={`${c.key}: ${c.type}`} />
        ))}
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col}><b>{col}</b></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {previewRows.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col}>{String(row[col] ?? '')}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {rows.length > PREVIEW_LIMIT && (
        <Typography variant="caption" color="text.secondary">
          Показаны первые {PREVIEW_LIMIT} строк из {rows.length}.
        </Typography>
      )}
    </Stack>
  );
}