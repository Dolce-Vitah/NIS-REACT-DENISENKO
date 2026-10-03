import { Box } from '@mui/material';
import { LeftSidebar } from '../LeftSidebar';

export function LeftDock() {
  return (
    <Box className="gpv2-glass-panel" sx={{ p: 1.25 }}>
      <LeftSidebar />
    </Box>
  );
}
