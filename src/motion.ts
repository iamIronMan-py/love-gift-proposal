export const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const dur = (ms: number) => (REDUCED_MOTION ? Math.max(1, Math.round(ms * 0.15)) : ms);

export const dist = (value: number) => (REDUCED_MOTION ? 0 : value);
