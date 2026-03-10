import { Box, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { TableWidgetConfig } from '../../entities/widget/types';
import type { DatasetRecord } from '../../entities/dataset/types';
import { useI18n } from '../../shared/i18n/useI18n';

export function TableWidget({
  config,
  rows,
}: {
  config: TableWidgetConfig;
  rows: DatasetRecord[];
}) {
  const { language } = useI18n();
  const ru = language === 'ru';
  const cols = config.columns.length ? config.columns : Object.keys(rows[0] ?? {});
  const data = rows.slice(0, config.limit || 10);

  if (!rows.length)
    return <Typography color="text.secondary">{ru ? 'Нет данных' : 'No data'}</Typography>;
  if (!cols.length)
    return (
      <Typography color="text.secondary">
        {ru ? 'Колонки не выбраны' : 'No columns selected'}
      </Typography>
    );

  const gridRows = data.map((row, index) => {
    const normalized = cols.reduce<Record<string, string>>((acc, col) => {
      acc[col] = String(row[col] ?? '');
      return acc;
    }, {});
    return { id: `${index}-${cols.map((c) => normalized[c]).join('|')}`, ...normalized };
  });
  const gridCols: GridColDef[] = cols.map((col) => ({
    field: col,
    headerName: col,
    flex: 1,
    minWidth: 120,
  }));

  return (
    <Box sx={{ height: 280, width: '100%' }}>
      <DataGrid
        rows={gridRows}
        columns={gridCols}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: Math.min(config.limit || 10, 50), page: 0 } },
        }}
        density="compact"
      />
    </Box>
  );
}
