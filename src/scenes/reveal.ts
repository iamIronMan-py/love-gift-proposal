import type { CSSProperties } from 'react';
import { smoothstep } from '../motion';

export function reveal(
  progress: number,
  start = 0,
  end = 0.3,
  distance = 26,
  fromScale = 1,
): CSSProperties {
  const t = smoothstep(start, end, progress);
  return {
    opacity: t,
    transform: `translate3d(0, ${(1 - t) * distance}px, 0) scale(${
      fromScale + (1 - fromScale) * t
    })`,
  };
}
