export const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const dur = (ms: number) => (REDUCED_MOTION ? Math.max(1, Math.round(ms * 0.15)) : ms);

export const dist = (value: number) => (REDUCED_MOTION ? 0 : value);

export const smoothstep = (edge0: number, edge1: number, value: number) => {
  const range = edge1 - edge0 || 1;
  const t = Math.min(1, Math.max(0, (value - edge0) / range));
  return t * t * (3 - 2 * t);
};
