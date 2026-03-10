import { Autocomplete, Box, Button, Stack, TextField, Typography } from '@mui/material';
import type { GlobalFilter, SavedFilterSet } from '../../../../store/filtersStore';
import { useI18n } from '../../../../shared/i18n/useI18n';

type SavedFilterSetsSectionProps = {
  setName: string;
  setSetName: (value: string) => void;
  filters: GlobalFilter[];
  savedSets: SavedFilterSet[];
  onSave: () => void;
  onApply: (setId: string) => void;
  onRemove: (setId: string) => void;
};

export function SavedFilterSetsSection({
  setName,
  setSetName,
  filters,
  savedSets,
  onSave,
  onApply,
  onRemove,
}: SavedFilterSetsSectionProps) {
  const { t } = useI18n();

  return (
    <Box>
      <Typography variant="subtitle2" mb={1}>
        {t.filtersPanel.savedSets}
      </Typography>
      <Stack spacing={1}>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            fullWidth
            label={t.filtersPanel.setName}
            value={setName}
            onChange={(event) => setSetName(event.target.value)}
          />
          <Button
            variant="outlined"
            disabled={!setName.trim() || filters.length === 0}
            onClick={onSave}
          >
            {t.filtersPanel.save}
          </Button>
        </Stack>
        <Autocomplete
          size="small"
          options={savedSets}
          getOptionLabel={(option) => option.name}
          onChange={(_event, option) => {
            if (!option) return;
            onApply(option.id);
          }}
          renderInput={(params) => <TextField {...params} label={t.filtersPanel.applySavedSet} />}
        />
        {savedSets.map((saved) => (
          <Stack key={saved.id} direction="row" justifyContent="space-between">
            <Typography variant="caption">{saved.name}</Typography>
            <Button size="small" color="error" onClick={() => onRemove(saved.id)}>
              {t.filtersPanel.remove}
            </Button>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
