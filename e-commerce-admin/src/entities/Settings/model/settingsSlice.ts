import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
  itemsPerPage: number;
  sidebarCollapsed: boolean;
}

const initialState: SettingsState = {
  theme: 'light',
  language: 'en',
  itemsPerPage: 10,
  sidebarCollapsed: false,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setLanguage: (state, action: PayloadAction<SettingsState['language']>) => {
      state.language = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
  },
});

export const { toggleTheme, toggleSidebarCollapsed, setLanguage, setItemsPerPage } = settingsSlice.actions;
export default settingsSlice.reducer;