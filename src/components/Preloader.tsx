import { useEffect, useRef } from 'react';
import { animate, createTimeline, type JSAnimation } from 'animejs';
import { dur } from '../motion';
import { Flower } from './illustrations/Flower';

const PETAL_COLORS = ['#f7cdd8', '#d8ccf4', '#fbe8c9', '#c4ddca', '#fbd3c2'];

export function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;
    if (!root || !bar) return;

    let cancelled = false;
    const animations: JSAnimation[] = [];

    const tl = createTimeline({ defaults: { ease: 'outCubic' } });
    tl.add('.preloader__mark', { opacity: [0, 1], scale: [0.72, 1], duration: dur(900), ease: 'outBack' })
      .add('.preloader__title', { opacity: [0, 1], translateY: [14, 0], duration: dur(720) }, 240)
      .add('.preloader__sub', { opacity: [0, 1], duration: dur(620) }, 430)
      .add(bar, { scaleX: [0, 0.82], duration: dur(1500), ease: 'inOutSine' }, 330);

    root.querySelectorAll<HTMLElement>('.preloader__petal').forEach((el, i) => {
      animations.push(
        animate(el, {
          translateY: [0, -16],
          rotate: [0, 18],
          opacity: [0.25, 0.7, 0.25],
          duration: 2600 + i * 180,
          delay: i * 140,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    });

    const minimum = new Promise<void>((resolve) => {
      window.setTimeout(resolve, dur(1550));
    });
    const fonts =
      typeof document !== 'undefined' && document.fonts
        ? document.fonts.ready.then(() => undefined)
        : Promise.resolve(undefined);
    const fontFallback = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 2500);
    });

    Promise.all([minimum, Promise.race([fonts, fontFallback])]).then(() => {
      if (cancelled) return;
      const outro = createTimeline({ defaults: { ease: 'inOutQuad' } });
      outro
        .add(bar, { scaleX: 1, duration: dur(340) })
        .add(root, { opacity: [1, 0], duration: dur(640) }, `+=${dur(220)}`)
        .call(() => onDoneRef.current());
    });

    return () => {
      cancelled = true;
      tl.revert();
      animations.forEach((animation) => animation.revert());
    };
  }, []);

  return (
    <div className="preloader" ref={rootRef} role="status" aria-live="polite">
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="preloader__petal"
          style={{
            width: 10 + (i % 4) * 4,
            height: 8 + (i % 4) * 3,
            left: `${12 + ((i * 37) % 76)}%`,
            top: `${16 + ((i * 53) % 68)}%`,
            background: PETAL_COLORS[i % PETAL_COLORS.length],
          }}
        />
      ))}

      <div className="preloader__inner">
        <div className="preloader__mark">
          <svg viewBox="0 0 100 112" aria-hidden="true">
            <Flower
              x={50}
              y={104}
              stemHeight={64}
              headScale={1.12}
              petal="#e89aae"
              petalLight="#f7cdd8"
              center="#e7c98f"
              variant="rose"
            />
          </svg>
        </div>
        <h1 className="preloader__title">Wrapping something special</h1>
        <p className="preloader__sub">A little surprise is being prepared</p>
        <div className="preloader__bar">
          <span className="preloader__barFill" ref={barRef} />
        </div>
      </div>
    </div>
  );
}
