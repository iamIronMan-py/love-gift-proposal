import { useEffect, useMemo, useRef } from 'react';
import { animate, createTimeline, type JSAnimation } from 'animejs';
import { dur, REDUCED_MOTION } from '../motion';

const PETAL_COLORS = [
  'linear-gradient(140deg, #f9cbd6, #eea2b6)',
  'linear-gradient(140deg, #e7dff9, #c3b3ea)',
  'linear-gradient(140deg, #fbe8c9, #eccf9f)',
  'linear-gradient(140deg, #d5ecdb, #a9cbb0)',
  'linear-gradient(140deg, #fbd3c2, #f0a98d)',
];

const HEART_COLORS = ['#e89aae', '#c96a86', '#d8ccf4', '#e7c98f', '#a9cbb0'];

export function PetalBurst({ count = 34 }: { count?: number }) {
  const rootRef = useRef<HTMLDivElement>(null);

  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 10 + Math.random() * 15,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        tx: -210 + Math.random() * 420,
        ty: -300 + Math.random() * 170,
        rot: -260 + Math.random() * 520,
        delay: Math.random() * 220,
        duration: 1550 + Math.random() * 950,
      })),
    [count],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('.burst-petal'));
    if (!els.length) return;

    const tl = createTimeline();
    tl.add(els, {
      translateX: (el: unknown) => Number((el as HTMLElement).dataset.tx ?? 0),
      translateY: (el: unknown) => Number((el as HTMLElement).dataset.ty ?? 0),
      rotate: (el: unknown) => Number((el as HTMLElement).dataset.rot ?? 0),
      opacity: [0, 1, 1, 0],
      scale: [0.4, 1, 1, 0.8],
      duration: (el: unknown) => dur(Number((el as HTMLElement).dataset.dur ?? 1900)),
      delay: (el: unknown) => dur(Number((el as HTMLElement).dataset.delay ?? 0)),
      ease: 'outCubic',
    });

    return () => {
      tl.revert();
    };
  }, [petals]);

  return (
    <div className="burst" ref={rootRef} aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="burst-petal"
          data-tx={petal.tx}
          data-ty={petal.ty}
          data-rot={petal.rot}
          data-dur={petal.duration}
          data-delay={petal.delay}
          style={{
            width: petal.size,
            height: petal.size * 0.74,
            marginLeft: -petal.size / 2,
            marginTop: (-petal.size * 0.74) / 2,
            background: petal.color,
          }}
        />
      ))}
    </div>
  );
}

export function PetalRain() {
  const rootRef = useRef<HTMLDivElement>(null);

  const petals = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: (i * 3.37 + Math.random() * 4) % 100,
        size: 8 + Math.random() * 13,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        drift: -80 + Math.random() * 160,
        spin: 100 + Math.random() * 340,
        rot: Math.random() * 360,
        duration: 12000 + Math.random() * 10000,
        delay: Math.random() * 7000,
        loopDelay: Math.random() * 4000,
      })),
    [],
  );

  useEffect(() => {
    if (REDUCED_MOTION) return;
    const root = rootRef.current;
    if (!root) return;

    const animations: JSAnimation[] = [];
    root.querySelectorAll<HTMLElement>('.rain-petal').forEach((el, i) => {
      const petal = petals[i];
      animations.push(
        animate(el, {
          translateY: ['-12vh', '114vh'],
          translateX: [0, petal.drift],
          rotate: [petal.rot, petal.rot + petal.spin],
          opacity: [0, 0.9, 0.9, 0],
          duration: petal.duration,
          delay: petal.delay,
          loop: true,
          loopDelay: petal.loopDelay,
          ease: 'linear',
        }),
      );
    });

    return () => {
      animations.forEach((animation) => animation.revert());
    };
  }, [petals]);

  return (
    <div className="petal-rain" ref={rootRef} aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="rain-petal"
          style={{
            left: `${petal.left}%`,
            width: petal.size,
            height: petal.size * 0.72,
            background: petal.color,
          }}
        />
      ))}
    </div>
  );
}

export function HeartBurst({ count = 20 }: { count?: number }) {
  const rootRef = useRef<HTMLDivElement>(null);

  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        color: HEART_COLORS[i % HEART_COLORS.length],
        tx: -150 + Math.random() * 300,
        ty: -220 + Math.random() * 120,
        rot: -120 + Math.random() * 240,
        delay: Math.random() * 200,
        duration: 1400 + Math.random() * 800,
      })),
    [count],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('.love-burst__heart'));
    if (!els.length) return;

    const tl = createTimeline();
    tl.add(els, {
      translateX: (el: unknown) => Number((el as HTMLElement).dataset.tx ?? 0),
      translateY: (el: unknown) => Number((el as HTMLElement).dataset.ty ?? 0),
      rotate: (el: unknown) => Number((el as HTMLElement).dataset.rot ?? 0),
      scale: [0.3, 1.05, 1, 0.55],
      opacity: [0, 1, 1, 0],
      duration: (el: unknown) => dur(Number((el as HTMLElement).dataset.dur ?? 1600)),
      delay: (el: unknown) => dur(Number((el as HTMLElement).dataset.delay ?? 0)),
      ease: 'outCubic',
    });

    return () => {
      tl.revert();
    };
  }, [hearts]);

  return (
    <div className="love-burst" ref={rootRef} aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="love-burst__heart"
          data-tx={heart.tx}
          data-ty={heart.ty}
          data-rot={heart.rot}
          data-dur={heart.duration}
          data-delay={heart.delay}
          style={{ color: heart.color }}
        >
          <svg viewBox="0 0 16 15" fill="currentColor">
            <path d="M8 14.2S1 10.1 1 5.6C1 3.1 3 1.5 5 2.5c1.2.6 2 1.7 3 3 1-1.3 1.8-2.4 3-3 2-1 4 .6 4 3.1 0 4.5-7 8.6-7 8.6Z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
