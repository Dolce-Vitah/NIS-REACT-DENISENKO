import { Box } from '@mui/material';
import { Header } from '../shared/ui/Header';
import { LeftSidebar } from '../shared/ui/LeftSidebar';
import { RightSidebar } from '../shared/ui/RightSidebar';
import { Canvas } from '../shared/ui/Canvas';

export function BuilderPage() {
  return (
    <Box className="app-shell">
      <Header />
      <Box className="app-main">
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </Box>
    </Box>
  );
}