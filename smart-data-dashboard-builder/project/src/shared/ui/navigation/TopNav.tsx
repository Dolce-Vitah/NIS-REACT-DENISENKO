import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  Toolbar,
} from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { toPng } from 'html-to-image';
import { BrandLogo } from '../BrandLogo';
import { ThemeToggle } from '../ThemeToggle';
import { FileUploadButton } from '../../../features/data-import/ui/FileUploadButton';
import { useDataStore } from '../../../store/dataStore';
import { useDashboardStore } from '../../../store/dashboardStore';
import { useFiltersStore } from '../../../store/filtersStore';
import { useUiStore } from '../../../store/uiStore';
import {
  loadBookmarksFromStorage,
  saveBookmarksToStorage,
  loadDashboardFromStorage,
  saveDashboardToStorage,
  clearDashboardStorage,
} from '../../../features/persistence/lib/storage';
import type { DashboardBookmark, DashboardConfig } from '../../../entities/dashboard/types';
import { useLayoutUiStore } from '../../../store/layoutUiStore';
import { generateStarterDashboard } from '../../../features/insights/lib/starterDashboard';
import { exportDashboardConfig, exportRowsToCsv } from '../../../features/export/lib/export';
import { usePublishSnapshotMutation } from '../../../features/collaboration/model/queries';
import { useJobsStore } from '../../../store/jobsStore';
import { useDiscoverStore } from '../../../store/discoverStore';
import { useFilteredRows } from '../../../features/discover/model/useFilteredRows';
import { useI18n } from '../../i18n/useI18n';
import { BookmarksMenu } from './top-nav/BookmarksMenu';
import { ExportMenu } from './top-nav/ExportMenu';
import { GuideDialog } from './top-nav/GuideDialog';
import { WorkspaceMenu } from './top-nav/WorkspaceMenu';

