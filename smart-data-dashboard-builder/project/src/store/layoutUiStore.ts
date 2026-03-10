import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WorkspaceMode = 'build' | 'analyze' | 'present' | 'discover';

type LayoutUiState = {
  workspaceMode: WorkspaceMode;
  leftCollapsed: boolean;
  rightCollapsed: boolean;

  setWorkspaceMode: (mode: WorkspaceMode) => void;
  toggleLeft: () => void;
  toggleRight: () => void;
};

const defaultsByMode: Record<WorkspaceMode, { leftCollapsed: boolean; rightCollapsed: boolean }> = {
  build: { leftCollapsed: false, rightCollapsed: false },
  analyze: { leftCollapsed: true, rightCollapsed: false },
  present: { leftCollapsed: true, rightCollapsed: true },
  discover: { leftCollapsed: true, rightCollapsed: true },
};

export const useLayoutUiStore = create<LayoutUiState>()(
  persist(
    (set) => ({
      workspaceMode: 'build',
      ...defaultsByMode.build,

      setWorkspaceMode: (mode) => {
        const next = defaultsByMode[mode];
        set({
          workspaceMode: mode,
          leftCollapsed: next.leftCollapsed,
          rightCollapsed: next.rightCollapsed,
        });
      },

      toggleLeft: () => set((s) => ({ leftCollapsed: !s.leftCollapsed })),
      toggleRight: () => set((s) => ({ rightCollapsed: !s.rightCollapsed })),
    }),
    {
      name: 'layout-ui-store-v1',
      version: 1,
      partialize: (state) => ({
        workspaceMode: state.workspaceMode,
        leftCollapsed: state.leftCollapsed,
        rightCollapsed: state.rightCollapsed,
      }),
    }
  )
);
