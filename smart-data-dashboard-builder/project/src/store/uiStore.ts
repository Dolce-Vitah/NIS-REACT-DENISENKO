import { create } from 'zustand';

type UiState = {
  isDarkMode: boolean;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  toggleDarkMode: () => void;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  clearNotification: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  isDarkMode: false,
  notification: null,

  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  showNotification: (type, message) => set({ notification: { type, message } }),
  clearNotification: () => set({ notification: null }),
}));