import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppThemeMode = 'light' | 'dark';
export type UiDensity = 'compact' | 'comfortable';
export type ChartPalette = 'indigo' | 'emerald' | 'sunset' | 'mono';

type UiState = {
  themeMode: AppThemeMode;
  density: UiDensity;
  glassBlur: number;
  cornerRadius: number;
  reducedMotion: boolean;
  surfaceIntensity: number;
  borderContrast: number;
  shadowDepth: number;
  chartPalette: ChartPalette;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;

  setThemeMode: (mode: AppThemeMode) => void;
  toggleDarkMode: () => void;
  setDensity: (density: UiDensity) => void;
  setGlassBlur: (value: number) => void;
  setCornerRadius: (value: number) => void;
  setReducedMotion: (value: boolean) => void;
  setSurfaceIntensity: (value: number) => void;
  setBorderContrast: (value: number) => void;
  setShadowDepth: (value: number) => void;
  setChartPalette: (value: ChartPalette) => void;

  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  clearNotification: () => void;
};

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      themeMode: 'light',
      density: 'comfortable',
      glassBlur: 20,
      cornerRadius: 20,
      reducedMotion: false,
      surfaceIntensity: 60,
      borderContrast: 50,
      shadowDepth: 55,
      chartPalette: 'indigo',
      notification: null,

      setThemeMode: (mode) => set({ themeMode: mode }),
      toggleDarkMode: () => set({ themeMode: get().themeMode === 'dark' ? 'light' : 'dark' }),
      setDensity: (density) => set({ density }),
      setGlassBlur: (value) => set({ glassBlur: value }),
      setCornerRadius: (value) => set({ cornerRadius: value }),
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setSurfaceIntensity: (value) => set({ surfaceIntensity: value }),
      setBorderContrast: (value) => set({ borderContrast: value }),
      setShadowDepth: (value) => set({ shadowDepth: value }),
      setChartPalette: (value) => set({ chartPalette: value }),

      showNotification: (type, message) => set({ notification: { type, message } }),
      clearNotification: () => set({ notification: null }),
    }),
    {
      name: 'ui-store-v2',
      version: 2,
      partialize: (state) => ({
        themeMode: state.themeMode,
        density: state.density,
        glassBlur: state.glassBlur,
        cornerRadius: state.cornerRadius,
        reducedMotion: state.reducedMotion,
        surfaceIntensity: state.surfaceIntensity,
        borderContrast: state.borderContrast,
        shadowDepth: state.shadowDepth,
        chartPalette: state.chartPalette,
      }),
    }
  )
);
