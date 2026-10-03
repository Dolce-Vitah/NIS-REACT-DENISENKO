import { AppBar, Box, Button, Chip, Stack, Toolbar, Tooltip } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { BrandLogo } from '../BrandLogo';
import { ThemeToggle } from '../ThemeToggle';
import { FileUploadButton } from '../../../features/data-import/ui/FileUploadButton';
import { useDataStore } from '../../../store/dataStore';
import { useDashboardStore } from '../../../store/dashboardStore';
import { useFiltersStore } from '../../../store/filtersStore';
import { useUiStore } from '../../../store/uiStore';
import { loadDashboardFromStorage, saveDashboardToStorage, clearDashboardStorage } from '../../../features/persistence/lib/storage';
import type { DashboardConfig } from '../../../entities/dashboard/types';

export function TopNav() {
  const clearData = useDataStore((s) => s.clear);
  const rowCount = useDataStore((s) => s.rows.length);

  const widgets = useDashboardStore((s) => s.widgets);
  const layouts = useDashboardStore((s) => s.layouts);
  const setDashboardState = useDashboardStore((s) => s.setDashboardState);
  const clearDashboardState = useDashboardStore((s) => s.clearDashboardState);

  const filters = useFiltersStore((s) => s.filters);
  const setFilters = useFiltersStore((s) => s.setFilters);
  const resetFilters = useFiltersStore((s) => s.resetFilters);

  const showNotification = useUiStore((s) => s.showNotification);

  const onSave = () => {
    const payload: DashboardConfig = { version: 1, widgets, layouts, filters };
    saveDashboardToStorage(payload);
    showNotification('success', 'Dashboard saved');
  };

  const onLoad = () => {
    const data = loadDashboardFromStorage();
    if (!data) return showNotification('error', 'Saved dashboard not found');
    setDashboardState({ widgets: data.widgets ?? [], layouts: data.layouts ?? [] });
    setFilters(data.filters ?? []);
    showNotification('success', 'Dashboard loaded');
  };

  const onReset = () => {
    clearData();
    clearDashboardState();
    resetFilters();
    clearDashboardStorage();
    showNotification('info', 'Workspace reset completed');
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0} className="gpv2-topnav">
      <Toolbar sx={{ minHeight: 66, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <BrandLogo />
          <Chip size="small" label={`Rows ${rowCount}`} />
          <Chip size="small" label={`Widgets ${widgets.length}`} />
          <Chip size="small" label={`Filters ${filters.length}`} />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <ThemeToggle />
          <FileUploadButton />
          <Button variant="outlined" startIcon={<DownloadDoneOutlinedIcon />} onClick={onLoad}>Load</Button>
          <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={onSave}>Save</Button>
          <Button color="error" variant="text" startIcon={<RestartAltOutlinedIcon />} onClick={onReset}>Reset</Button>
          <Tooltip title="Coming soon: AI layout assistant">
            <span>
              <Button variant="outlined" startIcon={<AutoAwesomeOutlinedIcon />} disabled>
                AI Arrange
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Toolbar>
      <Box className="gpv2-topnav-border" />
    </AppBar>
  );
}