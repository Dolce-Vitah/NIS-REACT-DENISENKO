import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import type { WidgetType } from '../../entities/widget/types';
import { useDashboardStore } from '../../store/dashboardStore';

const widgets: Array<{ label: string; type: WidgetType }> = [
  { label: 'KPI Card', type: 'kpi' },
  { label: 'Table', type: 'table' },
  { label: 'Bar Chart', type: 'bar' },
  { label: 'Line Chart', type: 'line' },
  { label: 'Pie Chart', type: 'pie' },
  { label: '3D Bars', type: 'three' },
];

export function LeftSidebar() {
  const addWidget = useDashboardStore((s) => s.addWidget);

  return (
    <Box className="panel" p={2}>
      <Typography variant="subtitle1" fontWeight={700} mb={1}>Widgets</Typography>
      <List dense>
        {widgets.map((w) => (
          <ListItemButton key={w.type} onClick={() => addWidget(w.type)}>
            <ListItemText primary={w.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}