import { useEffect, useRef } from 'react';
import { createTimeline, stagger } from 'animejs';
import { dist, dur } from '../motion';

export function useSceneEnter<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-anim]'));
    const tl = createTimeline({ defaults: { ease: 'outCubic' } });

    tl.add(root, { opacity: [0, 1], duration: dur(520) });

    if (items.length) {
      tl.add(
        items,
        {
          opacity: [0, 1],
          translateY: [dist(24), 0],
          duration: dur(880),
          delay: stagger(dur(85)),
          ease: 'outQuart',
        },
        110,
      );
    }

    return () => {
      tl.revert();
    };
  }, []);

  return ref;
}
