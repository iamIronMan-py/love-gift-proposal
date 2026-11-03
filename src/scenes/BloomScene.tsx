import { useEffect } from 'react';
import { animate, createTimeline, stagger, type JSAnimation } from 'animejs';
import { useSceneEnter } from '../hooks/useSceneEnter';
import { Garden } from '../components/illustrations/Garden';
import { ArrowRight } from '../components/Icons';
import { dur, REDUCED_MOTION } from '../motion';

export function BloomScene({ onNext }: { onNext: () => void }) {
  const rootRef = useSceneEnter<HTMLElement>();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const animations: JSAnimation[] = [];
    const flowers = root.querySelectorAll<SVGElement>('.flowers .flower');
    const puppyPop = root.querySelector<SVGElement>('.garden .puppy-pop');
    const butterflies = root.querySelectorAll<SVGElement>('.garden__butterfly');
    const sparkles = root.querySelectorAll<SVGElement>('.garden__sparkle');
    const garden = root.querySelector<SVGElement>('.garden');

    if (REDUCED_MOTION) {
      flowers.forEach((flower) => {
        flower.style.opacity = '1';
        flower.style.transform = 'scale(1)';
      });
      if (puppyPop) puppyPop.style.opacity = '1';
      return;
    }

    if (garden) {
      const tl = createTimeline({ defaults: { ease: 'outCubic' } });
      tl.add(garden, { opacity: [0, 1], scale: [0.96, 1], duration: dur(900) });
      if (flowers.length) {
        tl.add(
          flowers,
          {
            scale: [0, 1],
            opacity: [0, 1],
            duration: dur(1000),
            delay: stagger(dur(75), { from: 'center' }),
            ease: 'outBack',
          },
          160,
        );
      }
      if (puppyPop) {
        tl.add(
          puppyPop,
          {
            opacity: [0, 1],
            translateY: [72, 0],
            duration: dur(1150),
            ease: 'outElastic(1, .62)',
          },
          520,
        );
      }
      if (butterflies.length) {
        tl.add(butterflies, { opacity: [0, 1], duration: dur(700) }, 1000);
      }
    }

    const tail = root.querySelector<SVGElement>('.garden .puppy__tail');
    const body = root.querySelector<SVGElement>('.garden .puppy__body');
    const head = root.querySelector<SVGElement>('.garden .puppy__head');
    const eyes = root.querySelectorAll<SVGElement>('.garden .puppy__eye');
    const earLeft = root.querySelector<SVGElement>('.garden .puppy__ear--left');
    const earRight = root.querySelector<SVGElement>('.garden .puppy__ear--right');
    const crown = root.querySelector<SVGElement>('.garden .puppy__crown');
    const wings = root.querySelectorAll<SVGElement>('.garden__butterfly-wings');

    if (tail) {
      animations.push(
        animate(tail, {
          rotate: [-16, 16],
          duration: 900,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (body) {
      animations.push(
        animate(body, {
          scaleY: [1, 1.025],
          duration: 2500,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (head) {
      animations.push(
        animate(head, {
          rotate: [-2, 2],
          duration: 3600,
          delay: 900,
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
            { scaleY: 1, duration: 2900 },
            { scaleY: 0.1, duration: 110 },
            { scaleY: 1, duration: 160 },
          ],
          delay: 1900,
          loop: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (earLeft) {
      animations.push(
        animate(earLeft, {
          rotate: [-4, 4],
          duration: 2200,
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
          duration: 2200,
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
          duration: 3100,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (sparkles.length) {
      animations.push(
        animate(sparkles, {
          opacity: [0.25, 0.95, 0.25],
          scale: [0.6, 1.2, 0.6],
          duration: 2500,
          delay: stagger(280),
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
          duration: 4800,
          delay: stagger(600),
          loop: true,
          ease: 'inOutSine',
        }),
      );
    }
    if (wings.length) {
      animations.push(
        animate(wings, {
          scaleX: [1, 0.7, 1],
          duration: 760,
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
    <section className="scene" ref={rootRef} aria-labelledby="bloom-title">
      <div className="scene__inner bloom__grid">
        <div className="bloom__copy">
          <p className="eyebrow" data-anim>
            Chapter three · A garden in bloom
          </p>
          <h2 className="display bloom__title" id="bloom-title" data-anim>
            Some things <em>bloom</em> when they are meant for you.
          </h2>
          <p className="lede" data-anim>
            The flowers seemed to know you were waiting. And someone very small and very excited
            came along to make sure your gift arrived safely.
          </p>
          <div className="bloom__cta" data-anim>
            <button className="btn" type="button" onClick={onNext}>
              Your gift is waiting
              <ArrowRight className="btn__arrow" />
            </button>
          </div>
        </div>

        <div className="garden-wrap">
          <Garden />
        </div>
      </div>
    </section>
  );
}
