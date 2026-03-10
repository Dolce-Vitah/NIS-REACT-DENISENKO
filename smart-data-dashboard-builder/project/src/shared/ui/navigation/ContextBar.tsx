import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Chip,
} from '@mui/material';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useLayoutUiStore, type WorkspaceMode } from '../../../store/layoutUiStore';
import { useDiscoverStore } from '../../../store/discoverStore';
import { useDataStore } from '../../../store/dataStore';
import type { DiscoverTimeRange } from '../../../features/discover/lib/query';
import { useI18n } from '../../i18n/useI18n';

function tr(ru: boolean, ruText: string, enText: string): string {
  return ru ? ruText : enText;
}

export function ContextBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const workspaceMode = useLayoutUiStore((s) => s.workspaceMode);
  const setWorkspaceMode = useLayoutUiStore((s) => s.setWorkspaceMode);
  const schema = useDataStore((s) => s.schema);
  const query = useDiscoverStore((s) => s.query);
  const timeField = useDiscoverStore((s) => s.timeField);
  const timeRange = useDiscoverStore((s) => s.timeRange);
  const savedSearches = useDiscoverStore((s) => s.savedSearches);
  const setQuery = useDiscoverStore((s) => s.setQuery);
  const setTimeField = useDiscoverStore((s) => s.setTimeField);
  const setTimeRange = useDiscoverStore((s) => s.setTimeRange);
  const saveCurrentSearch = useDiscoverStore((s) => s.saveCurrentSearch);
  const applySavedSearch = useDiscoverStore((s) => s.applySavedSearch);
  const removeSavedSearch = useDiscoverStore((s) => s.removeSavedSearch);
  const [editorOpen, setEditorOpen] = useState(false);
  const [queryDraft, setQueryDraft] = useState(query);

  const onMode = (_: unknown, next: WorkspaceMode | null) => {
    if (!next) return;
    setWorkspaceMode(next);
    void navigate(next === 'discover' ? '/discover' : '/dashboard');
  };
  const { t, language } = useI18n();
  const ru = language === 'ru';

  const modeLabel =
    workspaceMode === 'build'
      ? t.context.buildMode
      : workspaceMode === 'analyze'
        ? t.context.analyzeMode
        : workspaceMode === 'present'
          ? t.context.presentMode
          : t.context.discoverMode;

  const timeCandidates = (schema?.columns ?? [])
    .filter(
      (column) =>
        column.key.toLowerCase().includes('date') || column.key.toLowerCase().includes('time')
    )
    .map((column) => column.key);

  const onSaveSearch = () => {
    const name = window.prompt(
      tr(ru, 'Название сохраненного поиска', 'Saved search name'),
      tr(ru, 'Мой поиск', 'My search')
    );
    if (!name) return;
    saveCurrentSearch(name);
  };

  const hasSearchContext = query.trim() !== '' || Boolean(timeField) || timeRange !== 'all';
  const monacoTheme = theme.palette.mode === 'dark' ? 'vs-dark' : 'vs-light';

  return (
    <Box className="gpv2-contextbar">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ gap: 1, flexWrap: 'wrap' }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
            {t.context.dashboardStudio}
          </Typography>
          <Chip size="small" color="primary" label={modeLabel} />
        </Stack>

        <ToggleButtonGroup size="small" exclusive value={workspaceMode} onChange={onMode}>
          <Tooltip
            title={
              ru
                ? 'Сборка: библиотека виджетов + канвас + панель настроек'
                : 'Build: widget library + canvas + inspector'
            }
          >
            <ToggleButton value="build" aria-label={tr(ru, 'Режим сборки', 'Build mode')}>
              <ConstructionOutlinedIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>

          <Tooltip
            title={tr(ru, 'Анализ: канвас + панель настроек', 'Analyze: canvas + inspector')}
          >
            <ToggleButton value="analyze" aria-label={tr(ru, 'Режим анализа', 'Analyze mode')}>
              <AnalyticsOutlinedIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>

          <Tooltip title={tr(ru, 'Презентация: только канвас', 'Present: only canvas')}>
            <ToggleButton value="present" aria-label={tr(ru, 'Режим презентации', 'Present mode')}>
              <SlideshowOutlinedIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
          <Tooltip
            title={
              ru
                ? 'Исследование: отдельный режим анализа данных'
                : 'Discover: dedicated data exploration mode'
            }
          >
            <ToggleButton
              value="discover"
              aria-label={tr(ru, 'Режим исследования', 'Discover mode')}
            >
              <ManageSearchOutlinedIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="KQL-lite: country:USA AND sales>100"
          sx={{ minWidth: 280, flex: '1 1 320px' }}
        />
        <Button
          size="small"
          variant="outlined"
          startIcon={<CodeOutlinedIcon />}
          onClick={() => {
            setQueryDraft(query);
            setEditorOpen(true);
          }}
        >
          {t.context.queryEditor}
        </Button>
        <Select
          size="small"
          value={timeField ?? ''}
          displayEmpty
          onChange={(event) => setTimeField(event.target.value ? String(event.target.value) : null)}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="">{t.context.noTimeField}</MenuItem>
          {timeCandidates.map((field) => (
            <MenuItem key={field} value={field}>
              {field}
            </MenuItem>
          ))}
        </Select>
        <Select
          size="small"
          value={timeRange}
          onChange={(event) => setTimeRange(event.target.value as DiscoverTimeRange)}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="all">{t.context.allTime}</MenuItem>
          <MenuItem value="last15m">{tr(ru, 'Последние 15м', 'Last 15m')}</MenuItem>
          <MenuItem value="last24h">{tr(ru, 'Последние 24ч', 'Last 24h')}</MenuItem>
          <MenuItem value="last7d">{tr(ru, 'Последние 7д', 'Last 7d')}</MenuItem>
          <MenuItem value="last30d">{tr(ru, 'Последние 30д', 'Last 30d')}</MenuItem>
        </Select>
        <Button
          size="small"
          variant="outlined"
          startIcon={<SaveOutlinedIcon />}
          disabled={!hasSearchContext}
          onClick={onSaveSearch}
        >
          {t.context.saveSearch}
        </Button>
        <Select
          size="small"
          value=""
          displayEmpty
          onChange={(event) => applySavedSearch(String(event.target.value))}
          sx={{ minWidth: 180 }}
          renderValue={() => t.context.openSavedSearch}
        >
          {savedSearches.length === 0 ? (
            <MenuItem disabled value="">
              {t.context.noSavedSearches}
            </MenuItem>
          ) : (
            savedSearches.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ width: '100%' }}
                >
                  <Box component="span">{item.name}</Box>
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeSavedSearch(item.id);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon fontSize="inherit" />
                  </IconButton>
                </Stack>
              </MenuItem>
            ))
          )}
        </Select>
      </Stack>

      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{tr(ru, 'Редактор запроса Discover', 'Discover query editor')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {tr(ru, 'Примеры KQL-lite', 'KQL-lite examples')}:{' '}
            <code>country:USA AND sales &gt; 100</code>, <code>city:Berlin</code>,{' '}
            <code>revenue&gt;=1000</code>.
          </Typography>
          <Editor
            height="320px"
            defaultLanguage="sql"
            theme={monacoTheme}
            value={queryDraft}
            onChange={(value) => setQueryDraft(value ?? '')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              wordWrap: 'on',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditorOpen(false)}>{tr(ru, 'Отмена', 'Cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => {
              setQuery(queryDraft);
              setEditorOpen(false);
            }}
          >
            {tr(ru, 'Применить запрос', 'Apply query')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
