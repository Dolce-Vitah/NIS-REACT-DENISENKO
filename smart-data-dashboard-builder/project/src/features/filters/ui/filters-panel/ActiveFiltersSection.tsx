import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import type { GlobalFilter } from '../../../../store/filtersStore';
import { useI18n } from '../../../../shared/i18n/useI18n';
import { formatActiveFilterRowLabel } from './formatters';
import type { PanelMode } from './types';

type ActiveFiltersSectionProps = {
  mode: PanelMode;
  filters: GlobalFilter[];
  pinnedFields: string[];
  onTogglePin: (field: string) => void;
  onRemove: (field: string) => void;
};

export function ActiveFiltersSection({
  mode,
  filters,
  pinnedFields,
  onTogglePin,
  onRemove,
}: ActiveFiltersSectionProps) {
  const { t } = useI18n();

  return (
    <Box>
      <Typography variant="subtitle2" mb={1}>
        {t.filtersPanel.activeFilters}
      </Typography>
      <Stack spacing={1}>
        {filters.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            {t.filtersPanel.noActiveFiltersDot}
          </Typography>
        )}
        {filters.map((filter) => (
          <Stack
            key={filter.field}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="caption">{formatActiveFilterRowLabel(filter)}</Typography>
            <Stack direction="row" spacing={0.5}>
              {mode === 'advanced' && (
                <IconButton size="small" onClick={() => onTogglePin(filter.field)}>
                  {pinnedFields.includes(filter.field) ? (
                    <PushPinIcon fontSize="inherit" />
                  ) : (
                    <PushPinOutlinedIcon fontSize="inherit" />
                  )}
                </IconButton>
              )}
              <Button size="small" color="error" onClick={() => onRemove(filter.field)}>
                {t.filtersPanel.remove}
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
