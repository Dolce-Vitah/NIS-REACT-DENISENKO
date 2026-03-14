import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  getDefaultWidgetStyleByType,
  type WidgetChartPalette,
  type WidgetConfig,
  type WidgetStyleConfig,
} from '../../../entities/widget/types';
import { tr } from './helpers';
import type { SectionSx } from './types';

type StyleTabContentProps = {
  ru: boolean;
  sectionSx: SectionSx;
  active?: WidgetConfig;
  activeStyle: WidgetStyleConfig;
  asSliderNumber: (value: number | number[]) => number;
  updateWidgetStyle: (id: string, patch: Partial<WidgetStyleConfig>) => void;
};

export function StyleTabContent({
  ru,
  sectionSx,
  active,
  activeStyle,
  asSliderNumber,
  updateWidgetStyle,
}: StyleTabContentProps) {
  return (
    <Stack spacing={1.25}>
      <Box sx={sectionSx}>
        {!active ? (
          <Typography variant="caption" color="text.secondary">
            {tr(ru, 'Выберите виджет для настройки стиля.', 'Select a widget to style it.')}
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            <Typography variant="subtitle2">
              {tr(ru, 'Внешний вид виджета', 'Widget appearance')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {tr(
                ru,
                'Эти настройки влияют только на выбранный виджет.',
                'These settings affect only the selected widget.'
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {tr(ru, 'Прозрачность фона', 'Background opacity')}: {activeStyle.glassBlur}%
            </Typography>
            <Slider
              value={activeStyle.glassBlur}
              min={35}
              max={100}
              step={1}
              onChange={(_event: Event, value: number | number[]) =>
                updateWidgetStyle(active.id, { glassBlur: asSliderNumber(value) })
              }
            />
            <Typography variant="caption" color="text.secondary">
              {tr(ru, 'Радиус скругления', 'Corner radius')}: {activeStyle.cornerRadius}px
            </Typography>
            <Slider
              value={activeStyle.cornerRadius}
              min={8}
              max={28}
              step={1}
              onChange={(_event: Event, value: number | number[]) =>
                updateWidgetStyle(active.id, { cornerRadius: asSliderNumber(value) })
              }
            />
            <Typography variant="caption" color="text.secondary">
              {tr(ru, 'Толщина границы', 'Border thickness')}: {activeStyle.borderContrast}px
            </Typography>
            <Slider
              value={activeStyle.borderContrast}
              min={0}
              max={6}
              step={0.5}
              onChange={(_event: Event, value: number | number[]) =>
                updateWidgetStyle(active.id, { borderContrast: asSliderNumber(value) })
              }
            />
            <Typography variant="caption" color="text.secondary">
              {tr(ru, 'Глубина тени', 'Shadow depth')}: {activeStyle.shadowDepth}
            </Typography>
            <Slider
              value={activeStyle.shadowDepth}
              min={0}
              max={100}
              step={1}
              onChange={(_event: Event, value: number | number[]) =>
                updateWidgetStyle(active.id, { shadowDepth: asSliderNumber(value) })
              }
            />
            <FormControl fullWidth size="small">
              <InputLabel>{tr(ru, 'Палитра графика', 'Chart palette')}</InputLabel>
              <Select
                label={tr(ru, 'Палитра графика', 'Chart palette')}
                value={activeStyle.chartPalette}
                onChange={(event) => {
                  const nextPalette = event.target.value;
                  if (
                    nextPalette === 'indigo' ||
                    nextPalette === 'emerald' ||
                    nextPalette === 'sunset' ||
                    nextPalette === 'mono'
                  ) {
                    updateWidgetStyle(active.id, {
                      chartPalette: nextPalette as WidgetChartPalette,
                    });
                  }
                }}
              >
                <MenuItem value="indigo">{tr(ru, 'Индиго', 'Indigo')}</MenuItem>
                <MenuItem value="emerald">{tr(ru, 'Изумруд', 'Emerald')}</MenuItem>
                <MenuItem value="sunset">{tr(ru, 'Закат', 'Sunset')}</MenuItem>
                <MenuItem value="mono">{tr(ru, 'Моно', 'Mono')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              type="color"
              label={tr(ru, 'Фон 2D виджета', '2D widget background')}
              value={activeStyle.backgroundColor ?? '#ffffff'}
              onChange={(event) =>
                updateWidgetStyle(active.id, { backgroundColor: event.target.value })
              }
              helperText={tr(
                ru,
                'Применяется к 2D виджетам (KPI, Table, Bar, Line, Pie).',
                'Applies to 2D widgets (KPI, Table, Bar, Line, Pie).'
              )}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                updateWidgetStyle(active.id, {
                  ...getDefaultWidgetStyleByType(active.type),
                })
              }
            >
              {tr(ru, 'Сбросить стиль виджета', 'Reset widget appearance')}
            </Button>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
