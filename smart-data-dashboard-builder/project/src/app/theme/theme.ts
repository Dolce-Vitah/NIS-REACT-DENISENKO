import { alpha, createTheme, type PaletteMode } from '@mui/material/styles';
import type { ChartPalette } from '../../store/uiStore';

type ThemeTuningOptions = {
  density?: 'compact' | 'comfortable';
  glassBlur?: number;
  cornerRadius?: number;
  reducedMotion?: boolean;
  surfaceIntensity?: number;
  borderContrast?: number;
  shadowDepth?: number;
  chartPalette?: ChartPalette;
};

const chartPaletteTokens: Record<
  ChartPalette,
  {
    line: string;
    track: string;
    pie: [string, string, string, string, string, string];
  }
> = {
  indigo: {
    line: '#667eea',
    track: '#dfe6ff',
    pie: ['#667eea', '#7c4dff', '#ff7043', '#26a69a', '#ab47bc', '#ec407a'],
  },
  emerald: {
    line: '#16a34a',
    track: '#d5f5dd',
    pie: ['#16a34a', '#22c55e', '#0ea5e9', '#14b8a6', '#f59e0b', '#84cc16'],
  },
  sunset: {
    line: '#f97316',
    track: '#ffe5d0',
    pie: ['#f97316', '#ef4444', '#f59e0b', '#eab308', '#fb7185', '#a855f7'],
  },
  mono: {
    line: '#64748b',
    track: '#e2e8f0',
    pie: ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'],
  },
};

const light = {
  bgBase: '#f4f7f6',
  bgGradient:
    'radial-gradient(at 0% 0%, rgb(224, 195, 252) 0px, transparent 50%), radial-gradient(at 100% 100%, rgb(142, 197, 252) 0px, transparent 50%), radial-gradient(at 100% 0%, rgb(255, 209, 255) 0px, transparent 50%), radial-gradient(at 0% 100%, rgb(185, 251, 192) 0px, transparent 50%), #f8faff',
  bgElevated: 'rgba(255, 255, 255, 0.4)',
  surfaceSubtle: 'rgba(255, 255, 255, 0.2)',
  borderDefault: 'rgba(255, 255, 255, 0.3)',
  borderHighlight: 'rgba(255, 255, 255, 0.8)',
  textPrimary: '#1a1a2e',
  textSecondary: '#5a5a7a',
  accentPrimary: '#667eea',
  accentSoft: 'rgba(102, 126, 234, 0.15)',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  glassShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
};

const dark = {
  bgBase: '#0b0f19',
  bgGradient:
    'radial-gradient(at 0% 0%, rgb(15, 32, 39) 0px, transparent 50%), radial-gradient(at 100% 100%, rgb(44, 83, 100) 0px, transparent 50%), radial-gradient(at 100% 0%, rgb(32, 58, 67) 0px, transparent 50%), #0b0f19',
  bgElevated: 'rgba(15, 23, 29, 0.4)',
  surfaceSubtle: 'rgba(255, 255, 255, 0.05)',
  borderDefault: 'rgba(255, 255, 255, 0.08)',
  borderHighlight: 'rgba(255, 255, 255, 0.15)',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  accentPrimary: '#818cf8',
  accentSoft: 'rgba(129, 140, 248, 0.15)',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  glassShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
};