export function TopNav() {
  const rows = useDataStore((s) => s.rows);
  const schema = useDataStore((s) => s.schema);
  const clearData = useDataStore((s) => s.clear);
  const rowCount = useDataStore((s) => s.rows.length);

  const widgets = useDashboardStore((s) => s.widgets);
  const layouts = useDashboardStore((s) => s.layouts);
  const setDashboardState = useDashboardStore((s) => s.setDashboardState);
  const clearDashboardState = useDashboardStore((s) => s.clearDashboardState);
  const undoDashboard = useDashboardStore((s) => s.undo);
  const redoDashboard = useDashboardStore((s) => s.redo);
  const canUndoDashboard = useDashboardStore((s) => s.canUndo());
  const canRedoDashboard = useDashboardStore((s) => s.canRedo());

  const filters = useFiltersStore((s) => s.filters);
  const query = useDiscoverStore((s) => s.query);
  const timeField = useDiscoverStore((s) => s.timeField);
  const timeRange = useDiscoverStore((s) => s.timeRange);
  const discoverLayout = useDiscoverStore((s) => s.layout);
  const setDiscoverState = useDiscoverStore((s) => s.setDiscoverState);
  const resetDiscoverState = useDiscoverStore((s) => s.resetDiscoverState);

  const setFilters = useFiltersStore((s) => s.setFilters);
  const resetFilters = useFiltersStore((s) => s.resetFilters);
  const undoFilters = useFiltersStore((s) => s.undo);
  const redoFilters = useFiltersStore((s) => s.redo);
  const canUndoFilters = useFiltersStore((s) => s.canUndo());
  const canRedoFilters = useFiltersStore((s) => s.canRedo());

  const workspaceMode = useLayoutUiStore((s) => s.workspaceMode);
  const setWorkspaceMode = useLayoutUiStore((s) => s.setWorkspaceMode);
  const { language, setLanguage, t } = useI18n();
  const ru = language === 'ru';
  const { filteredRows } = useFilteredRows();

  const showNotification = useUiStore((s) => s.showNotification);
  const [bookmarksAnchorEl, setBookmarksAnchorEl] = useState<HTMLElement | null>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<HTMLElement | null>(null);
  const [workspaceAnchorEl, setWorkspaceAnchorEl] = useState<HTMLElement | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<DashboardBookmark[]>(() => {
    const result = loadBookmarksFromStorage();
    return result.status === 'ok'
      ? [...result.data].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      : [];
  });

  const bookmarksMenuOpen = Boolean(bookmarksAnchorEl);
  const exportMenuOpen = Boolean(exportAnchorEl);
  const workspaceMenuOpen = Boolean(workspaceAnchorEl);
  const publishSnapshotMutation = usePublishSnapshotMutation();
  const setJobRunning = useJobsStore((s) => s.setRunning);
  const setJobSuccess = useJobsStore((s) => s.setSuccess);
  const setJobError = useJobsStore((s) => s.setError);
  const clearJob = useJobsStore((s) => s.clearJob);
  const jobs = useJobsStore((s) => s.jobs);

  const onSave = useCallback(() => {
    const payload: DashboardConfig = {
      version: 1,
      widgets,
      layouts,
      filters,
      discover: { query, timeField, timeRange, layout: discoverLayout },
    };
    saveDashboardToStorage(payload);
    showNotification('success', t.topnav.saveDashboard);
  }, [
    widgets,
    layouts,
    filters,
    query,
    timeField,
    timeRange,
    discoverLayout,
    showNotification,
    t.topnav.saveDashboard,
  ]);

  const onLoad = useCallback(() => {
    const result = loadDashboardFromStorage();
    if (result.status === 'missing')
      return showNotification(
        'error',
        ru ? 'Сохраненный дашборд не найден' : 'Saved dashboard not found'
      );
    if (result.status === 'invalid')
      return showNotification(
        'error',
        ru ? 'Сохраненный дашборд поврежден' : 'Saved dashboard is corrupted'
      );

    setDashboardState({ widgets: result.data.widgets, layouts: result.data.layouts });
    setFilters(result.data.filters);
    setDiscoverState({
      query: result.data.discover?.query ?? '',
      timeField: result.data.discover?.timeField ?? null,
      timeRange: result.data.discover?.timeRange ?? 'all',
      layout: result.data.discover?.layout,
    });
    showNotification('success', ru ? 'Дашборд загружен' : 'Dashboard loaded');
  }, [setDashboardState, setFilters, setDiscoverState, showNotification, ru]);

  const onAutoInsight = () => {
    if (!rows.length || !schema) {
      showNotification('error', ru ? 'Сначала загрузите данные' : 'Upload data first');
      return;
    }
    const starter = generateStarterDashboard(rows, schema);
    if (!starter) {
      showNotification(
        'error',
        ru
          ? 'Не удалось построить стартовый дашборд для этого набора данных'
          : 'Unable to build starter dashboard from this dataset'
      );
      return;
    }
    setDashboardState(starter);
    showNotification('success', ru ? 'Стартовый дашборд создан' : 'Starter dashboard generated');
  };

  const openBookmarksMenu = (event: MouseEvent<HTMLElement>) => {
    setBookmarksAnchorEl(event.currentTarget);
  };

  const closeBookmarksMenu = () => {
    setBookmarksAnchorEl(null);
  };

  const openExportMenu = (event: MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const closeExportMenu = () => {
    setExportAnchorEl(null);
  };

  const openWorkspaceMenu = (event: MouseEvent<HTMLElement>) => {
    setWorkspaceAnchorEl(event.currentTarget);
  };

  const closeWorkspaceMenu = () => {
    setWorkspaceAnchorEl(null);
  };

  const onSaveBookmark = () => {
    const name = window.prompt(ru ? 'Название закладки' : 'Bookmark name');
    if (!name) return;

    const current = loadBookmarksFromStorage();
    const existing = current.status === 'ok' ? current.data : [];
    const nextBookmark: DashboardBookmark = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      createdAt: new Date().toISOString(),
      payload: {
        version: 1,
        widgets,
        layouts,
        filters,
        discover: { query, timeField, timeRange, layout: discoverLayout },
        workspaceMode,
      },
    };
    const next = [nextBookmark, ...existing].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    saveBookmarksToStorage(next);
    setBookmarks(next);
    showNotification('success', ru ? 'Закладка сохранена' : 'Bookmark saved');
  };

  const onLoadBookmark = (bookmarkId: string) => {
    const current = loadBookmarksFromStorage();
    if (current.status !== 'ok') {
      showNotification('error', ru ? 'Закладки не найдены' : 'Bookmarks not found');
      return;
    }
    const selected = current.data.find((bookmark) => bookmark.id === bookmarkId);
    if (!selected) {
      showNotification('error', ru ? 'Закладка не найдена' : 'Bookmark not found');
      return;
    }

    setDashboardState({ widgets: selected.payload.widgets, layouts: selected.payload.layouts });
    setFilters(selected.payload.filters);
    setDiscoverState({
      query: selected.payload.discover?.query ?? '',
      timeField: selected.payload.discover?.timeField ?? null,
      timeRange: selected.payload.discover?.timeRange ?? 'all',
      layout: selected.payload.discover?.layout,
    });
    setWorkspaceMode(selected.payload.workspaceMode);
    showNotification(
      'success',
      ru ? `Закладка "${selected.name}" загружена` : `Bookmark "${selected.name}" loaded`
    );
  };

  const onDeleteBookmark = (bookmarkId: string) => {
    const current = loadBookmarksFromStorage();
    if (current.status !== 'ok') return;
    const next = current.data.filter((bookmark) => bookmark.id !== bookmarkId);
    saveBookmarksToStorage(next);
    setBookmarks(next);
    showNotification('info', ru ? 'Закладка удалена' : 'Bookmark removed');
  };

  const onExportCsv = () => {
    if (!filteredRows.length) {
      showNotification(
        'error',
        ru ? 'Нет отфильтрованных данных для экспорта' : 'No filtered data to export'
      );
      return;
    }
    exportRowsToCsv(filteredRows, 'filtered-data.csv');
    showNotification(
      'success',
      ru ? 'CSV с отфильтрованными данными экспортирован' : 'Filtered CSV exported'
    );
  };

  const onExportConfig = () => {
    const payload: DashboardConfig = {
      version: 1,
      widgets,
      layouts,
      filters,
      discover: { query, timeField, timeRange, layout: discoverLayout },
    };
    exportDashboardConfig(payload, 'dashboard-config.json');
    showNotification(
      'success',
      ru ? 'Конфигурация дашборда экспортирована' : 'Dashboard config exported'
    );
  };

  const onExportPng = async () => {
    const element = document.querySelector<HTMLElement>('.canvas');
    if (!element) {
      showNotification('error', ru ? 'Область дашборда не найдена' : 'Dashboard canvas not found');
      return;
    }

    try {
      const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'dashboard.png';
      link.href = dataUrl;
      link.click();
      showNotification('success', ru ? 'PNG дашборда экспортирован' : 'Dashboard PNG exported');
    } catch {
      showNotification('error', ru ? 'Не удалось экспортировать PNG' : 'Failed to export PNG');
    }
  };

  const onExportPdf = () => {
    window.print();
    showNotification(
      'info',
      ru ? 'Используйте "Сохранить как PDF" в диалоге печати' : 'Use Save as PDF in print dialog'
    );
  };

  const onReset = () => {
    clearData();
    clearDashboardState();
    resetFilters();
    resetDiscoverState();
    clearDashboardStorage();
    showNotification(
      'info',
      ru ? 'Сброс рабочего пространства завершен' : 'Workspace reset completed'
    );
  };

  const onPublishSnapshot = async () => {
    const title = window.prompt(
      ru ? 'Название снимка' : 'Snapshot title',
      ru ? 'Снимок дашборда' : 'Dashboard Snapshot'
    );
    if (!title) return;
    const jobId = 'publish-snapshot';
    try {
      setJobRunning(jobId, ru ? 'Публикация снимка...' : 'Publishing snapshot...');
      const result = await publishSnapshotMutation.mutateAsync({
        title,
        createdBy: 'local-user',
        accessRole: 'owner',
        dashboard: {
          version: 1,
          widgets,
          layouts,
          filters,
          discover: { query, timeField, timeRange, layout: discoverLayout },
        },
      });
      setJobSuccess(jobId, `Published: ${result.id}`);
      showNotification(
        'success',
        ru ? `Снимок опубликован (${result.id})` : `Snapshot published (${result.id})`
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : ru
            ? 'Не удалось опубликовать снимок'
            : 'Failed to publish snapshot';
      setJobError(jobId, message);
      showNotification('error', message);
    } finally {
      window.setTimeout(() => clearJob(jobId), 2500);
    }
  };

  const onUndo = useCallback(() => {
    undoDashboard();
    undoFilters();
  }, [undoDashboard, undoFilters]);

  const onRedo = useCallback(() => {
    redoDashboard();
    redoFilters();
  }, [redoDashboard, redoFilters]);

  const canUndo = canUndoDashboard || canUndoFilters;
  const canRedo = canRedoDashboard || canRedoFilters;

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return (
        target.isContentEditable ||
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        Boolean(target.closest('[contenteditable="true"]'))
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || isEditableTarget(event.target)) return;
      const key = event.key.toLowerCase();
      if (key === 's') {
        event.preventDefault();
        onSave();
      }
      if (key === 'l') {
        event.preventDefault();
        onLoad();
      }
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault();
        onUndo();
      }
      if ((key === 'z' && event.shiftKey) || key === 'y') {
        event.preventDefault();
        onRedo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onLoad, onRedo, onSave, onUndo]);

  return (
    <AppBar position="sticky" color="inherit" elevation={0} className="gpv2-topnav">
      <Toolbar sx={{ minHeight: 66, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <BrandLogo />
          <Chip size="small" label={`${ru ? 'Строк' : 'Rows'} ${rowCount}`} />
          <Chip size="small" label={`${ru ? 'Виджетов' : 'Widgets'} ${widgets.length}`} />
          <Chip size="small" label={`${ru ? 'Фильтров' : 'Filters'} ${filters.length}`} />
          {Object.entries(jobs).map(([id, job]) => (
            <Chip
              key={id}
              size="small"
              color={
                job.status === 'error' ? 'error' : job.status === 'success' ? 'success' : 'default'
              }
              icon={job.status === 'running' ? <CircularProgress size={12} /> : undefined}
              label={job.message ?? id}
            />
          ))}
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
        >
          <Select
            size="small"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            sx={{ minWidth: 78 }}
          >
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="ru">RU</MenuItem>
          </Select>
          <ThemeToggle />
          <FileUploadButton />
          <Button
            variant="outlined"
            startIcon={<AutoAwesomeOutlinedIcon />}
            onClick={onAutoInsight}
          >
            {t.topnav.autoInsight}
          </Button>
          <Button
            variant="outlined"
            startIcon={<WorkspacesOutlinedIcon />}
            onClick={openWorkspaceMenu}
          >
            {t.topnav.workspace}
          </Button>
          <Button
            variant="outlined"
            startIcon={<FolderOpenOutlinedIcon />}
            onClick={openBookmarksMenu}
          >
            {t.topnav.bookmarks}
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={openExportMenu}
          >
            {t.topnav.export}
          </Button>
          <Button
            variant="outlined"
            startIcon={<MenuBookOutlinedIcon />}
            onClick={() => setGuideOpen(true)}
          >
            {t.topnav.guide}
          </Button>
        </Stack>
      </Toolbar>
      <WorkspaceMenu
        anchorEl={workspaceAnchorEl}
        open={workspaceMenuOpen}
        onClose={closeWorkspaceMenu}
        canUndo={canUndo}
        canRedo={canRedo}
        labels={{
          loadDashboard: t.topnav.loadDashboard,
          saveDashboard: t.topnav.saveDashboard,
          undo: t.topnav.undo,
          redo: t.topnav.redo,
          resetWorkspace: t.topnav.resetWorkspace,
          publishSnapshot: t.topnav.publishSnapshot,
        }}
        onLoad={onLoad}
        onSave={onSave}
        onUndo={onUndo}
        onRedo={onRedo}
        onReset={onReset}
        onPublishSnapshot={() => {
          void onPublishSnapshot();
        }}
      />
      <BookmarksMenu
        anchorEl={bookmarksAnchorEl}
        open={bookmarksMenuOpen}
        onClose={closeBookmarksMenu}
        bookmarks={bookmarks}
        labels={{
          saveCurrentView: t.topnav.saveCurrentView,
          noBookmarksYet: t.topnav.noBookmarksYet,
        }}
        removeBookmarkLabel={(bookmarkName) =>
          ru ? `Удалить "${bookmarkName}"` : `Remove "${bookmarkName}"`
        }
        onSaveBookmark={onSaveBookmark}
        onLoadBookmark={onLoadBookmark}
        onDeleteBookmark={onDeleteBookmark}
      />
      <ExportMenu
        anchorEl={exportAnchorEl}
        open={exportMenuOpen}
        onClose={closeExportMenu}
        labels={{
          filteredCsv: t.topnav.filteredCsv,
          dashboardJson: t.topnav.dashboardJson,
          pngImage: t.topnav.pngImage,
          pdfViaPrint: t.topnav.pdfViaPrint,
        }}
        tooltips={{
          csv: ru ? 'Экспорт отфильтрованных строк в CSV' : 'Export filtered rows as CSV',
          json: ru ? 'Экспорт состояния дашборда в JSON' : 'Export dashboard state as JSON',
          png: ru ? 'Экспорт дашборда как PNG' : 'Export dashboard as PNG image',
          pdf: ru ? 'Открыть окно печати и сохранить как PDF' : 'Open print dialog and save to PDF',
        }}
        onExportCsv={onExportCsv}
        onExportConfig={onExportConfig}
        onExportPng={() => {
          void onExportPng();
        }}
        onExportPdf={onExportPdf}
      />
      <GuideDialog
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        ru={ru}
        title={t.topnav.guideTitle}
      />
      <Box className="gpv2-topnav-border" />
    </AppBar>
  );
}
