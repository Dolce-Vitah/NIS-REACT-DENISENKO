import { Card, CardContent, IconButton, Stack, Typography, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

const MotionCard = motion(Card);

type Props = PropsWithChildren<{
  title: string;
  active?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}>;

export function WidgetCard({ title, children, active, onClick, onDelete, onDuplicate }: Props) {
  return (
    <MotionCard
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.16 }}
      variant="outlined"
      onClick={onClick}
      sx={{
        height: '100%',
        borderColor: active ? 'primary.main' : 'divider',
        boxShadow: active ? '0 12px 28px rgba(109,94,252,.20)' : undefined,
      }}
    >
      <CardContent sx={{ height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.25}>
          <Stack direction="row" spacing={1} alignItems="center">
            <DragIndicatorIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography fontWeight={700} fontSize={14}>{title}</Typography>
          </Stack>

          <Stack direction="row" spacing={0.25}>
            <Tooltip title="Duplicate">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDuplicate?.(); }}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete?.(); }}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        {children}
      </CardContent>
    </MotionCard>
  );
}