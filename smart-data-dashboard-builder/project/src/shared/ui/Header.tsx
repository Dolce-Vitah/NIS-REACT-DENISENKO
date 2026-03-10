import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { FileUploadButton } from '../../features/data-import/ui/FileUploadButton';
import { useDataStore } from '../../store/dataStore';
import { useUiStore } from '../../store/uiStore';
import { useDashboardStore } from '../../store/dashboardStore';
import { useFiltersStore } from '../../store/filtersStore';
import { loadDashboardFromStorage, saveDashboardToStorage, clearDashboardStorage } from '../../features/persistence/lib/storage';
import type { DashboardConfig } from '../../entities/dashboard/types';

export function Header() {
  const clearData = useDataStore((s) => s.clear);

  const widgets = useDashboardStore((s) => s.widgets);
  const layouts = useDashboardStore((s) => s.layouts);
  const setDashboardState = useDashboardStore((s) => s.setDashboardState);
  const clearDashboardState = useDashboardStore((s) => s.clearDashboardState);

  const filters = useFiltersStore((s) => s.filters);
  const setFilters = useFiltersStore((s) => s.setFilters);
  const resetFilters = useFiltersStore((s) => s.resetFilters);

  const showNotification = useUiStore((s) => s.showNotification);

  const onSave = () => {
    const payload: DashboardConfig = {
      version: 1,
      widgets,
      layouts,
      filters,
    };
    saveDashboardToStorage(payload);
    showNotification('success', 'Dashboard saved to localStorage');
  };

  const onLoad = () => {
    const data = loadDashboardFromStorage();
    if (!data) {
      showNotification('error', 'No valid saved dashboard found');
      return;
    }

    setDashboardState({ widgets: data.widgets ?? [], layouts: data.layouts ?? [] });
    setFilters(data.filters ?? []);
    showNotification('success', 'Dashboard loaded from localStorage');
  };

  const onReset = () => {
    clearData();
    clearDashboardState();
    resetFilters();
    clearDashboardStorage();
    showNotification('info', 'All state reset (data + dashboard + filters)');
  };

  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={700}>
          Smart Data Dashboard Builder
        </Typography>

        <Stack direction="row" spacing={1}>
          <FileUploadButton />
          <Button variant="outlined" onClick={onLoad}>Load</Button>
          <Button variant="contained" onClick={onSave}>Save</Button>
          <Button color="error" variant="text" onClick={onReset}>Reset</Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}