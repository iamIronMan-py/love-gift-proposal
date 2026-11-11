import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { FlightWorld } from '../three/flightWorld';

export type FlightHandle = {
  setProgress: (value: number) => void;
};

export const FlightCanvas = forwardRef<FlightHandle, { className?: string }>(function FlightCanvas(
  { className = '' },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<FlightWorld | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let world: FlightWorld | null = null;
    try {
      world = new FlightWorld(canvas, {
        mobile: window.matchMedia('(max-width: 760px)').matches,
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
      worldRef.current = world;
    } catch (error) {
      console.error('Unable to initialise the 3D flight scene', error);
      return;
    }

    const onResize = () => world?.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      world?.dispose();
      worldRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setProgress: (value: number) => worldRef.current?.setProgress(value),
    }),
    [],
  );

  return <canvas ref={canvasRef} className={`flight-canvas ${className}`} aria-hidden="true" />;
});
