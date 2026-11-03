import { useEffect } from 'react';
import { animate, stagger, type JSAnimation } from 'animejs';
import { useSceneEnter } from '../hooks/useSceneEnter';
import { Envelope } from '../components/illustrations/Envelope';
import { ArrowRight } from '../components/Icons';
import { REDUCED_MOTION } from '../motion';

export function IntroScene({ onNext }: { onNext: () => void }) {
  const rootRef = useSceneEnter<HTMLElement>();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || REDUCED_MOTION) return;

    const animations: JSAnimation[] = [];
    const envelope = root.querySelector<SVGElement>('.envelope');
    const letter = root.querySelector<SVGElement>('.envelope__letter');
    const seal = root.querySelector<SVGElement>('.envelope__seal');
    const sparkles = root.querySelectorAll<SVGElement>('.envelope__sparkle');
    const sprigs = root.querySelectorAll<SVGElement>('.envelope__sprig');

    if (envelope) {
      animations.push(
        animate(envelope, {
          translateY: [0, -12],
          rotate: [-1.4, 1.4],
          duration: 6600,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }

    if (letter) {
      animations.push(
        animate(letter, {
          translateY: [0, -9],
          duration: 3800,
          delay: 500,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        }),
      );
    }

    if (seal) {
      animations.push(
        animate(seal, {
          scale: [1, 1.07, 1],
          duration: 2900,
          loop: true,
          ease: 'inOutSine',
        }),
      );
    }

    if (sparkles.length) {
      animations.push(
        animate(sparkles, {
          opacity: [0.35, 1, 0.35],
          scale: [0.75, 1.15, 0.75],
          duration: 2500,
          delay: stagger(280),
          loop: true,
          ease: 'inOutSine',
        }),
      );
    }

    if (sprigs.length) {
      animations.push(
        animate(sprigs, {
          rotate: [-2, 2],
          duration: 4200,
          delay: stagger(500),
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
    <section className="scene" ref={rootRef} aria-labelledby="intro-title">
      <div className="scene__inner intro__inner">
        <div className="intro__copy">
          <p className="eyebrow" data-anim>
            A little surprise, wrapped with love
          </p>

          <h1 className="display intro__title" id="intro-title">
            <span className="line">
              <span className="word" data-anim>
                Something
              </span>{' '}
              <span className="word" data-anim>
                <em>special</em>
              </span>
            </span>
            <span className="line">
              <span className="word" data-anim>
                is
              </span>{' '}
              <span className="word" data-anim>
                on
              </span>{' '}
              <span className="word" data-anim>
                its
              </span>{' '}
              <span className="word" data-anim>
                way...
              </span>
            </span>
          </h1>

          <p className="lede" data-anim>
            It began in Dubai, among warm golden evenings and quiet wishes. Now it is crossing
            oceans and skies — travelling a very long way just to make you smile.
          </p>

          <div className="intro__actions" data-anim>
            <button className="btn" type="button" onClick={onNext}>
              Begin the journey
              <ArrowRight className="btn__arrow" />
            </button>
            <p className="route-tag">
              <span>Dubai</span>
              <span className="route-tag__line" />
              <span>Canada</span>
            </p>
          </div>
        </div>

        <div className="intro__ornament">
          <div className="intro__halo" />
          <Envelope />
        </div>
      </div>
    </section>
  );
}
