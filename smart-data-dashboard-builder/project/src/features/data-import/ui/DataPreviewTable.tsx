import { Box, Typography, Chip, Stack } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useDataStore } from '../../../store/dataStore';
import type { DatasetRecord } from '../../../entities/dataset/types';
import { useI18n } from '../../../shared/i18n/useI18n';

const PREVIEW_LIMIT = 20;

type DataPreviewTableProps = {
  rowsOverride?: DatasetRecord[];
};

export function DataPreviewTable({ rowsOverride }: DataPreviewTableProps) {
  const sourceRows = useDataStore((s) => s.rows);
  const schema = useDataStore((s) => s.schema);
  const status = useDataStore((s) => s.status);
  const error = useDataStore((s) => s.error);
  const { language, t } = useI18n();
  const ru = language === 'ru';
  const rows = rowsOverride ?? sourceRows;

  if (status === 'idle') {
    return (
      <Typography color="text.secondary">
        {ru
          ? 'Загрузите CSV/JSON для предпросмотра данных.'
          : 'Upload CSV/JSON to preview imported data.'}
      </Typography>
    );
  }

  if (status === 'loading') {
    return <Typography>{t.common.loading}</Typography>;
  }

  if (status === 'error') {
    return (
      <Typography color="error">{error ?? (ru ? 'Ошибка импорта.' : 'Import failed.')}</Typography>
    );
  }

  if (!schema || !rows.length) {
    return <Typography color="text.secondary">{t.common.noData}</Typography>;
  }

  const columns = schema.columns.map((c) => c.key);
  const previewRows = rows.slice(0, PREVIEW_LIMIT);
  const gridRows = previewRows.map((row, idx) => {
    const normalized = columns.reduce<Record<string, string>>((acc, col) => {
      acc[col] = String(row[col] ?? '');
      return acc;
    }, {});
    return { id: `${idx}-${columns.map((col) => normalized[col]).join('|')}`, ...normalized };
  });
  const gridCols: GridColDef[] = columns.map((col) => ({
    field: col,
    headerName: col,
    minWidth: 130,
    flex: 1,
    sortable: true,
    filterable: true,
  }));

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2">
          {ru ? 'Строки' : 'Rows'}: {rows.length}
          {rowsOverride
            ? ru
              ? ` / ${schema.rowCount} исходных`
              : ` / ${schema.rowCount} source`
            : ''}
        </Typography>
        {schema.columns.map((c) => (
          <Chip key={c.key} size="small" label={`${c.key}: ${c.type}`} />
        ))}
      </Stack>

      <Box sx={{ height: 380, width: '100%' }}>
        <DataGrid
          rows={gridRows}
          columns={gridCols}
          disableRowSelectionOnClick
          pageSizeOptions={[20]}
          initialState={{ pagination: { paginationModel: { pageSize: PREVIEW_LIMIT, page: 0 } } }}
          density="compact"
        />
      </Box>

      {rows.length > PREVIEW_LIMIT && (
        <Typography variant="caption" color="text.secondary">
          {ru
            ? `Показаны первые ${PREVIEW_LIMIT} строк из ${rows.length}.`
            : `Showing first ${PREVIEW_LIMIT} rows of ${rows.length}.`}
        </Typography>
      )}
    </Stack>
  );
}
