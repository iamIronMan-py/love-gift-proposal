import { useEffect, useMemo, useRef } from 'react';
import { animate, type JSAnimation } from 'animejs';
import { dur, REDUCED_MOTION } from '../motion';

const PETAL_COLORS = [
  'linear-gradient(140deg, #f9cbd6, #eea2b6)',
  'linear-gradient(140deg, #e7dff9, #c3b3ea)',
  'linear-gradient(140deg, #fbe8c9, #eccf9f)',
  'linear-gradient(140deg, #d5ecdb, #a9cbb0)',
  'linear-gradient(140deg, #fbd3c2, #f0a98d)',
];

type Petal = {
  left: number;
  size: number;
  color: string;
  drift: number;
  spin: number;
  duration: number;
  delay: number;
  loopDelay: number;
};

type Sparkle = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

export function AmbientBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: (i * 6.4 + Math.random() * 5) % 100,
        size: 10 + Math.random() * 15,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        drift: -80 + Math.random() * 160,
        spin: 120 + Math.random() * 320,
        duration: 15000 + Math.random() * 12000,
        delay: Math.random() * 9000,
        loopDelay: Math.random() * 5000,
      })),
    [],
  );

  const sparkles = useMemo<Sparkle[]>(
    () =>
      Array.from({ length: 14 }, () => ({
        left: Math.random() * 94 + 2,
        top: Math.random() * 88 + 3,
        size: 5 + Math.random() * 7,
        delay: Math.random() * 3200,
        duration: 2200 + Math.random() * 2600,
      })),
    [],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || REDUCED_MOTION) return;

    const animations: JSAnimation[] = [];

    root.querySelectorAll<HTMLElement>('.ambient__blob').forEach((el, i) => {
      animations.push(
        animate(el, {
          translateX: [0, i % 2 === 0 ? 52 : -44],
          translateY: [0, i % 2 === 0 ? -38 : 46],
          scale: [1, 1.12],
          duration: 18000 + i * 2600,
          delay: i * 700,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    });

    root.querySelectorAll<HTMLElement>('.ambient__petal').forEach((el, i) => {
      const petal = petals[i];
      animations.push(
        animate(el, {
          translateY: ['-12vh', '112vh'],
          translateX: [0, petal.drift],
          rotate: [0, petal.spin],
          opacity: [0, 0.82, 0.82, 0],
          duration: petal.duration,
          delay: petal.delay,
          loop: true,
          loopDelay: petal.loopDelay,
          ease: 'linear',
        }),
      );
    });

    root.querySelectorAll<HTMLElement>('.ambient__sparkle').forEach((el, i) => {
      const sparkle = sparkles[i];
      animations.push(
        animate(el, {
          opacity: [0, 0.95, 0],
          scale: [0.5, 1.25, 0.5],
          rotate: [0, 45, 90],
          duration: sparkle.duration,
          delay: sparkle.delay,
          loop: true,
          ease: 'inOutSine',
        }),
      );
    });

    return () => {
      animations.forEach((a) => a.revert());
    };
  }, [petals, sparkles]);

  return (
    <div className="ambient" ref={rootRef} aria-hidden="true">
      <div className="ambient__wash" />
      <div className="ambient__blob ambient__blob--1" />
      <div className="ambient__blob ambient__blob--2" />
      <div className="ambient__blob ambient__blob--3" />
      <div className="ambient__blob ambient__blob--4" />

      {petals.map((petal, i) => (
        <span
          key={`petal-${i}`}
          className="ambient__petal"
          style={{
            left: `${petal.left}%`,
            width: petal.size,
            height: petal.size * 0.72,
            background: petal.color,
            animationDuration: `${dur(0)}ms`,
          }}
        />
      ))}

      {sparkles.map((sparkle, i) => (
        <span
          key={`sparkle-${i}`}
          className="ambient__sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: sparkle.size,
            height: sparkle.size,
          }}
        />
      ))}

      <div className="ambient__grain" />
    </div>
  );
}
