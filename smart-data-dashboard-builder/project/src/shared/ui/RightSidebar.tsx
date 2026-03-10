import {
  Box, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, Button, Tabs, Tab
} from '@mui/material';
import { useState } from 'react';
import type { AggregationType, WidgetConfig } from '../../entities/widget/types';
import { useDashboardStore } from '../../store/dashboardStore';
import { useDataStore } from '../../store/dataStore';
import { GlobalFiltersPanel } from '../../features/filters/ui/GlobalFiltersPanel';

function FieldSelect({
  label, value, options, onChange,
}: { label: string; value?: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value ?? ''} onChange={(e) => onChange(String(e.target.value))}>
        {options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

type SideTab = 'widget' | 'filters';

export function RightSidebar() {
  const [tab, setTab] = useState<SideTab>('widget');

  const widgets = useDashboardStore((s) => s.widgets);
  const layouts = useDashboardStore((s) => s.layouts);
  const activeWidgetId = useDashboardStore((s) => s.activeWidgetId);
  const updateWidget = useDashboardStore((s) => s.updateWidget);
  const setLayouts = useDashboardStore((s) => s.setLayouts);

  const schema = useDataStore((s) => s.schema);
  const columns = schema?.columns.map((c) => c.key) ?? [];

  const active = widgets.find((w) => w.id === activeWidgetId);
  const activeLayout = layouts.find((l) => l.i === activeWidgetId);

  const patch = (p: Partial<WidgetConfig>) => {
    if (!active) return;
    updateWidget(active.id, p);
  };

  const patchLayout = (patch: Partial<{ w: number; h: number }>) => {
    if (!activeLayout) return;
    setLayouts(layouts.map((l) => (l.i === activeLayout.i ? { ...l, ...patch } : l)));
  };

  return (
    <Box className="panel panel--right" p={2}>
      <Tabs value={tab} onChange={(_, v: SideTab) => setTab(v)} sx={{ mb: 1 }}>
        <Tab label="Widget" value="widget" />
        <Tab label="Filters" value="filters" />
      </Tabs>
      <Divider sx={{ mb: 1.5 }} />

      {tab === 'filters' && <GlobalFiltersPanel />}

      {tab === 'widget' && (
        <>
          <Typography variant="subtitle1" fontWeight={700}>Widget Settings</Typography>
          <Divider sx={{ my: 1.5 }} />

          {!active ? (
            <Typography variant="body2" color="text.secondary">Выбери виджет для настройки.</Typography>
          ) : (
            <Stack spacing={1.5}>
              <TextField size="small" label="Title" value={active.title} onChange={(e) => patch({ title: e.target.value })} />

              {activeLayout && (
                <Stack direction="row" spacing={1}>
                  <TextField size="small" type="number" label="W" value={activeLayout.w} onChange={(e) => patchLayout({ w: Math.max(3, Number(e.target.value) || 3) })} />
                  <TextField size="small" type="number" label="H" value={activeLayout.h} onChange={(e) => patchLayout({ h: Math.max(3, Number(e.target.value) || 3) })} />
                </Stack>
              )}

              {active.type === 'kpi' && (
                <>
                  <FormControl fullWidth size="small">
                    <InputLabel>Aggregation</InputLabel>
                    <Select label="Aggregation" value={active.aggregation} onChange={(e) => patch({ aggregation: e.target.value as AggregationType })}>
                      <MenuItem value="count">count</MenuItem>
                      <MenuItem value="sum">sum</MenuItem>
                      <MenuItem value="avg">avg</MenuItem>
                    </Select>
                  </FormControl>
                  <FieldSelect label="Value field" value={active.valueField} options={columns} onChange={(v) => patch({ valueField: v })} />
                </>
              )}

              {active.type === 'table' && (
                <>
                  <TextField size="small" type="number" label="Limit" value={active.limit} onChange={(e) => patch({ limit: Number(e.target.value) || 10 })} />
                  <FieldSelect label="Primary column" value={active.columns[0]} options={columns} onChange={(v) => patch({ columns: [v] })} />
                </>
              )}

              {(active.type === 'bar' || active.type === 'pie' || active.type === 'three') && (
                <>
                  <FieldSelect label="Category" value={active.categoryField} options={columns} onChange={(v) => patch({ categoryField: v })} />
                  <FieldSelect label="Value" value={active.valueField} options={columns} onChange={(v) => patch({ valueField: v })} />
                </>
              )}

              {active.type === 'line' && (
                <>
                  <FieldSelect label="X field" value={active.xField} options={columns} onChange={(v) => patch({ xField: v })} />
                  <FieldSelect label="Y field" value={active.yField} options={columns} onChange={(v) => patch({ yField: v })} />
                </>
              )}

              <Button variant="outlined" onClick={() => setLayouts(layouts.map((l) => ({ ...l, w: 4, h: 4 })))}>
                Normalize widget sizes
              </Button>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}