import { Box, List, ListItemButton, ListItemText, Stack } from '@mui/material';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import ScatterPlotOutlinedIcon from '@mui/icons-material/ScatterPlotOutlined';
import TerrainOutlinedIcon from '@mui/icons-material/TerrainOutlined';
import { useTheme } from '@mui/material/styles';

import type { WidgetType } from '../../entities/widget/types';
import { useDashboardStore } from '../../store/dashboardStore';
import { useI18n } from '../i18n/useI18n';

export function LeftSidebar() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const addWidget = useDashboardStore((s) => s.addWidget);
  const { language } = useI18n();
  const widgets: Array<{ label: string; type: WidgetType; icon: React.ReactNode }> = [
    { label: 'KPI', type: 'kpi', icon: <InsightsOutlinedIcon fontSize="small" /> },
    {
      label: language === 'ru' ? 'Таблица' : 'Table',
      type: 'table',
      icon: <TableChartOutlinedIcon fontSize="small" />,
    },
    {
      label: language === 'ru' ? 'Столбцы' : 'Bar',
      type: 'bar',
      icon: <BarChartOutlinedIcon fontSize="small" />,
    },
    {
      label: language === 'ru' ? 'Линия' : 'Line',
      type: 'line',
      icon: <ShowChartOutlinedIcon fontSize="small" />,
    },
    {
      label: language === 'ru' ? 'Круговая' : 'Pie',
      type: 'pie',
      icon: <DonutLargeOutlinedIcon fontSize="small" />,
    },
    {
      label: language === 'ru' ? '3D Столбцы' : '3D Bar',
      type: 'three',
      icon: <ViewInArOutlinedIcon fontSize="small" />,
    },
    {
      label: language === 'ru' ? '3D Облако' : '3D Scatter',
      type: 'threeScatter',
      icon: <ScatterPlotOutlinedIcon fontSize="small" />,
    },
    {
      label: language === 'ru' ? '3D Поверхность' : '3D Surface',
      type: 'threeSurface',
      icon: <TerrainOutlinedIcon fontSize="small" />,
    },
  ];

  return (
    <Box className="panel" p={1}>
      <List dense sx={{ p: 0 }}>
        {widgets.map((w) => (
          <ListItemButton
            key={w.type}
            onClick={() => addWidget(w.type)}
            sx={{
              mb: 1.5,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: isDark ? 'rgba(15,23,42,.54)' : 'rgba(255,255,255,.84)',
              '&:hover': { backgroundColor: isDark ? 'rgba(30,41,59,.72)' : 'rgba(250,252,255,1)' },
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>
                {w.icon}
              </Box>
              <ListItemText
                primary={w.label}
                slotProps={{ primary: { fontSize: 14, fontWeight: 600, color: 'text.primary' } }}
              />
            </Stack>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
