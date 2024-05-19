export {}

declare global {
  interface Window {
    safTimerBtn: (s: number) => void;
    safTimerResetBtn: () => void;
  }
}
