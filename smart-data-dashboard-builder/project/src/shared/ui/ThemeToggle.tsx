import { Box, IconButton, Tooltip } from '@mui/material';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useUiStore } from '../../store/uiStore';

export function ThemeToggle() {
  const mode = useUiStore((s) => s.themeMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);
  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to light' : 'Switch to dark'}>
      <IconButton
        onClick={toggleDarkMode}
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: isDark ? 'rgba(109,94,252,.20)' : 'rgba(109,94,252,.08)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            display: 'grid',
            placeItems: 'center',
            transform: isDark ? 'translateY(14px) scale(.6) rotate(-20deg)' : 'translateY(0) scale(1)',
            opacity: isDark ? 0 : 1,
            transition: 'all .3s ease',
          }}
        >
          <LightModeRoundedIcon fontSize="small" />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            display: 'grid',
            placeItems: 'center',
            transform: isDark ? 'translateY(0) scale(1)' : 'translateY(-14px) scale(.6) rotate(20deg)',
            opacity: isDark ? 1 : 0,
            transition: 'all .3s ease',
          }}
        >
          <DarkModeRoundedIcon fontSize="small" />
        </Box>
      </IconButton>
    </Tooltip>
  );
}