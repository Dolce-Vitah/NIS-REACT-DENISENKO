import { Button } from '@mui/material';
import { type ChangeEvent } from 'react';
import { importDataFromFile } from '../model/importData';
import { useDataStore } from '../../../store/dataStore';
import { useUiStore } from '../../../store/uiStore';

export function FileUploadButton() {
  const setLoading = useDataStore((s) => s.setLoading);
  const setData = useDataStore((s) => s.setData);
  const setError = useDataStore((s) => s.setError);

  const showNotification = useUiStore((s) => s.showNotification);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading();
      const { rows, schema } = await importDataFromFile(file);
      setData(rows, schema);
      showNotification('success', `Loaded ${rows.length} rows from ${file.name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Import failed.';
      setError(message);
      showNotification('error', message);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <Button variant="outlined" component="label">
      Upload Data
      <input hidden type="file" accept=".csv,.json,application/json,text/csv" onChange={handleChange} />
    </Button>
  );
}