export function buildAppTheme(mode: PaletteMode, options: ThemeTuningOptions = {}) {
  const isDark = mode === 'dark';
  const c = isDark ? dark : light;
  const surfaceIntensity = options.surfaceIntensity ?? 60;
  const borderContrast = options.borderContrast ?? 50;
  const shadowDepth = options.shadowDepth ?? 55;
  const chartPalette = chartPaletteTokens[options.chartPalette ?? 'indigo'];
  const blur = options.glassBlur ?? 20;
  const radius = options.cornerRadius ?? 20;
  const reducedMotion = options.reducedMotion ?? false;
  const isCompact = options.density === 'compact';
  const surfaceBase = isDark ? '#0f1720' : '#ffffff';
  const panelAlpha = 0.16 + (surfaceIntensity / 100) * 0.58;
  const subtleAlpha = 0.05 + (surfaceIntensity / 100) * 0.3;
  const borderAlpha = 0.08 + (borderContrast / 100) * 0.34;
  const borderHighlightAlpha = 0.2 + (borderContrast / 100) * 0.58;
  const bgElevated = alpha(surfaceBase, panelAlpha);
  const surfaceSubtle = alpha(surfaceBase, subtleAlpha);
  const borderDefault = alpha(isDark ? '#ffffff' : '#334155', borderAlpha);
  const borderHighlight = alpha('#ffffff', borderHighlightAlpha);
  const shadowAlpha = 0.1 + (shadowDepth / 100) * 0.28;
  const glassShadow = isDark
    ? `0 8px 32px 0 ${alpha('#000000', shadowAlpha + 0.08)}`
    : `0 8px 32px 0 ${alpha('#1f2687', shadowAlpha)}`;

  return createTheme({
    palette: {
      mode,
      primary: { main: c.accentPrimary, contrastText: '#FFFFFF' },
      secondary: { main: '#a8b8d0', contrastText: c.textPrimary },
      success: { main: c.success },
      error: { main: c.danger },
      warning: { main: c.warning },
      background: {
        default: c.bgBase,
        paper: bgElevated,
      },
      text: {
        primary: c.textPrimary,
        secondary: c.textSecondary,
      },
      divider: borderDefault,
    },
    shape: { borderRadius: Math.max(8, radius - 4) },
    spacing: 4,
    transitions: {
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
    typography: {
      fontFamily: `'Inter', 'Helvetica Neue', Arial, sans-serif`,
      h1: { fontSize: 32, lineHeight: 1.2, fontWeight: 700 },
      h2: { fontSize: 24, lineHeight: 1.2, fontWeight: 700 },
      h3: { fontSize: 20, lineHeight: 1.3, fontWeight: 600 },
      h4: { fontSize: 18, lineHeight: 1.3, fontWeight: 600 },
      h5: { fontSize: 16, lineHeight: 1.4, fontWeight: 600 },
      h6: { fontSize: 16, lineHeight: 1.4, fontWeight: 600 },
      body1: { fontSize: isCompact ? 14 : 15, lineHeight: 1.5, fontWeight: 400 },
      body2: { fontSize: isCompact ? 13 : 14, lineHeight: 1.5, fontWeight: 400 },
      subtitle1: { fontSize: 15, lineHeight: 1.5, fontWeight: 500 },
      subtitle2: { fontSize: 13, lineHeight: 1.5, fontWeight: 500 },
      caption: { fontSize: 12, lineHeight: 1.4, fontWeight: 500 },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: '0.02em',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: c.bgBase,
            background: c.bgGradient,
            backgroundAttachment: 'fixed',
            color: c.textPrimary,
            letterSpacing: '0em',
            '--gpv2-border': `1px solid ${borderDefault}`,
            '--gpv2-border-highlight': `1px solid ${borderHighlight}`,
            '--gpv2-panel-bg': bgElevated,
            '--gpv2-scene-bg': 'transparent',
            '--gpv2-topnav-bg': surfaceSubtle,
            '--gpv2-context-bg': surfaceSubtle,
            '--gpv2-shadow': glassShadow,
            '--gpv2-shadow-heavy': isDark
              ? `0 16px 40px 0 ${alpha('#000000', shadowAlpha + 0.14)}`
              : `0 16px 40px 0 ${alpha('#1f2687', shadowAlpha + 0.04)}`,
            '--gpv2-widget-active-shadow': isDark
              ? `0 12px 28px ${alpha('#0ea5e9', 0.2 + shadowDepth / 400)}`
              : `0 12px 28px ${alpha('#6d5efc', 0.18 + shadowDepth / 420)}`,
            '--gpv2-glass-blur': `${blur}px`,
            '--gpv2-corner-radius': `${radius}px`,
            '--gpv2-fab-bg': c.accentPrimary,
            '--gpv2-chart-track': isDark ? alpha('#94a3b8', 0.26) : chartPalette.track,
            '--gpv2-chart-line': chartPalette.line,
            '--gpv2-chart-pie-1': chartPalette.pie[0],
            '--gpv2-chart-pie-2': chartPalette.pie[1],
            '--gpv2-chart-pie-3': chartPalette.pie[2],
            '--gpv2-chart-pie-4': chartPalette.pie[3],
            '--gpv2-chart-pie-5': chartPalette.pie[4],
            '--gpv2-chart-pie-6': chartPalette.pie[5],
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            border: `1px solid ${borderDefault}`,
            borderTop: `1px solid ${borderHighlight}`,
            borderLeft: `1px solid ${borderHighlight}`,
            backgroundColor: bgElevated,
            backgroundImage: 'none',
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: glassShadow,
            borderRadius: radius,
            transition: reducedMotion ? 'none' : 'all 0.3s ease',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${borderDefault}`,
            borderTop: `1px solid ${borderHighlight}`,
            borderLeft: `1px solid ${borderHighlight}`,
            backgroundColor: bgElevated,
            backgroundImage: 'none',
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: glassShadow,
            borderRadius: radius,
            transition: reducedMotion ? 'none' : 'all 0.3s ease',
            '&:hover': {
              transform: reducedMotion ? 'none' : 'translateY(-4px)',
              boxShadow: `0 16px 40px 0 ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(31,38,135,0.15)'}`,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            paddingInline: 20,
            textTransform: 'none',
            boxShadow: 'none',
            transition: reducedMotion ? 'none' : 'all 0.2s ease',
            fontWeight: 600,
            '&:hover': {
              transform: reducedMotion ? 'none' : 'translateY(-2px)',
              boxShadow: '0 8px 20px 0 rgba(0,0,0,0.1)',
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: 'none',
            },
          },
          outlined: {
            borderColor: borderDefault,
            backgroundColor: surfaceSubtle,
            backdropFilter: 'blur(8px)',
            '&:hover': {
              backgroundColor: bgElevated,
              borderColor: borderDefault,
            },
          },
          contained: {
            backgroundColor: c.accentPrimary,
            color: '#ffffff',
            boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
            '&:hover': {
              backgroundColor: c.accentPrimary,
              boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.6)',
            },
          },
          text: {
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: c.surfaceSubtle,
              transform: 'none',
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 40,
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 12,
            color: c.textSecondary,
            transition: 'all 0.2s ease',
            margin: '0 4px',
            '&:hover': {
              backgroundColor: c.surfaceSubtle,
            },
            '&.Mui-selected': {
              color: c.textPrimary,
              backgroundColor: bgElevated,
              boxShadow: glassShadow,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            display: 'none',
          },
          flexContainer: {
            padding: '4px',
            backgroundColor: surfaceSubtle,
            borderRadius: 16,
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: surfaceSubtle,
            border: `1px solid ${borderDefault}`,
            backdropFilter: 'blur(8px)',
            color: c.textPrimary,
            fontWeight: 600,
            textTransform: 'none',
          },
          colorPrimary: {
            backgroundColor: c.accentPrimary,
            color: '#fff',
          },
          sizeSmall: {
            height: 28,
            fontSize: 12,
          },
        },
      },
    },
  });
}
