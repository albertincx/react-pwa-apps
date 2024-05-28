export {}

declare global {
  const reminderData: {secPassed: number, step: number};
  interface Window {
    safTimerBtn: (s: number) => void;
    safTimerResetBtn: () => void;
    chgStepTimer: (s: number) => void;
    resetReactApp: () => void;
    mobileCheck: () => boolean;
  }
}
