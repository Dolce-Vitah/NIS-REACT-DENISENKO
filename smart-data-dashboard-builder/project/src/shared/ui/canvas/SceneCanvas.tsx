import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '../Canvas';
import { useLayoutUiStore } from '../../../store/layoutUiStore';

const MotionBox = motion(Box);

export function SceneCanvas() {
  const mode = useLayoutUiStore((s) => s.workspaceMode);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionBox
        key={mode}
        className="gpv2-scene-wrap"
        initial={{ opacity: 0.92 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.92 }}
        transition={{ duration: 0.16, ease: 'linear' }}
      >
        <Canvas />
      </MotionBox>
    </AnimatePresence>
  );
}
