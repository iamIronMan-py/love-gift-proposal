import { useEffect } from 'react';
import { animate, createTimeline, type JSAnimation } from 'animejs';
import { useSceneEnter } from '../hooks/useSceneEnter';
import { GiftParcel } from '../components/illustrations/GiftParcel';
import { GiftIcon } from '../components/Icons';
import { dur, REDUCED_MOTION } from '../motion';

const LEAVES = [
  { left: '8%', top: '20%', size: 30, color: '#e2a07f', rot: 18, dur: 5200 },
  { left: '78%', top: '12%', size: 24, color: '#d98ba2', rot: -28, dur: 6100 },
  { left: '16%', top: '62%', size: 20, color: '#e7c98f', rot: 42, dur: 4900 },
  { left: '84%', top: '56%', size: 27, color: '#cf9a7f', rot: -10, dur: 5700 },
  { left: '58%', top: '8%', size: 17, color: '#b9a0d0', rot: 58, dur: 6600 },
];

export function ArrivalScene({ onNext }: { onNext: () => void }) {
  const rootRef = useSceneEnter<HTMLElement>();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const animations: JSAnimation[] = [];
    const parcel = root.querySelector<HTMLElement>('.doorway__parcel');
    const glow = root.querySelector<HTMLElement>('.doorway__glow');
    const card = root.querySelector<HTMLElement>('.delivery-card');
    const stamp = root.querySelector<HTMLElement>('.delivery-stamp');

    if (REDUCED_MOTION) {
      [parcel, glow, card, stamp].forEach((el) => {
        if (el) el.style.opacity = '1';
      });
      return;
    }

    if (parcel) {
      const tl = createTimeline({ defaults: { ease: 'outCubic' } });
      tl.add(parcel, {
        opacity: [0, 1],
        translateY: [-280, 0],
        rotate: [-6, 0],
        scale: [0.88, 1],
        duration: dur(1500),
        ease: 'outElastic(1, .55)',
      });
      if (glow) {
        tl.add(glow, { opacity: [0, 1], scale: [0.6, 1], duration: dur(900), ease: 'outQuad' }, 300);
      }
      if (card) {
        tl.add(
          card,
          {
            opacity: [0, 1],
            translateY: [18, 0],
            rotate: [-6, -3],
            duration: dur(820),
            ease: 'outBack',
          },
          950,
        );
      }
      if (stamp) {
        tl.add(
          stamp,
          {
            opacity: [0, 1],
            scale: [0.5, 1],
            rotate: [-30, -12],
            duration: dur(820),
            ease: 'outBack',
          },
          1120,
        );
      }
    }

    if (glow) {
      animations.push(
        animate(glow, {
          scale: [1, 1.08],
          opacity: [0.65, 1],
          duration: 3600,
          delay: 2100,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }

    root.querySelectorAll<HTMLElement>('.maple').forEach((leaf, i) => {
      const config = LEAVES[i % LEAVES.length];
      animations.push(
        animate(leaf, {
          translateY: [0, i % 2 === 0 ? 22 : -18, 0],
          translateX: [0, i % 2 === 0 ? 10 : -12, 0],
          rotate: [config.rot, config.rot + 24, config.rot],
          duration: config.dur,
          delay: i * 320,
          loop: true,
          ease: 'inOutSine',
        }),
      );
    });

    const bow = root.querySelector<SVGElement>('.parcel__bow');
    if (bow) {
      animations.push(
        animate(bow, {
          rotate: [-3, 3],
          duration: 2600,
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
          duration: 3200,
          delay: 400,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }

    return () => {
      animations.forEach((animation) => animation.revert());
    };
  }, [rootRef]);

  return (
    <section className="scene" ref={rootRef} aria-labelledby="arrival-title">
      <div className="scene__inner arrival__grid">
        <div className="arrival__copy">
          <p className="eyebrow" data-anim>
            Chapter four · Arrived in Canada
          </p>
          <h2 className="display arrival__title" id="arrival-title" data-anim>
            Touchdown, Canada. <em>Your gift is here.</em>
          </h2>
          <p className="lede" data-anim>
            A soft little landing, a parcel on the doorstep, and a tag that says it all:
            handle with love. It has come such a long way to reach you.
          </p>
          <div style={{ marginTop: '2rem' }} data-anim>
            <button className="btn" type="button" onClick={onNext}>
              <GiftIcon className="btn__arrow" />
              Open your gift
            </button>
          </div>
        </div>

        <div className="doorway" aria-hidden="true">
          <div className="doorway__arch">
            <svg className="doorway__snow" viewBox="0 0 400 400" preserveAspectRatio="none">
              <g fill="#fffdfb" opacity="0.5">
                <circle cx="48" cy="66" r="3" />
                <circle cx="120" cy="38" r="2" />
                <circle cx="210" cy="70" r="2.4" />
                <circle cx="302" cy="44" r="3" />
                <circle cx="354" cy="96" r="2" />
                <circle cx="74" cy="150" r="2" />
                <circle cx="330" cy="170" r="2.5" />
                <circle cx="160" cy="110" r="1.8" />
              </g>
            </svg>
          </div>
          <div className="doorway__step" />
          <div className="doorway__glow" />
          <div className="doorway__parcel">
            <GiftParcel />
          </div>

          <div className="delivery-card">
            <div className="delivery-card__top">
              <span>Express</span>
              <span>Handle with love</span>
            </div>
            <div className="delivery-card__code">DXB → YYZ</div>
            <div className="delivery-card__line" />
            <p className="delivery-card__note">For you, with all my love.</p>
          </div>

          <div className="delivery-stamp">
            Delivered
            <br />
            with love
            <br />
            Canada
          </div>

          {LEAVES.map((leaf, i) => (
            <span
              key={i}
              className="maple"
              style={{
                left: leaf.left,
                top: leaf.top,
                width: leaf.size,
                height: leaf.size,
                color: leaf.color,
              }}
            >
              <MapleLeaf />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapleLeaf() {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
      <path d="M16 29.2 16 22.8 10.4 24.6 12 20 5.6 18.2 9.2 14.2 6 9.4 11.6 10.4 12.8 5.2 16 9.4 19.2 5.2 20.4 10.4 26 9.4 22.8 14.2 26.4 18.2 20 20 21.6 24.6 16 22.8Z" />
      <path d="M16 22.8 16 29.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
