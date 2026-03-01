import { create } from "zustand";

export interface ControlsState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  brake: boolean;
}

interface AppState {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  controls: ControlsState;
  setControl: (control: keyof ControlsState, value: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
}

export const useStore = create<AppState>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),

  controls: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    brake: false,
  },
  setControl: (control, value) =>
    set((state) => ({
      controls: {
        ...state.controls,
        [control]: value,
      },
    })),

  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
}));
