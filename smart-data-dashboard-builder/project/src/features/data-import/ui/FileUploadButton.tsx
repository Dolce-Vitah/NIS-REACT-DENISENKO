import { Button } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { type ChangeEvent } from 'react';
import { importDataFromFile } from '../model/importData';
import { useDataStore } from '../../../store/dataStore';
import { useUiStore } from '../../../store/uiStore';
import { useDashboardStore } from '../../../store/dashboardStore';
import { generateStarterDashboard } from '../../insights/lib/starterDashboard';
import { useJobsStore } from '../../../store/jobsStore';
import { useI18n } from '../../../shared/i18n/useI18n';

export function FileUploadButton() {
  const setLoading = useDataStore((s) => s.setLoading);
  const setData = useDataStore((s) => s.setData);
  const setError = useDataStore((s) => s.setError);
  const showNotification = useUiStore((s) => s.showNotification);
  const widgetsCount = useDashboardStore((s) => s.widgets.length);
  const setDashboardState = useDashboardStore((s) => s.setDashboardState);
  const setJobRunning = useJobsStore((s) => s.setRunning);
  const setJobSuccess = useJobsStore((s) => s.setSuccess);
  const setJobError = useJobsStore((s) => s.setError);
  const clearJob = useJobsStore((s) => s.clearJob);
  const { language } = useI18n();
  const ru = language === 'ru';

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setJobRunning('import', ru ? `Импорт ${file.name}...` : `Importing ${file.name}...`);
      setLoading();
      const { rows, schema } = await importDataFromFile(file);
      setData(rows, schema);

      // Auto-bootstrap a meaningful first dashboard for faster time-to-insight.
      if (widgetsCount === 0) {
        const starter = generateStarterDashboard(rows, schema);
        if (starter) {
          setDashboardState(starter);
        }
      }

      showNotification(
        'success',
        ru
          ? `Загружено ${rows.length} строк из ${file.name}`
          : `Loaded ${rows.length} rows from ${file.name}`
      );
      setJobSuccess('import', ru ? `Загружено ${rows.length} строк` : `${rows.length} rows loaded`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : ru ? 'Ошибка импорта.' : 'Import failed.';
      setError(message);
      showNotification('error', message);
      setJobError('import', message);
    } finally {
      e.target.value = '';
      window.setTimeout(() => clearJob('import'), 2500);
    }
  };

  return (
    <Button variant="outlined" component="label" startIcon={<CloudUploadOutlinedIcon />}>
      {ru ? 'Загрузить' : 'Upload'}
      <input
        hidden
        type="file"
        accept=".csv,.json,application/json,text/csv"
        onChange={(event) => {
          void handleChange(event);
        }}
      />
    </Button>
  );
}
