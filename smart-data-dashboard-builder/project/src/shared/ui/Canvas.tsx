import { Box, Paper, Tabs, Tab, Divider, Stack, Chip } from '@mui/material';
import GridLayoutLib from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import { useMemo, useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useDataStore } from '../../store/dataStore';
import { useFiltersStore } from '../../store/filtersStore';
import { applyFilters } from '../../features/filters/lib/applyFilters';
import { WidgetCard } from '../../widgets/ui/WidgetCard';
import { WidgetRenderer } from '../../widgets/ui/WidgetRenderer';
import { DataPreviewTable } from '../../features/data-import/ui/DataPreviewTable';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const GridLayout = GridLayoutLib as unknown as React.ComponentType<any>;
type CanvasTab = 'dashboard' | 'preview';

export function Canvas() {
  const [tab, setTab] = useState<CanvasTab>('dashboard');

  const widgets = useDashboardStore((s) => s.widgets);
  const layoutsStore = useDashboardStore((s) => s.layouts);
  const activeWidgetId = useDashboardStore((s) => s.activeWidgetId);
  const setActive = useDashboardStore((s) => s.setActiveWidget);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  const duplicateWidget = useDashboardStore((s) => s.duplicateWidget);
  const setLayouts = useDashboardStore((s) => s.setLayouts);

  const rows = useDataStore((s) => s.rows);
  const filters = useFiltersStore((s) => s.filters);
  const filteredRows = useMemo(() => applyFilters(rows, filters), [rows, filters]);

  const layout = useMemo<Layout>(
    () => layoutsStore.map((l) => ({ i: l.i, x: l.x, y: l.y, w: l.w, h: l.h, minW: l.minW, minH: l.minH })),
    [layoutsStore]
  );

  return (
    <Box className="canvas">
      <Paper sx={{ p: 2, minHeight: '100%', borderRadius: 3 }}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" mb={1}>
          <Chip size="small" color="primary" label={`Filtered: ${filteredRows.length} / ${rows.length}`} />
        </Stack>

        <Tabs value={tab} onChange={(_, next: CanvasTab) => setTab(next)} sx={{ mb: 1 }}>
          <Tab label="Dashboard" value="dashboard" />
          <Tab label="Data Preview" value="preview" />
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        <Box>
          {tab === 'preview' ? (
            <Box key="preview">
              <DataPreviewTable />
            </Box>
          ) : (
            <Box key="dashboard">
              {!widgets.length ? (
                <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 4, textAlign: 'center' }}>
                  Add widgets from the left panel to start building.
                </Box>
              ) : (
                <GridLayout
                  className="layout"
                  layout={layout}
                  cols={12}
                  rowHeight={70}
                  width={980}
                  margin={[12, 12]}
                  draggableHandle=".widget-drag-handle"
                  onLayoutChange={(nextLayout: Layout) => {
                    const normalized = nextLayout.map((l) => ({
                      i: l.i, x: l.x, y: l.y, w: l.w, h: l.h, minW: l.minW, minH: l.minH,
                    }));
                    setLayouts(normalized);
                  }}
                >
                  {widgets.map((w) => (
                    <div key={w.id}>
                      <WidgetCard
                        title={w.title}
                        active={w.id === activeWidgetId}
                        onClick={() => setActive(w.id)}
                        onDelete={() => removeWidget(w.id)}
                        onDuplicate={() => duplicateWidget(w.id)}
                      >
                        <div className="widget-drag-handle">⋮⋮ drag</div>
                        <WidgetRenderer widget={w} rows={filteredRows} />
                      </WidgetCard>
                    </div>
                  ))}
                </GridLayout>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}