import { createTheme, type PaletteMode } from '@mui/material/styles';

const light = {
  bgBase: '#F5F7FB',
  bgElevated: '#FFFFFF',
  surfaceSubtle: '#F1F4FA',
  borderDefault: '#D9E1EE',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  accentPrimary: '#2563EB',
  accentSoft: '#DBEAFE',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
};

const dark = {
  bgBase: '#0B1020',
  bgElevated: '#121A2B',
  surfaceSubtle: '#182236',
  borderDefault: '#2B3A55',
  textPrimary: '#E6EDF8',
  textSecondary: '#9FB0CA',
  accentPrimary: '#60A5FA',
  accentSoft: '#1E3A8A',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
};

export function buildAppTheme(mode: PaletteMode) {
  const isDark = mode === 'dark';
  const c = isDark ? dark : light;

  return createTheme({
    palette: {
      mode,
      primary: { main: c.accentPrimary, light: c.accentSoft },
      secondary: { main: c.surfaceSubtle },
      success: { main: c.success },
      error: { main: c.danger },
      warning: { main: c.warning },
      background: {
        default: c.bgBase,
        paper: c.bgElevated,
      },
      text: {
        primary: c.textPrimary,
        secondary: c.textSecondary,
      },
      divider: c.borderDefault,
    },
    shape: { borderRadius: 12 },
    spacing: 4,
    transitions: {
      easing: {
        easeInOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
        easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
        easeIn: 'cubic-bezier(0.22, 1, 0.36, 1)',
        sharp: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      duration: {
        shortest: 120,
        shorter: 120,
        short: 180,
        standard: 180,
        complex: 240,
        enteringScreen: 240,
        leavingScreen: 180,
      },
    },
    typography: {
      fontFamily: `'Manrope', 'Inter', 'Segoe UI', sans-serif`,
      h1: { fontSize: 32, lineHeight: 40 / 32, fontWeight: 700 },
      h2: { fontSize: 24, lineHeight: 32 / 24, fontWeight: 700 },
      h3: { fontSize: 20, lineHeight: 28 / 20, fontWeight: 650 },
      h4: { fontSize: 16, lineHeight: 24 / 16, fontWeight: 650 },
      h5: { fontSize: 16, lineHeight: 24 / 16, fontWeight: 650 },
      h6: { fontSize: 16, lineHeight: 24 / 16, fontWeight: 650 },
      body1: { fontSize: 14, lineHeight: 22 / 14, fontWeight: 500 },
      body2: { fontSize: 14, lineHeight: 22 / 14, fontWeight: 500 },
      subtitle1: { fontSize: 14, lineHeight: 22 / 14, fontWeight: 500 },
      subtitle2: { fontSize: 12, lineHeight: 18 / 12, fontWeight: 600 },
      caption: { fontSize: 12, lineHeight: 18 / 12, fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: c.bgBase,
            color: c.textPrimary,
            '--gpv2-border': `1px solid ${c.borderDefault}`,
            '--gpv2-panel-bg': isDark ? 'rgba(18, 26, 43, 0.72)' : 'rgba(255, 255, 255, 0.48)',
            '--gpv2-scene-bg': isDark ? 'rgba(11, 16, 32, 0.50)' : 'rgba(255, 255, 255, 0.35)',
            '--gpv2-topnav-bg': isDark ? 'rgba(18, 26, 43, 0.72)' : 'rgba(255, 255, 255, 0.62)',
            '--gpv2-context-bg': isDark ? 'rgba(18, 26, 43, 0.50)' : 'rgba(255, 255, 255, 0.5)',
            '--gpv2-shadow': isDark ? '0 12px 30px rgba(0, 0, 0, 0.4)' : '0 12px 30px rgba(17, 24, 39, 0.1)',
            '--gpv2-shadow-heavy': isDark ? '0 14px 34px rgba(0, 0, 0, 0.45)' : '0 14px 34px rgba(17, 24, 39, 0.1)',
            '--gpv2-fab-bg': isDark ? 'rgba(18, 26, 43, 0.85)' : 'rgba(255, 255, 255, 0.72)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            border: `1px solid ${c.borderDefault}`,
            backgroundColor: c.bgElevated,
            backgroundImage: 'none',
            backdropFilter: 'none',
            boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(15,23,42,0.04)',
            borderRadius: 12,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${c.borderDefault}`,
            backgroundColor: c.bgElevated,
            backgroundImage: 'none',
            backdropFilter: 'none',
            boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(15,23,42,0.04)',
            borderRadius: 16,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            paddingInline: 16,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 40,
            textTransform: 'none',
            fontWeight: 650,
            borderRadius: 8,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });
}
