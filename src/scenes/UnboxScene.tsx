import { useEffect, useRef, useState } from 'react';
import { createTimeline, stagger, type Timeline } from 'animejs';
import { useSceneEnter } from '../hooks/useSceneEnter';
import { GiftBox } from '../components/illustrations/GiftBox';
import { PetalBurst } from '../components/Petals';
import { ArrowRight, GiftIcon } from '../components/Icons';
import { dur, REDUCED_MOTION } from '../motion';

export function UnboxScene({ onNext }: { onNext: () => void }) {
  const rootRef = useSceneEnter<HTMLElement>();
  const revealRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || REDUCED_MOTION) return;
    const box = root.querySelector<SVGElement>('.box-svg');
    if (!box) return;
    const tl = createTimeline();
    tl.add(box, {
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.94, 1],
      duration: dur(1000),
      ease: 'outBack',
    });
    return () => {
      tl.revert();
    };
  }, [rootRef]);

  useEffect(() => {
    if (!revealed) return;
    const el = revealRef.current;
    if (!el) return;
    if (REDUCED_MOTION) {
      el.style.opacity = '1';
      return;
    }
    const tl = createTimeline();
    tl.add(el, { opacity: [0, 1], translateY: [18, 0], duration: dur(760), ease: 'outBack' });
    return () => {
      tl.revert();
    };
  }, [revealed]);

  const openBox = () => {
    if (opened) return;
    const root = rootRef.current;
    if (!root) return;

    setOpened(true);

    if (REDUCED_MOTION) {
      const ribbon = root.querySelector<SVGElement>('.box__ribbon');
      const bow = root.querySelector<SVGElement>('.box__bow');
      const lid = root.querySelector<SVGElement>('.box__lid');
      const glow = root.querySelector<SVGElement>('.box-glow');
      const contents = root.querySelector<SVGElement>('.box__contents');
      if (ribbon) ribbon.style.opacity = '0';
      if (bow) bow.style.opacity = '0';
      if (lid) lid.style.transform = 'translateY(-122px) rotate(-8deg)';
      if (glow) glow.style.opacity = '1';
      if (contents) contents.style.opacity = '1';
      setRevealed(true);
      return;
    }

    setBurst((value) => value + 1);

    const ribbon = root.querySelector<SVGElement>('.box__ribbon');
    const bow = root.querySelector<SVGElement>('.box__bow');
    const lid = root.querySelector<SVGElement>('.box__lid');
    const glow = root.querySelector<SVGElement>('.box-glow');
    const contents = root.querySelector<SVGElement>('.box__contents');
    const sparkles = Array.from(root.querySelectorAll<SVGElement>('.box__sparkle'));

    const tl: Timeline = createTimeline({ defaults: { ease: 'outCubic' } });

    if (ribbon) {
      tl.add(
        ribbon,
        {
          translateY: 48,
          rotate: -5,
          opacity: [1, 0],
          duration: dur(720),
          ease: 'inOutQuad',
        },
        0,
      );
    }
    if (bow) {
      tl.add(
        bow,
        {
          translateY: -46,
          rotate: 22,
          scale: [1, 1.14],
          opacity: [1, 0],
          duration: dur(800),
          ease: 'inOutQuad',
        },
        80,
      );
    }
    if (lid) {
      tl.add(
        lid,
        {
          translateY: -122,
          rotate: -8,
          duration: dur(1050),
          ease: 'outBack',
        },
        300,
      );
    }
    if (glow) {
      tl.add(
        glow,
        {
          opacity: [0.55, 1, 0.82],
          scale: [0.7, 1.55],
          duration: dur(1250),
          ease: 'outQuad',
        },
        320,
      );
    }
    if (contents) {
      tl.add(
        contents,
        {
          opacity: [0, 1],
          scale: [0.25, 1],
          translateY: [34, 0],
          duration: dur(1150),
          ease: 'outBack',
        },
        480,
      );
    }
    if (sparkles.length) {
      tl.add(
        sparkles,
        {
          opacity: [0, 1, 0.55],
          scale: [0.4, 1.3, 1],
          duration: dur(1000),
          delay: stagger(dur(80)),
          ease: 'outQuad',
        },
        460,
      );
    }

    tl.call(() => setRevealed(true), dur(1650));
  };

  return (
    <section className="scene" ref={rootRef} aria-labelledby="unbox-title">
      <div className="scene__inner unbox__inner">
        <div className="unbox__copy">
          <p className="eyebrow" data-anim>
            Chapter five · The ribbon
          </p>
          <h2 className="display unbox__title" id="unbox-title" data-anim>
            One little ribbon between you and <em>your surprise.</em>
          </h2>
          <p className="lede" data-anim style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Take a breath, make a wish, and open it slowly. It has been waiting a very long time
            to meet you.
          </p>
        </div>

        <div className="box-stage">
          <div className="box-halo" />
          <GiftBox />
        </div>

        <div className="box-cta">
          {!opened && (
            <button className="btn" type="button" onClick={openBox} data-anim>
              <GiftIcon className="btn__arrow" />
              Open the box
            </button>
          )}
          {opened && !revealed && <span className="fineprint">Unwrapping something lovely...</span>}
          {revealed && (
            <div ref={revealRef} className="reveal-btn" style={{ opacity: 0 }}>
              <button className="btn" type="button" onClick={onNext}>
                Meet your gift
                <ArrowRight className="btn__arrow" />
              </button>
            </div>
          )}
        </div>
      </div>

      {burst > 0 && <PetalBurst key={burst} count={38} />}
    </section>
  );
}
