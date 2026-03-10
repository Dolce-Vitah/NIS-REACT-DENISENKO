import { Box } from '@mui/material';
import { RightSidebar } from '../RightSidebar';

export function RightInspector() {
  return (
    <Box className="gpv2-glass-panel" sx={{ p: 1, minHeight: 0, overflow: 'hidden' }}>
      <RightSidebar />
    </Box>
  );
}
