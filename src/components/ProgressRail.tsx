import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { REDUCED_MOTION } from '../motion';
import { STAGES } from '../config';

export function ProgressRail({ current }: { current: number }) {
  const activeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = activeRef.current;
    if (!el || REDUCED_MOTION) return;
    const animation = animate(el, {
      scale: [0.6, 1.5, 1],
      duration: 620,
      ease: 'outBack',
    });
    return () => {
      animation.revert();
    };
  }, [current]);

  return (
    <div className="progress" aria-label={`Chapter ${current + 1} of ${STAGES.length}`}>
      <span className="progress__count">{String(current + 1).padStart(2, '0')}</span>
      <div className="progress__dots">
        {STAGES.map((stage, i) => (
          <span
            key={stage}
            ref={i === current ? activeRef : undefined}
            className={`progress__dot${i === current ? ' is-active' : ''}${i < current ? ' is-done' : ''}`}
          />
        ))}
      </div>
      <span className="progress__count">{String(STAGES.length).padStart(2, '0')}</span>
    </div>
  );
}
