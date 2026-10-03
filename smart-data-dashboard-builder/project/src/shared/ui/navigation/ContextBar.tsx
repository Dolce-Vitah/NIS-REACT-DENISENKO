import { Box, Stack, Typography, ToggleButton, ToggleButtonGroup, Tooltip, Chip } from '@mui/material';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import { useLayoutUiStore, type WorkspaceMode } from '../../../store/layoutUiStore';

export function ContextBar() {
  const workspaceMode = useLayoutUiStore((s) => s.workspaceMode);
  const setWorkspaceMode = useLayoutUiStore((s) => s.setWorkspaceMode);

  const onMode = (_: unknown, next: WorkspaceMode | null) => {
    if (!next) return;
    setWorkspaceMode(next);
  };

  const modeLabel =
    workspaceMode === 'build' ? 'Build mode' :
      workspaceMode === 'analyze' ? 'Analyze mode' :
        'Present mode';

  return (
    <Box className="gpv2-contextbar">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
            Dashboard Studio
          </Typography>
          <Chip size="small" color="primary" label={modeLabel} />
        </Stack>

        <ToggleButtonGroup size="small" exclusive value={workspaceMode} onChange={onMode}>
          <Tooltip title="Build: widget library + canvas + inspector">
            <ToggleButton value="build" aria-label="Build mode">
              <ConstructionOutlinedIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>

          <Tooltip title="Analyze: canvas + inspector">
            <ToggleButton value="analyze" aria-label="Analyze mode">
              <AnalyticsOutlinedIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>

          <Tooltip title="Present: only canvas">
            <ToggleButton value="present" aria-label="Present mode">
              <SlideshowOutlinedIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Stack>
    </Box>
  );
}
