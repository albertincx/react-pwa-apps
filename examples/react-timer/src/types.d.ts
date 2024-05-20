export {}

declare global {
  interface Window {
    safTimerBtn: (s: number) => void;
    safTimerResetBtn: () => void;
    chgStepTimer: (s: number) => void;
    resetReactApp: () => void;
    mobileCheck: () => boolean;
  }
}
