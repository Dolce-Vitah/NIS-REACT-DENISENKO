import { Card, CardContent, IconButton, Stack, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  title: string;
  active?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}>;

export function WidgetCard({ title, children, active, onClick, onDelete, onDuplicate }: Props) {
  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderColor: active ? 'primary.main' : 'divider',
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography fontWeight={700}>{title}</Typography>
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDuplicate?.(); }}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete?.(); }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}