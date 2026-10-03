import { create } from 'zustand';

export type AppThemeMode = 'light' | 'dark';

type UiState = {
  themeMode: AppThemeMode;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;

  setThemeMode: (mode: AppThemeMode) => void;
  toggleDarkMode: () => void;

  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  clearNotification: () => void;
};

export const useUiStore = create<UiState>((set, get) => ({
  themeMode: 'light',
  notification: null,

  setThemeMode: (mode) => set({ themeMode: mode }),
  toggleDarkMode: () => set({ themeMode: get().themeMode === 'dark' ? 'light' : 'dark' }),

  showNotification: (type, message) => set({ notification: { type, message } }),
  clearNotification: () => set({ notification: null }),
}));