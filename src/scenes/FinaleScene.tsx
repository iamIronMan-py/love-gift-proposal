import { useEffect, useState } from 'react';
import { animate, stagger, type JSAnimation } from 'animejs';
import { useSceneEnter } from '../hooks/useSceneEnter';
import { Garden } from '../components/illustrations/Garden';
import { HeartBurst, PetalRain } from '../components/Petals';
import { HeartIcon, ReplayIcon } from '../components/Icons';
import { GIFT } from '../config';
import { dur, REDUCED_MOTION } from '../motion';

export function FinaleScene({ onReplay }: { onReplay: () => void }) {
  const rootRef = useSceneEnter<HTMLElement>();
  const [loved, setLoved] = useState(false);
  const [loveBurst, setLoveBurst] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || REDUCED_MOTION) return;

    const animations: JSAnimation[] = [];
    const garden = root.querySelector<SVGElement>('.finale__garden-svg');
    const jump = root.querySelector<SVGElement>('.puppy-jump');
    const tail = root.querySelector<SVGElement>('.puppy__tail');
    const head = root.querySelector<SVGElement>('.puppy__head');
    const eyes = root.querySelectorAll<SVGElement>('.puppy__eye');
    const earLeft = root.querySelector<SVGElement>('.puppy__ear--left');
    const earRight = root.querySelector<SVGElement>('.puppy__ear--right');
    const crown = root.querySelector<SVGElement>('.puppy__crown');
    const flowers = root.querySelectorAll<SVGElement>('.flowers--static .flower');
    const sparkles = root.querySelectorAll<SVGElement>('.garden__sparkle');
    const butterflies = root.querySelectorAll<SVGElement>('.garden__butterfly');
    const wings = root.querySelectorAll<SVGElement>('.garden__butterfly-wings');

    if (garden) {
      animations.push(
        animate(garden, {
          scale: [0.96, 1],
          translateY: [26, 0],
          duration: dur(1100),
          delay: dur(180),
          ease: 'outCubic',
        }),
      );
    }

    if (jump) {
      animations.push(
        animate(jump, {
          keyframes: [
            { translateY: 0, duration: 640 },
            { translateY: -30, duration: 270, ease: 'outQuad' },
            { translateY: 0, duration: 360, ease: 'inQuad' },
            { translateY: 0, duration: 460 },
          ],
          delay: dur(1450),
          loop: true,
        }),
      );
    }
    if (tail) {
      animations.push(
        animate(tail, {
          rotate: [-18, 18],
          duration: 820,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (head) {
      animations.push(
        animate(head, {
          rotate: [-2.4, 2.4],
          duration: 3400,
          delay: 700,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (eyes.length) {
      animations.push(
        animate(eyes, {
          keyframes: [
            { scaleY: 1, duration: 2800 },
            { scaleY: 0.1, duration: 110 },
            { scaleY: 1, duration: 160 },
          ],
          delay: 1700,
          loop: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (earLeft) {
      animations.push(
        animate(earLeft, {
          rotate: [-4, 4],
          duration: 2100,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (earRight) {
      animations.push(
        animate(earRight, {
          rotate: [4, -4],
          duration: 2100,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (crown) {
      animations.push(
        animate(crown, {
          rotate: [-3, 3],
          duration: 3000,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (flowers.length) {
      animations.push(
        animate(flowers, {
          rotate: [-1.6, 1.6],
          duration: 4300,
          delay: stagger(dur(120)),
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (sparkles.length) {
      animations.push(
        animate(sparkles, {
          opacity: [0.25, 1, 0.25],
          scale: [0.6, 1.2, 0.6],
          duration: 2500,
          delay: stagger(260),
          loop: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (butterflies.length) {
      animations.push(
        animate(butterflies, {
          translateX: [0, 16, 0],
          translateY: [0, -12, 0],
          rotate: [0, 7, 0],
          duration: 4700,
          delay: stagger(500),
          loop: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (wings.length) {
      animations.push(
        animate(wings, {
          scaleX: [1, 0.7, 1],
          duration: 740,
          loop: true,
          ease: 'inOutSine',
        }),
      );
    }

    return () => {
      animations.forEach((animation) => animation.revert());
    };
  }, [rootRef]);

  const sendLove = () => {
    setLoved(true);
    if (!REDUCED_MOTION) setLoveBurst((value) => value + 1);
  };

  return (
    <section className="scene finale" ref={rootRef} aria-labelledby="finale-title">
      <div className="scene__inner finale__inner">
        <div className="finale__copy">
          <p className="eyebrow" data-anim>
            Chapter six · Delivered with love
          </p>
          <h2 className="display finale__title" id="finale-title">
            <span className="line">
              <span className="word" data-anim>
                A little love,
              </span>
            </span>
            <span className="line">
              <span className="word" data-anim>
                all the way from
              </span>{' '}
              <span className="word" data-anim>
                <em>Dubai.</em>
              </span>
            </span>
          </h2>
          <p className="lede" data-anim style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            I hope this made you smile. You deserve soft days, fresh flowers, and a tiny golden
            friend who is always happy to see you.
          </p>
        </div>

        <div className="finale__garden">
          <Garden puppyParcel instant className="finale__garden-svg garden--static" />
        </div>

        <p className="signature" data-anim>
          {GIFT.recipient
            ? `For ${GIFT.recipient}, ${GIFT.signature.toLowerCase()}.`
            : `${GIFT.signature}.`}
        </p>

        <div className="finale__actions" data-anim>
          <button className="btn" type="button" onClick={onReplay}>
            <ReplayIcon className="btn__arrow" />
            Replay the journey
          </button>
          <button className="btn btn--soft" type="button" onClick={sendLove}>
            <HeartIcon className="btn__arrow" />
            {loved ? 'Send a little more love' : 'Send a little love'}
          </button>
        </div>
      </div>

      <PetalRain />
      {loveBurst > 0 && <HeartBurst key={loveBurst} count={22} />}
    </section>
  );
}
