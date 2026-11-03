import { useEffect } from 'react';
import { animate, createTimeline, stagger, type JSAnimation } from 'animejs';
import { useSceneEnter } from '../hooks/useSceneEnter';
import { GiftParcel } from '../components/illustrations/GiftParcel';
import { GiftIcon, HeartIcon } from '../components/Icons';
import { dur, REDUCED_MOTION } from '../motion';

export function ConfirmScene({ onNext }: { onNext: () => void }) {
  const rootRef = useSceneEnter<HTMLElement>();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || REDUCED_MOTION) return;

    const animations: JSAnimation[] = [];
    const drop = root.querySelector<HTMLElement>('.parcel-drop');
    const glow = root.querySelector<HTMLElement>('.parcel-stage__glow');
    const skyline = root.querySelector<SVGElement>('.parcel-stage__skyline');
    const label = root.querySelector<HTMLElement>('.parcel-stage__label');
    const sun = root.querySelector<HTMLElement>('.parcel-stage__sun');

    if (drop && skyline && glow && label) {
      const tl = createTimeline({ defaults: { ease: 'outCubic' } });
      tl.add(drop, {
        translateY: [-300, 0],
        rotate: [-7, 0],
        scale: [0.86, 1],
        duration: dur(1450),
        ease: 'outElastic(1, .55)',
      })
        .add(skyline, { opacity: [0, 0.55], duration: dur(1200) }, 260)
        .add(glow, { opacity: [0, 0.95], scale: [0.6, 1], duration: dur(900), ease: 'outQuad' }, 380)
        .add(label, { opacity: [0, 1], translateY: [12, 0], duration: dur(720) }, 1150);
    }

    if (sun) {
      animations.push(
        animate(sun, {
          scale: [1, 1.08],
          opacity: [0.7, 1],
          duration: 4200,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }

    const float = root.querySelector<SVGElement>('.parcel__float');
    if (float) {
      animations.push(
        animate(float, {
          translateY: [0, -6],
          duration: 3700,
          delay: 1400,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }

    const bow = root.querySelector<SVGElement>('.parcel__bow');
    if (bow) {
      animations.push(
        animate(bow, {
          rotate: [-3, 3],
          duration: 2700,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }

    const tag = root.querySelector<SVGElement>('.parcel__tag');
    if (tag) {
      animations.push(
        animate(tag, {
          rotate: [-5, 5],
          duration: 3300,
          delay: 500,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }

    const sparkles = root.querySelectorAll<SVGElement>('.parcel__sparkle');
    if (sparkles.length) {
      animations.push(
        animate(sparkles, {
          opacity: [0.35, 1, 0.35],
          scale: [0.75, 1.18, 0.75],
          duration: 2400,
          delay: stagger(240),
          loop: true,
          ease: 'inOutSine',
        }),
      );
    }

    return () => {
      animations.forEach((animation) => animation.revert());
    };
  }, [rootRef]);

  return (
    <section className="scene" ref={rootRef} aria-labelledby="confirm-title">
      <div className="scene__inner confirm__grid">
        <div className="confirm__copy">
          <p className="eyebrow" data-anim>
            Chapter one · Wrapped in Dubai
          </p>
          <h2 className="display confirm__title" id="confirm-title" data-anim>
            First, a little <em>something</em> was wrapped just for you.
          </h2>
          <p className="lede" data-anim>
            Ribbons tied by hand, a tag written with care, and a tiny parcel carrying far more
            love than it looks like it could hold.
          </p>

          <div className="shipping" data-anim>
            <div className="shipping__item">
              <span className="shipping__label">From</span>
              <span className="shipping__value">Dubai</span>
            </div>
            <div className="shipping__item">
              <span className="shipping__label">To</span>
              <span className="shipping__value">Canada</span>
            </div>
            <div className="shipping__item">
              <span className="shipping__label">With</span>
              <span className="shipping__value">Love</span>
            </div>
          </div>

          <div data-anim>
            <button className="btn" type="button" onClick={onNext}>
              Seal it with love
              <HeartIcon className="btn__arrow" />
            </button>
          </div>
        </div>

        <div className="parcel-stage" aria-hidden="true">
          <div className="parcel-stage__arch">
            <div className="parcel-stage__sun" />
            <Skyline />
          </div>
          <div className="parcel-stage__glow" />
          <div className="parcel-drop">
            <GiftParcel />
          </div>
          <div className="parcel-stage__label">
            <GiftIcon />
            Handle with love
          </div>
        </div>
      </div>
    </section>
  );
}

function Skyline() {
  return (
    <svg
      className="parcel-stage__skyline"
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 200 L0 152 L24 152 L24 132 L52 132 L52 150 L78 150 L78 112 L92 112 L92 96 L102 96 L102 112 L116 112 L116 148 L142 148 L142 124 L160 124 L160 140 L184 140 L184 78 L188 48 L192 78 L192 100 L198 100 L198 58 L202 28 L206 58 L210 100 L214 100 L218 78 L222 48 L226 78 L230 140 L258 140 L258 120 L280 120 L280 144 L304 144 L304 108 L316 108 L316 94 L326 94 L326 108 L338 108 L338 148 L364 148 L364 128 L388 128 L388 152 L400 152 L400 200 Z"
        fill="#d8b273"
      />
      <path
        d="M0 200 L0 168 L38 168 L38 156 L70 156 L70 170 L120 170 L120 164 L200 164 L200 172 L276 172 L276 158 L320 158 L320 170 L360 170 L360 160 L400 160 L400 200 Z"
        fill="#c99a68"
        opacity="0.55"
      />
    </svg>
  );
}
