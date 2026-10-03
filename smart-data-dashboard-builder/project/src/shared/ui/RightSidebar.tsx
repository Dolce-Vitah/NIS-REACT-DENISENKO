import {
  Box, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Tabs, Tab
} from '@mui/material';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
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

type SideTab = 'widget' | 'style' | 'filters';

export function RightSidebar() {
  const [tab, setTab] = useState<SideTab>('widget');

  const widgets = useDashboardStore((s) => s.widgets);
  const activeWidgetId = useDashboardStore((s) => s.activeWidgetId);
  const updateWidget = useDashboardStore((s) => s.updateWidget);

  const schema = useDataStore((s) => s.schema);
  const columns = schema?.columns.map((c) => c.key) ?? [];

  const active = widgets.find((w) => w.id === activeWidgetId);

  const patch = (p: Partial<WidgetConfig>) => {
    if (!active) return;
    updateWidget(active.id, p);
  };

  return (
    <Box className="panel" p={1.5}>
      <Tabs value={tab} onChange={(_, v: SideTab) => setTab(v)} sx={{ mb: 1 }}>
        <Tab icon={<TuneOutlinedIcon fontSize="small" />} iconPosition="start" label="Widget" value="widget" />
        <Tab icon={<PaletteOutlinedIcon fontSize="small" />} iconPosition="start" label="Style" value="style" />
        <Tab icon={<FilterAltOutlinedIcon fontSize="small" />} iconPosition="start" label="Filters" value="filters" />
      </Tabs>
      <Divider sx={{ mb: 1.25 }} />

      {tab === 'filters' && <GlobalFiltersPanel />}

      {tab === 'style' && (
        <Box sx={{ px: 0.5, color: 'text.secondary', fontSize: 13 }}>
          Style controls will be added in next iteration.
        </Box>
      )}

      {tab === 'widget' && (
        <>
          {!active ? (
            <Box sx={{ px: 0.5, color: 'text.secondary', fontSize: 13 }}>
              Select a widget on canvas.
            </Box>
          ) : (
            <Stack spacing={1.25}>
              <TextField size="small" label="Title" value={active.title} onChange={(e) => patch({ title: e.target.value })} />

              {active.type === 'kpi' && (
                <>
                  <FormControl fullWidth size="small">
                    <InputLabel>Aggregation</InputLabel>
                    <Select
                      label="Aggregation"
                      value={active.aggregation}
                      onChange={(e) => patch({ aggregation: e.target.value as AggregationType })}
                    >
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
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}