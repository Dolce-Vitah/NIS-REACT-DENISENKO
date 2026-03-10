import { Box, Drawer, Fab, useMediaQuery } from '@mui/material';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { TopNav } from '../shared/ui/navigation/TopNav';
import { ContextBar } from '../shared/ui/navigation/ContextBar';
import { LeftDock } from '../shared/ui/panels/LeftDock';
import { SceneCanvas } from '../shared/ui/canvas/SceneCanvas';
import { RightInspector } from '../shared/ui/panels/RightInspector';
import { ModeTransitionVeil } from '../shared/ui/transitions/ModeTransitionVeil';
import { useLayoutUiStore } from '../store/layoutUiStore';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

export function BuilderPage() {
  const theme = useTheme();
  const location = useLocation();
  const isCompact = useMediaQuery(theme.breakpoints.down('lg'));
  const workspaceMode = useLayoutUiStore((s) => s.workspaceMode);
  const setWorkspaceMode = useLayoutUiStore((s) => s.setWorkspaceMode);
  const leftCollapsed = useLayoutUiStore((s) => s.leftCollapsed);
  const rightCollapsed = useLayoutUiStore((s) => s.rightCollapsed);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  const showLeft = !leftCollapsed && workspaceMode === 'build';
  const showRight = !rightCollapsed && (workspaceMode === 'build' || workspaceMode === 'analyze');

  useEffect(() => {
    if (location.pathname === '/discover' && workspaceMode !== 'discover') {
      setWorkspaceMode('discover');
      return;
    }
    if (location.pathname === '/dashboard' && workspaceMode === 'discover') {
      setWorkspaceMode('build');
    }
  }, [location.pathname, setWorkspaceMode, workspaceMode]);

  return (
    <Box className={`gpv2-shell mode-${workspaceMode}`}>
      <TopNav />
      <ContextBar />

      <Box className="gpv2-main">
        {!isCompact && showLeft && (
          <Box className="gpv2-left">
            <LeftDock />
          </Box>
        )}

        <Box className="gpv2-center">
          <SceneCanvas />
          <ModeTransitionVeil transitionKey={workspaceMode} />
        </Box>

        {!isCompact && showRight && (
          <Box className="gpv2-right">
            <RightInspector />
          </Box>
        )}
      </Box>
      {isCompact && showLeft && (
        <Fab
          size="small"
          color="primary"
          sx={{ position: 'fixed', left: 18, bottom: 18, zIndex: 1400 }}
          onClick={() => setLeftDrawerOpen(true)}
          aria-label="Open widgets panel"
        >
          <MenuOpenOutlinedIcon fontSize="small" />
        </Fab>
      )}
      {isCompact && showRight && (
        <Fab
          size="small"
          color="primary"
          sx={{ position: 'fixed', right: 18, bottom: 18, zIndex: 1400 }}
          onClick={() => setRightDrawerOpen(true)}
          aria-label="Open inspector panel"
        >
          <TuneOutlinedIcon fontSize="small" />
        </Fab>
      )}

      <Drawer anchor="left" open={leftDrawerOpen} onClose={() => setLeftDrawerOpen(false)}>
        <Box sx={{ width: 320, p: 1.5 }}>
          <LeftDock />
        </Box>
      </Drawer>

      <Drawer anchor="right" open={rightDrawerOpen} onClose={() => setRightDrawerOpen(false)}>
        <Box sx={{ width: 360, p: 1.5 }}>
          <RightInspector />
        </Box>
      </Drawer>
    </Box>
  );
}
