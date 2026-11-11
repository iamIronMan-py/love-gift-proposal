import { useEffect, useRef, useState } from 'react';
import { REDUCED_MOTION } from '../motion';

const SMOOTHING = REDUCED_MOTION ? 1 : 0.085;

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const smoothRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const story = document.querySelector<HTMLElement>('.story');
    if (!story) return;

    const tick = () => {
      rafRef.current = null;
      const target = targetRef.current;
      const current = smoothRef.current;
      const next = current + (target - current) * SMOOTHING;
      const settled = Math.abs(target - next) < 0.0003;
      smoothRef.current = settled ? target : next;
      setProgress(smoothRef.current);
      if (!settled) rafRef.current = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
    };

    const measure = () => {
      const rect = story.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      targetRef.current = travel <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / travel));
      if (REDUCED_MOTION) smoothRef.current = targetRef.current;
      kick();
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);

    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return progress;
}
