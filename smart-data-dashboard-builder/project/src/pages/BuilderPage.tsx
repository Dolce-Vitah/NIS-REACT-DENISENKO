import { Box } from '@mui/material';
import { TopNav } from '../shared/ui/navigation/TopNav';
import { ContextBar } from '../shared/ui/navigation/ContextBar';
import { LeftDock } from '../shared/ui/panels/LeftDock';
import { SceneCanvas } from '../shared/ui/canvas/SceneCanvas';
import { RightInspector } from '../shared/ui/panels/RightInspector';
import { ModeTransitionVeil } from '../shared/ui/transitions/ModeTransitionVeil';
import { useLayoutUiStore } from '../store/layoutUiStore';

export function BuilderPage() {
  const workspaceMode = useLayoutUiStore((s) => s.workspaceMode);
  const leftCollapsed = useLayoutUiStore((s) => s.leftCollapsed);
  const rightCollapsed = useLayoutUiStore((s) => s.rightCollapsed);

  const showLeft = !leftCollapsed && workspaceMode === 'build';
  const showRight = !rightCollapsed && workspaceMode !== 'present';

  return (
    <Box className={`gpv2-shell mode-${workspaceMode}`}>
      <TopNav />
      <ContextBar />

      <Box className="gpv2-main">
        {showLeft && (
          <Box className="gpv2-left">
            <LeftDock />
          </Box>
        )}

        <Box className="gpv2-center">
          <SceneCanvas />
          <ModeTransitionVeil transitionKey={workspaceMode} />
        </Box>

        {showRight && (
          <Box className="gpv2-right">
            <RightInspector />
          </Box>
        )}
      </Box>
    </Box>
  );
}