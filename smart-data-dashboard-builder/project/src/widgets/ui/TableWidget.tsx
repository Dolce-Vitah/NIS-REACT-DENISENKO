import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import type { TableWidgetConfig } from '../../entities/widget/types';
import type { DatasetRecord } from '../../entities/dataset/types';

export function TableWidget({ config, rows }: { config: TableWidgetConfig; rows: DatasetRecord[] }) {
  const cols = config.columns.length ? config.columns : Object.keys(rows[0] ?? {});
  const data = rows.slice(0, config.limit || 10);

  if (!rows.length) return <Typography color="text.secondary">No data</Typography>;
  if (!cols.length) return <Typography color="text.secondary">No columns selected</Typography>;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>{cols.map((c) => <TableCell key={c}><b>{c}</b></TableCell>)}</TableRow>
      </TableHead>
      <TableBody>
        {data.map((r, i) => (
          <TableRow key={i}>
            {cols.map((c) => <TableCell key={c}>{String(r[c] ?? '')}</TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}