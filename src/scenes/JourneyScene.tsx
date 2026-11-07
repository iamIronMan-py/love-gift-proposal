import { useEffect, useRef, useState } from 'react';
import { createTimeline, stagger, type Timeline } from 'animejs';
import { useSceneEnter } from '../hooks/useSceneEnter';
import { WorldMap, flightPoint, flightTangent } from '../components/illustrations/WorldMap';
import { ArrowRight, PinIcon, PlaneIcon } from '../components/Icons';
import { dur, REDUCED_MOTION } from '../motion';

export function JourneyScene({ onNext }: { onNext: () => void }) {
  const rootRef = useSceneEnter<HTMLElement>();
  const routeRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const route = routeRef.current;
    const plane = planeRef.current;
    if (!root || !route || !plane) return;

    const length = route.getTotalLength();
    route.style.strokeDasharray = `${length}`;
    route.style.strokeDashoffset = `${length}`;

    const flight = { t: 0 };

    const applyPlane = () => {
      const point = flightPoint(flight.t);
      const tangent = flightTangent(flight.t);
      const angle = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI + 180;
      const bob = Math.sin(flight.t * Math.PI * 6) * 2.4;
      plane.setAttribute('transform', `translate(${point.x} ${point.y + bob}) rotate(${angle})`);

      if (statusRef.current) {
        const t = flight.t;
        statusRef.current.textContent =
          t < 0.04
            ? 'Preparing for takeoff'
            : t < 0.18
              ? 'Lifting off from Dubai'
              : t < 0.72
                ? 'Cruising over the Atlantic'
                : t < 0.94
                  ? 'Descending into Paris'
                  : 'Welcome to Paris';
      }
      if (pctRef.current) {
        pctRef.current.textContent = `${Math.round(flight.t * 100)}%`;
      }
    };

    applyPlane();

    if (REDUCED_MOTION) {
      route.style.strokeDashoffset = '0';
      flight.t = 1;
      applyPlane();
      setArrived(true);
      return;
    }

    const mapCard = root.querySelector<HTMLElement>('.map-card');
    const pins = root.querySelectorAll<SVGElement>('.map-pin');
    const clouds = root.querySelectorAll<SVGElement>('.map-cloud');

    const tl: Timeline = createTimeline({ defaults: { ease: 'outCubic' } });

    if (mapCard) {
      tl.add(mapCard, { opacity: [0, 1], translateY: [26, 0], duration: dur(900) });
    }
    if (clouds.length) {
      tl.add(
        clouds,
        {
          opacity: [0, 0.8],
          translateX: [0, 26],
          duration: dur(1500),
          delay: stagger(dur(80)),
          ease: 'outQuad',
        },
        300,
      );
    }
    if (pins.length) {
      tl.add(
        pins,
        {
          opacity: [0, 1],
          translateY: [10, 0],
          duration: dur(720),
          delay: stagger(dur(140)),
          ease: 'outBack',
        },
        380,
      );
    }

    tl.add(
      route,
      {
        strokeDashoffset: [length, 0],
        duration: dur(4800),
        ease: 'inOutSine',
      },
      dur(1000),
    )
      .add(
        flight,
        {
          t: [0, 1],
          duration: dur(4800),
          ease: 'inOutSine',
          onRender: applyPlane,
        },
        dur(1000),
      )
      .call(() => setArrived(true), dur(1000) + dur(4800) + dur(260));

    return () => {
      tl.revert();
    };
  }, [rootRef]);

  useEffect(() => {
    if (!arrived) return;
    const el = ctaRef.current;
    if (!el) return;
    if (REDUCED_MOTION) {
      el.style.opacity = '1';
      return;
    }
    const tl = createTimeline();
    tl.add(el, { opacity: [0, 1], translateY: [18, 0], duration: dur(720), ease: 'outBack' });
    return () => {
      tl.revert();
    };
  }, [arrived]);

  return (
    <section className="scene" ref={rootRef} aria-labelledby="journey-title">
      <div className="scene__inner scene__inner--wide">
        <div className="journey__head">
          <div className="journey__head-copy">
            <p className="eyebrow" data-anim>
              Chapter two · The journey
            </p>
            <h2 className="display journey__title" id="journey-title" data-anim>
              A small parcel. An <em>11,000 km</em> journey.
            </h2>
          </div>
          <p className="lede" data-anim style={{ maxWidth: '34ch', margin: 0 }}>
            Across deserts, seas and skies — following a little golden trail all the way to you.
          </p>
        </div>

        <div className="map-card">
          <div className="map-card__top">
            <div className="map-status">
              <span className="map-status__dot" />
              <span ref={statusRef}>Preparing for takeoff</span>
            </div>
            <div className="map-pct" ref={pctRef}>
              0%
            </div>
          </div>
          <WorldMap planeRef={planeRef} routeRef={routeRef} />
        </div>

        <div className="journey__footer">
          <div className="journey__meta">
            <span className="journey__meta-item" data-anim>
              <PinIcon />
              Dubai
            </span>
            <span className="journey__meta-item" data-anim>
              <PlaneIcon />
              11,000 km · direct flight
            </span>
            <span className="journey__meta-item" data-anim>
              <PinIcon />
              Paris
            </span>
          </div>

          {arrived && (
            <div className="journey__cta" ref={ctaRef} style={{ opacity: 0 }}>
              <button className="btn" type="button" onClick={onNext}>
                Continue to Paris
                <ArrowRight className="btn__arrow" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
