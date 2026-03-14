import { Box, Divider, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { getDefaultWidgetStyleByType } from '../../entities/widget/types';
import { useDashboardStore } from '../../store/dashboardStore';
import { useDataStore } from '../../store/dataStore';
import { GlobalFiltersPanel } from '../../features/filters/ui/GlobalFiltersPanel';
import { useI18n } from '../i18n/useI18n';
import { clamp, NUMERIC_WIDGET_TYPES } from './right-sidebar/helpers';
import { StyleTabContent } from './right-sidebar/StyleTabContent';
import type { SideTab } from './right-sidebar/types';
import { WidgetTabContent } from './right-sidebar/WidgetTabContent';

export function RightSidebar() {
  const [tab, setTab] = useState<SideTab>('widget');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const { t, language } = useI18n();
  const ru = language === 'ru';

  const widgets = useDashboardStore((s) => s.widgets);
  const activeWidgetId = useDashboardStore((s) => s.activeWidgetId);
  const setWidgetTitle = useDashboardStore((s) => s.setWidgetTitle);
  const updateKpiWidget = useDashboardStore((s) => s.updateKpiWidget);
  const updateTableWidget = useDashboardStore((s) => s.updateTableWidget);
  const updateBarWidget = useDashboardStore((s) => s.updateBarWidget);
  const updateLineWidget = useDashboardStore((s) => s.updateLineWidget);
  const updatePieWidget = useDashboardStore((s) => s.updatePieWidget);
  const updateThreeWidget = useDashboardStore((s) => s.updateThreeWidget);
  const updateThreeScatterWidget = useDashboardStore((s) => s.updateThreeScatterWidget);
  const updateThreeSurfaceWidget = useDashboardStore((s) => s.updateThreeSurfaceWidget);
  const updateWidgetStyle = useDashboardStore((s) => s.updateWidgetStyle);

  const schema = useDataStore((s) => s.schema);
  const rows = useDataStore((s) => s.rows);
  const allColumns = schema?.columns.map((c) => c.key) ?? [];
  const numericColumns = (schema?.columns ?? [])
    .filter((c) => c.type === 'number' || c.type === 'mixed')
    .map((c) => c.key);
  const categoryColumns = (schema?.columns ?? [])
    .filter((c) => c.type === 'string' || c.type === 'mixed' || c.type === 'number')
    .map((c) => c.key);

  const active = widgets.find((w) => w.id === activeWidgetId);
  const showNoNumericHint = Boolean(
    active && NUMERIC_WIDGET_TYPES.has(active.type) && numericColumns.length === 0
  );
  const hasSecondaryOptions = Boolean(
    active && (active.type === 'kpi' || active.type === 'table' || active.type === 'threeScatter')
  );
  const asSliderNumber = (value: number | number[]) => (Array.isArray(value) ? value[0] : value);
  const activeStyleRaw = active
    ? (active.style ?? getDefaultWidgetStyleByType(active.type))
    : getDefaultWidgetStyleByType('kpi');
  const activeStyle = {
    ...activeStyleRaw,
    glassBlur: clamp(activeStyleRaw.glassBlur, 35, 100),
    borderContrast: clamp(activeStyleRaw.borderContrast, 0, 6),
  };
  const sectionSx = {
    p: 1.25,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1.5,
    bgcolor: 'background.paper',
  } as const;

  const resetWidgetSettings = () => {
    if (!active) return;
    if (active.type === 'kpi') {
      updateKpiWidget(active.id, {
        aggregation: 'count',
        valueField: undefined,
        comparisonField: undefined,
        comparisonValue: undefined,
      });
    }
    if (active.type === 'bar')
      updateBarWidget(active.id, { categoryField: undefined, valueField: undefined });
    if (active.type === 'pie')
      updatePieWidget(active.id, { categoryField: undefined, valueField: undefined });
    if (active.type === 'three')
      updateThreeWidget(active.id, { categoryField: undefined, valueField: undefined });
    if (active.type === 'line')
      updateLineWidget(active.id, { xField: undefined, yField: undefined });
    if (active.type === 'table') updateTableWidget(active.id, { columns: [], limit: 10 });
    if (active.type === 'threeScatter') {
      updateThreeScatterWidget(active.id, {
        xField: undefined,
        yField: undefined,
        zField: undefined,
        categoryField: undefined,
      });
    }
    if (active.type === 'threeSurface') {
      updateThreeSurfaceWidget(active.id, {
        xField: undefined,
        yField: undefined,
        zField: undefined,
      });
    }
  };

  return (
    <Box
      className="panel"
      p={1.25}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        '& .MuiButton-root': { minHeight: 32, fontSize: 12.5, borderRadius: 1.25 },
        '& .MuiInputBase-root': { fontSize: 13 },
        '& .MuiFormControlLabel-label': { fontSize: 13 },
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, v: SideTab) => setTab(v)}
        variant="fullWidth"
        sx={{
          mb: 1,
          minHeight: 34,
          '& .MuiTab-root': {
            minWidth: 0,
            minHeight: 34,
            px: 0.75,
            py: 0.5,
            fontSize: 11.5,
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      >
        <Tab label={t.sidebar.widget} value="widget" />
        <Tab label={t.sidebar.style} value="style" />
        <Tab label={t.sidebar.filters} value="filters" />
      </Tabs>
      <Divider sx={{ mb: 1.25 }} />
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
        {tab === 'filters' && (
          <Box sx={{ ...sectionSx, p: 1 }}>
            <GlobalFiltersPanel mode="basic" />
          </Box>
        )}

        {tab === 'style' && (
          <StyleTabContent
            ru={ru}
            sectionSx={sectionSx}
            active={active}
            activeStyle={activeStyle}
            asSliderNumber={asSliderNumber}
            updateWidgetStyle={updateWidgetStyle}
          />
        )}

        {tab === 'widget' && (
          <WidgetTabContent
            ru={ru}
            active={active}
            sectionSx={sectionSx}
            showNoNumericHint={showNoNumericHint}
            allColumns={allColumns}
            numericColumns={numericColumns}
            categoryColumns={categoryColumns}
            rows={rows}
            showMoreOptions={showMoreOptions}
            hasSecondaryOptions={hasSecondaryOptions}
            setShowMoreOptions={setShowMoreOptions}
            resetWidgetSettings={resetWidgetSettings}
            handlers={{
              setWidgetTitle,
              updateKpiWidget,
              updateTableWidget,
              updateBarWidget,
              updateLineWidget,
              updatePieWidget,
              updateThreeWidget,
              updateThreeScatterWidget,
              updateThreeSurfaceWidget,
              updateWidgetStyle,
            }}
          />
        )}
      </Box>
    </Box>
  );
}
