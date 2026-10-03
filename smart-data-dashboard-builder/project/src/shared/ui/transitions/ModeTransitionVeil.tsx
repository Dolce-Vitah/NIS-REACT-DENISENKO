import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

const MotionBox = motion(Box);

type Props = { transitionKey: string };

export function ModeTransitionVeil({ transitionKey }: Props) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionBox
        key={transitionKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16, ease: 'linear' }}
        sx={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          backdropFilter: 'none',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          borderRadius: 'inherit',
        }}
      />
    </AnimatePresence>
  );
}