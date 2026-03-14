import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import RedoOutlinedIcon from '@mui/icons-material/RedoOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { Divider, Menu, MenuItem } from '@mui/material';

type WorkspaceMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  canUndo: boolean;
  canRedo: boolean;
  labels: {
    loadDashboard: string;
    saveDashboard: string;
    undo: string;
    redo: string;
    resetWorkspace: string;
    publishSnapshot: string;
  };
  onLoad: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onPublishSnapshot: () => void;
};

export function WorkspaceMenu({
  anchorEl,
  open,
  onClose,
  canUndo,
  canRedo,
  labels,
  onLoad,
  onSave,
  onUndo,
  onRedo,
  onReset,
  onPublishSnapshot,
}: WorkspaceMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <MenuItem
        onClick={() => {
          onClose();
          onLoad();
        }}
      >
        <DownloadDoneOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        {labels.loadDashboard}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClose();
          onSave();
        }}
      >
        <SaveOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        {labels.saveDashboard}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClose();
          onUndo();
        }}
        disabled={!canUndo}
      >
        <UndoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        {labels.undo}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClose();
          onRedo();
        }}
        disabled={!canRedo}
      >
        <RedoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        {labels.redo}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClose();
          onReset();
        }}
        sx={{ color: 'error.main' }}
      >
        <RestartAltOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        {labels.resetWorkspace}
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          onClose();
          onPublishSnapshot();
        }}
      >
        <PublishOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        {labels.publishSnapshot}
      </MenuItem>
    </Menu>
  );
}
