import { Box, Paper, Tabs, Tab, Divider, Chip } from '@mui/material';
import GridLayoutLib, { useContainerWidth } from 'react-grid-layout';
import type { Layout, ReactGridLayoutProps } from 'react-grid-layout';
import { useMemo, useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useLayoutUiStore } from '../../store/layoutUiStore';
import { useFilteredRows } from '../../features/discover/model/useFilteredRows';
import { WidgetCard } from '../../widgets/ui/WidgetCard';
import { WidgetRenderer } from '../../widgets/ui/WidgetRenderer';
import { DataPreviewTable } from '../../features/data-import/ui/DataPreviewTable';
import { DiscoverTable } from '../../features/discover/ui/DiscoverTable';
import { useI18n } from '../i18n/useI18n';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const GridLayout = GridLayoutLib as React.ComponentType<ReactGridLayoutProps>;
type CanvasTab = 'dashboard' | 'preview';

export function Canvas() {
  const [tab, setTab] = useState<CanvasTab>('dashboard');
  const { width, containerRef, mounted } = useContainerWidth();

  const widgets = useDashboardStore((s) => s.widgets);
  const layoutsStore = useDashboardStore((s) => s.layouts);
  const activeWidgetId = useDashboardStore((s) => s.activeWidgetId);
  const setActive = useDashboardStore((s) => s.setActiveWidget);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  const duplicateWidget = useDashboardStore((s) => s.duplicateWidget);
  const setLayouts = useDashboardStore((s) => s.setLayouts);

  const { t } = useI18n();
  const { rows, filteredRows } = useFilteredRows();
  const workspaceMode = useLayoutUiStore((s) => s.workspaceMode);
  const activeTab = workspaceMode === 'discover' ? 'discover' : tab;

  const layout = useMemo<Layout>(
    () =>
      layoutsStore.map((l) => ({
        i: l.i,
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h,
        minW: l.minW,
        minH: l.minH,
      })),
    [layoutsStore]
  );

  return (
    <Box
      className="canvas"
      sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <Paper
        sx={{
          p: 2,
          flex: 1,
          borderRadius: 'var(--gpv2-corner-radius)',
          backdropFilter: 'blur(var(--gpv2-glass-blur))',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          m: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {workspaceMode === 'discover' ? (
            <Chip
              size="small"
              color="primary"
              label={t.canvas.discoverMode}
              sx={{ flexShrink: 0 }}
            />
          ) : (
            <Tabs
              value={tab}
              onChange={(_, next: CanvasTab) => setTab(next)}
              sx={{ minWidth: 0, '& .MuiTabs-flexContainer': { flexWrap: 'wrap' } }}
            >
              <Tab label={t.canvas.dashboard} value="dashboard" />
              <Tab label={t.canvas.dataPreview} value="preview" />
            </Tabs>
          )}
          <Chip
            size="small"
            color="primary"
            label={`${t.canvas.filtered}: ${filteredRows.length} / ${rows.length}`}
            sx={{ flexShrink: 0 }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          ref={containerRef}
          sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', mr: -1, pr: 1 }}
        >
          {activeTab === 'preview' ? (
            <Box key="preview">
              <DataPreviewTable rowsOverride={filteredRows} />
            </Box>
          ) : activeTab === 'discover' ? (
            <Box key="discover">
              <DiscoverTable />
            </Box>
          ) : (
            <Box key="dashboard">
              {!widgets.length ? (
                <Box
                  sx={{
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                  }}
                >
                  {t.canvas.addWidgetsHint}
                </Box>
              ) : mounted ? (
                <GridLayout
                  className="layout"
                  layout={layout}
                  width={width}
                  gridConfig={{ cols: 12, rowHeight: 70, margin: [12, 12] }}
                  dragConfig={{ handle: '.widget-drag-handle' }}
                  onLayoutChange={(nextLayout: Layout) => {
                    const normalized = nextLayout.map((l) => ({
                      i: l.i,
                      x: l.x,
                      y: l.y,
                      w: l.w,
                      h: l.h,
                      minW: l.minW,
                      minH: l.minH,
                    }));
                    setLayouts(normalized);
                  }}
                >
                  {widgets.map((w) => (
                    <div key={w.id} style={{ height: '100%' }}>
                      <WidgetCard
                        title={w.title}
                        widgetType={w.type}
                        active={w.id === activeWidgetId}
                        widgetStyle={w.style}
                        onClick={() => setActive(w.id)}
                        onDelete={() => removeWidget(w.id)}
                        onDuplicate={() => duplicateWidget(w.id)}
                      >
                        <WidgetRenderer widget={w} rows={filteredRows} />
                      </WidgetCard>
                    </div>
                  ))}
                </GridLayout>
              ) : null}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
