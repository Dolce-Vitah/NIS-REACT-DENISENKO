import { Card, CardContent, IconButton, Stack, Typography, Tooltip, Box } from '@mui/material';
import { alpha, darken, lighten } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { motion } from 'framer-motion';
import type { KeyboardEvent, PropsWithChildren } from 'react';
import { DEFAULT_WIDGET_STYLE, type WidgetStyleConfig } from '../../entities/widget/types';

const MotionCard = motion(Card);

type Props = PropsWithChildren<{
  title: string;
  widgetType?: string;
  active?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  widgetStyle?: WidgetStyleConfig;
}>;

const paletteVars: Record<
  WidgetStyleConfig['chartPalette'],
  { line: string; pie: [string, string, string, string, string, string] }
> = {
  indigo: {
    line: '#667eea',
    pie: ['#667eea', '#7c4dff', '#ff7043', '#26a69a', '#ab47bc', '#ec407a'],
  },
  emerald: {
    line: '#16a34a',
    pie: ['#16a34a', '#22c55e', '#0ea5e9', '#14b8a6', '#f59e0b', '#84cc16'],
  },
  sunset: {
    line: '#f97316',
    pie: ['#f97316', '#ef4444', '#f59e0b', '#eab308', '#fb7185', '#a855f7'],
  },
  mono: {
    line: '#64748b',
    pie: ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'],
  },
};

export function WidgetCard({
  title,
  widgetType,
  children,
  active,
  onClick,
  onDelete,
  onDuplicate,
  widgetStyle,
}: Props) {
  const style = widgetStyle ?? DEFAULT_WIDGET_STYLE;
  const palette = paletteVars[style.chartPalette];
  const interactiveProps = onClick
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onKeyDown: (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
          }
        },
      }
    : {};

  return (
    <MotionCard
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.16 }}
      variant="outlined"
      onClick={onClick}
      {...interactiveProps}
      sx={(theme) => {
        const backgroundOpacity = Math.max(35, Math.min(100, style.glassBlur));
        const widgetOpacity = Math.max(0.35, Math.min(1, backgroundOpacity / 100));
        const borderWidth = Math.max(0, Math.min(6, style.borderContrast));
        const isThreeWidget =
          widgetType === 'three' || widgetType === 'threeScatter' || widgetType === 'threeSurface';
        const baseBackgroundColor =
          theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : isThreeWidget
              ? theme.palette.background.paper
              : style.backgroundColor || DEFAULT_WIDGET_STYLE.backgroundColor;
        const adaptedBackgroundColor =
          theme.palette.mode === 'dark'
            ? darken(baseBackgroundColor, 0.55)
            : lighten(baseBackgroundColor, 0.02);
        const borderColor = alpha(theme.palette.text.primary, 0.16);
        const activeShadow = alpha(theme.palette.primary.main, 0.12 + style.shadowDepth / 120);
        const shadow = alpha(theme.palette.common.black, 0.05 + style.shadowDepth / 170);
        return {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: alpha(adaptedBackgroundColor, backgroundOpacity / 100),
          borderStyle: 'solid',
          borderWidth: `${active ? Math.max(borderWidth, 2) : borderWidth}px`,
          borderColor: active ? 'primary.main' : borderColor,
          opacity: widgetOpacity,
          boxShadow: active ? `0 12px 28px ${activeShadow}` : `0 8px 20px ${shadow}`,
          borderRadius: `${style.cornerRadius}px`,
          cursor: onClick ? 'pointer' : 'default',
          '--gpv2-chart-line': palette.line,
          '--gpv2-chart-pie-1': palette.pie[0],
          '--gpv2-chart-pie-2': palette.pie[1],
          '--gpv2-chart-pie-3': palette.pie[2],
          '--gpv2-chart-pie-4': palette.pie[3],
          '--gpv2-chart-pie-5': palette.pie[4],
          '--gpv2-chart-pie-6': palette.pie[5],
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
        };
      }}
    >
      <Box
        className="widget-drag-handle"
        sx={(theme) => ({
          pt: 1.5,
          px: 2,
          pb: 0.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'move',
          borderTopLeftRadius: `calc(${style.cornerRadius}px - 1px)`,
          borderTopRightRadius: `calc(${style.cornerRadius}px - 1px)`,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.04)
              : alpha(theme.palette.common.black, 0.03),
          borderBottom: '1px solid',
          borderColor: alpha(theme.palette.text.primary, 0.12),
          '&:active': { cursor: 'move' },
        })}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <DragIndicatorIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography fontWeight={600} fontSize={14}>
            {title}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.25}>
          <Tooltip title="Duplicate">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate?.();
              }}
            >
              <ContentCopyIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <CardContent sx={{ flex: 1, p: 2, '&:last-child': { pb: 2 } }}>{children}</CardContent>
    </MotionCard>
  );
}
