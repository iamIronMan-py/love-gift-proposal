import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FlightCanvas, type FlightHandle } from './FlightCanvas';
import { GiftBox3D } from './GiftBox3D';
import { Envelope } from '../components/illustrations/Envelope';
import { GiftParcel } from '../components/illustrations/GiftParcel';
import { Garden } from '../components/illustrations/Garden';
import { PinIcon, PlaneIcon } from '../components/Icons';
import { GIFT } from '../config';
import './experience.css';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  { at: 0, name: 'Something special' },
  { at: 11, name: 'Wrapped in Dubai' },
  { at: 25, name: 'The journey' },
  { at: 57, name: 'A garden in bloom' },
  { at: 69, name: 'Arrived in Canada' },
  { at: 81, name: 'The ribbon' },
  { at: 93, name: 'Delivered with love' },
];

const PETALS = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37.7 + 4) % 100,
  size: 7 + (i % 5) * 3.4,
  drift: ((i * 53) % 150) - 75,
  rotate: (i * 47) % 360,
  duration: 11 + (i % 6) * 1.2,
  delay: (i % 8) * 0.35,
  color: ['#f7cdd8', '#d8ccf4', '#fbe8c9', '#c4ddca', '#fbd3c2'][i % 5],
}));

export function Experience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<FlightHandle>(null);
  const chapterNumRef = useRef<HTMLSpanElement>(null);
  const chapterNameRef = useRef<HTMLSpanElement>(null);
  const distanceRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const flightBarRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const q = gsap.utils.selector(root);

    const updateChapter = (progress: number) => {
      const time = progress * 100;
      let index = 0;
      CHAPTERS.forEach((chapter, i) => {
        if (time >= chapter.at) index = i;
      });
      if (chapterNumRef.current) chapterNumRef.current.textContent = String(index + 1).padStart(2, '0');
      if (chapterNameRef.current) chapterNameRef.current.textContent = CHAPTERS[index].name;
    };

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reduced ? true : 0.55,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateChapter(self.progress),
        },
      });

      const copyIn = (selector: string, at: number, stagger = 0.07) => {
        timeline.fromTo(
          q(`${selector} [data-copy]`),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 2.6,
            stagger,
            ease: 'power3.out',
          },
          at,
        );
      };

      const copyOut = (selector: string, at: number, stagger = 0.045) => {
        timeline.to(
          q(`${selector} [data-copy]`),
          {
            opacity: 0,
            y: -30,
            duration: 1.9,
            stagger,
            ease: 'power2.in',
          },
          at,
        );
      };

      // Global chrome.
      timeline.fromTo('[data-progress]', { scaleX: 0 }, { scaleX: 1, duration: 100 }, 0);
      timeline.to('[data-scroll-hint]', { opacity: 0, y: 14, duration: 2 }, 1.4);
      updateChapter(0);

      // 00 — Something special.
      timeline
        .to('[data-envelope]', { y: -54, rotate: -2, scale: 1.03, duration: 7.6, ease: 'sine.inOut' }, 0)
        .to('[data-envelope]', { opacity: 0, y: -170, rotate: -9, scale: 1.08, duration: 2.6, ease: 'power2.in' }, 7.8)
        .to('.chapter--intro [data-copy]', { opacity: 0, y: -42, duration: 2, stagger: 0.05, ease: 'power2.in' }, 7.4);

      // 01 — Wrapped in Dubai.
      timeline.to('[data-sky="dawn"]', { opacity: 0.9, duration: 6 }, 9);
      copyIn('.chapter--dubai', 9.5);
      copyOut('.chapter--dubai', 21.3);
      timeline
        .fromTo(
          '[data-parcel]',
          { opacity: 0, y: -260, rotate: -11, scale: 0.82 },
          { opacity: 1, y: 0, rotate: 0, scale: 1, duration: 5.4, ease: 'power3.out' },
          9.4,
        )
        .to('[data-parcel]', { y: -16, rotate: 1.5, duration: 5, ease: 'sine.inOut' }, 15)
        .to('[data-parcel]', { opacity: 0, y: 90, rotate: 7, scale: 0.9, duration: 2.4, ease: 'power2.in' }, 21.2);

      // 02 — The journey.
      timeline.to('.hud', { color: '#fff8f2', duration: 2 }, 21);
      const flight = { t: 0 };
      const flightStatus = (t: number) => {
        if (t < 0.04) return 'Preparing for takeoff';
        if (t < 0.2) return 'Lifting off from Dubai';
        if (t < 0.72) return 'Cruising over the Atlantic';
        if (t < 0.94) return 'Descending into Canada';
        return 'Touchdown, Canada';
      };
      const onFlight = () => {
        flightRef.current?.setProgress(flight.t);
        if (distanceRef.current) {
          distanceRef.current.textContent = `${Math.round(flight.t * 11000).toLocaleString('en-US')} km`;
        }
        if (statusRef.current) statusRef.current.textContent = flightStatus(flight.t);
        if (flightBarRef.current) flightBarRef.current.style.transform = `scaleX(${flight.t})`;
      };

      timeline.to('[data-sky="flight"]', { opacity: 1, duration: 4 }, 21);
      timeline.to('[data-sky="dawn"]', { opacity: 0, duration: 4 }, 21);
      timeline.fromTo('[data-flight]', { opacity: 0 }, { opacity: 1, duration: 3 }, 22.4);
      timeline.fromTo('[data-flight]', { scale: 1.06 }, { scale: 1, duration: 34, ease: 'sine.inOut' }, 23);
      timeline.to('[data-flight]', { opacity: 0, duration: 2.6 }, 53.8);
      copyIn('.chapter--journey', 23);
      copyOut('.chapter--journey', 28.4);
      timeline.fromTo('[data-flight-hud]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 2 }, 24);
      timeline.to('[data-flight-hud]', { opacity: 0, y: 12, duration: 2 }, 52.6);
      timeline.to(
        flight,
        {
          t: 1,
          duration: 32,
          ease: 'power1.inOut',
          onUpdate: onFlight,
          onStart: onFlight,
          onReverseComplete: onFlight,
        },
        23,
      );
      timeline.call(onFlight, undefined, 23);
      timeline.call(onFlight, undefined, 55.2);

      // 03 — A garden in bloom.
      timeline.to('.hud', { color: '#2b2028', duration: 2 }, 54.6);
      timeline.to('[data-sky="flight"]', { opacity: 0, duration: 3 }, 54.5);
      timeline.to('[data-sky="garden"]', { opacity: 1, duration: 4 }, 54.8);
      copyIn('.chapter--bloom', 56.6);
      copyOut('.chapter--bloom', 65.9);
      timeline.fromTo(
        '[data-garden]',
        { opacity: 0, y: 50, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 3.4, ease: 'power2.out' },
        55.4,
      );
      timeline.fromTo(
        q('[data-garden] .flower'),
        { scale: 0.06, opacity: 0, svgOrigin: '0 0' },
        { scale: 1, opacity: 1, duration: 5.6, stagger: 0.3, ease: 'power2.out' },
        56.2,
      );
      timeline.fromTo(
        '[data-garden] .puppy-pop',
        { opacity: 0, y: 64, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 4.2, ease: 'power3.out' },
        58.6,
      );
      timeline.fromTo(
        '[data-garden] .garden__butterfly, [data-garden] .garden__sparkle',
        { opacity: 0 },
        { opacity: 1, duration: 3.4, stagger: 0.08, ease: 'power2.out' },
        60,
      );
      timeline.to('[data-garden]', { opacity: 0, y: 48, scale: 1.04, duration: 2.8, ease: 'power2.in' }, 66.4);

      // 04 — Arrived in Canada.
      timeline.to('[data-sky="garden"]', { opacity: 0, duration: 3 }, 67.4);
      timeline.to('[data-sky="canada"]', { opacity: 1, duration: 4 }, 67.7);
      copyIn('.chapter--arrival', 68.6);
      copyOut('.chapter--arrival', 78.2);
      timeline.fromTo('[data-arrival]', { opacity: 0 }, { opacity: 1, duration: 1.4 }, 68.1);
      timeline
        .fromTo(
          '[data-arrival-parcel]',
          { opacity: 0, y: -300, rotate: -9, scale: 0.84 },
          { opacity: 1, y: 0, rotate: 0, scale: 1, duration: 4.6, ease: 'power3.out' },
          68.4,
        )
        .fromTo(
          '[data-arrival-card]',
          { opacity: 0, y: 28, rotate: -9 },
          { opacity: 1, y: 0, rotate: -3, duration: 2.6, ease: 'power3.out' },
          71.2,
        )
        .fromTo(
          '[data-arrival-stamp]',
          { opacity: 0, scale: 0.35, rotate: -38 },
          { opacity: 1, scale: 1, rotate: -12, duration: 2.1, ease: 'power3.out' },
          72.6,
        )
        .to('[data-arrival]', { opacity: 0, y: 52, scale: 0.97, duration: 2.4, ease: 'power2.in' }, 79.4);

      // 05 — The ribbon.
      timeline.to('.hud', { color: '#fff8f2', duration: 2 }, 79.4);
      timeline.to('[data-sky="canada"]', { opacity: 0, duration: 3 }, 79.6);
      timeline.to('[data-sky="studio"]', { opacity: 1, duration: 4.5 }, 79.9);
      copyIn('.chapter--unbox', 80.8);
      copyOut('.chapter--unbox', 88.6);
      timeline.fromTo(
        '[data-box-stage]',
        { opacity: 0, y: 90, scale: 0.82 },
        { opacity: 1, y: 0, scale: 1, duration: 3.8, ease: 'power3.out' },
        80.6,
      );
      timeline.fromTo(
        '[data-box-float]',
        { rotationY: -38, rotationX: -26, y: 6 },
        { rotationY: -14, rotationX: -8, y: -12, scale: 1.1, duration: 12, ease: 'sine.inOut' },
        81,
      );
      timeline.to(q('[data-box] .box3d__ribbon'), { opacity: 0, y: -14, duration: 2.6, ease: 'power2.in' }, 84.8);
      timeline.to(
        '[data-box-lid]',
        { z: 135, rotationX: -40, rotationZ: -7, duration: 5.4, ease: 'power3.inOut' },
        85.2,
      );
      timeline.fromTo(
        '[data-box-glow]',
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1.3, duration: 4.4, ease: 'power2.out' },
        85.4,
      );
      timeline.fromTo(
        '[data-box-contents]',
        { opacity: 0, scale: 0.35, y: 70 },
        { opacity: 1, scale: 1.04, y: -34, duration: 5, ease: 'power3.out' },
        85.6,
      );
      timeline.to('[data-box-stage]', { opacity: 0, y: -60, scale: 1.03, duration: 2.6, ease: 'power2.in' }, 92.2);

      // 06 — Delivered with love.
      timeline.to('.hud', { color: '#2b2028', duration: 2 }, 92.5);
      timeline.to('[data-sky="studio"]', { opacity: 0, duration: 3 }, 92.4);
      timeline.to('[data-sky="finale"]', { opacity: 1, duration: 4.5 }, 92.7);
      copyIn('.chapter--finale', 92.9);
      timeline.to(
        '[data-garden]',
        { opacity: 1, y: 0, scale: 1.02, duration: 3.6, ease: 'power2.out' },
        92.9,
      );
      timeline.fromTo('[data-petals]', { opacity: 0 }, { opacity: 1, duration: 2.2 }, 93.2);
      timeline.fromTo(
        '[data-petals] span',
        { y: -90, opacity: 0.9, rotate: 0 },
        {
          y: () => window.innerHeight * 1.18,
          x: (index: number) => PETALS[index].drift,
          rotate: (index: number) => PETALS[index].rotate + 220,
          duration: (index: number) => 3.8 + (index % 5) * 0.3,
          stagger: 0.06,
          ease: 'none',
        },
        93.2,
      );
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const fontRefresh = document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      void fontRefresh;
      ctx.revert();
    };
  }, []);

  return (
    <div className="exp" ref={rootRef}>
      <div className="exp__stage">
        <div className="backdrop" aria-hidden="true">
          <div className="sky sky--dawn is-on" data-sky="dawn" />
          <div className="sky sky--flight" data-sky="flight" />
          <div className="sky sky--garden" data-sky="garden" />
          <div className="sky sky--canada" data-sky="canada" />
          <div className="sky sky--studio" data-sky="studio" />
          <div className="sky sky--finale" data-sky="finale" />
          <div className="backdrop__aura" />
          <div className="backdrop__vignette" />
          <div className="backdrop__grain" />
        </div>

        <div className="flight" data-flight>
          <FlightCanvas ref={flightRef} />
        </div>

        <div className="objects" aria-hidden="true">
          <div className="object object--envelope">
            <div className="object__inner" data-envelope>
              <Envelope />
            </div>
          </div>

          <div className="object object--parcel">
            <div className="object__inner" data-parcel>
              <GiftParcel />
            </div>
          </div>

          <div className="object object--garden">
            <div className="object__inner" data-garden>
              <Garden puppyParcel />
            </div>
          </div>

          <div className="object object--arrival">
            <div className="object__inner arrival-scene" data-arrival>
              <div className="arrival-scene__glow" />
              <div className="arrival-scene__parcel" data-arrival-parcel>
                <GiftParcel />
              </div>
              <div className="delivery-card" data-arrival-card>
                <div className="delivery-card__top">
                  <span>Express</span>
                  <span>Handle with love</span>
                </div>
                <div className="delivery-card__code">DXB → YYZ</div>
                <div className="delivery-card__line" />
                <p className="delivery-card__note">For you, with all my love.</p>
              </div>
              <div className="delivery-stamp" data-arrival-stamp>
                Delivered
                <br />
                with love
                <br />
                Canada
              </div>
            </div>
          </div>

          <div className="object object--box">
            <div className="object__inner" data-box-stage>
              <GiftBox3D />
            </div>
          </div>
        </div>

        <div className="petals" data-petals aria-hidden="true">
          {PETALS.map((petal, i) => (
            <span
              key={i}
              style={{
                left: `${petal.left}%`,
                width: petal.size,
                height: petal.size * 0.72,
                background: petal.color,
              }}
            />
          ))}
        </div>

        <main className="copy">
          <section className="chapter chapter--intro" aria-labelledby="intro-title">
            <div className="copy__block copy__block--left">
              <p className="eyebrow" data-copy>
                A little surprise, wrapped with love
              </p>
              <h1 className="display" id="intro-title">
                <span className="line" data-copy>
                  Something <em>special</em>
                </span>
                <span className="line" data-copy>
                  is on its way...
                </span>
              </h1>
              <p className="lede" data-copy>
                It began in Dubai, among warm golden evenings and quiet wishes. Now it is crossing
                oceans and skies — travelling a very long way just to make you smile.
              </p>
              <div className="scroll-hint" data-scroll-hint>
                <span className="scroll-hint__line" />
                Scroll to begin
              </div>
            </div>
          </section>

          <section className="chapter chapter--dubai" aria-labelledby="dubai-title">
            <div className="copy__block copy__block--left">
              <p className="eyebrow" data-copy>
                Chapter one · Wrapped in Dubai
              </p>
              <h2 className="display" id="dubai-title" data-copy>
                First, a little <em>something</em> was wrapped just for you.
              </h2>
              <p className="lede" data-copy>
                Ribbons tied by hand, a tag written with care, and a tiny parcel carrying far more
                love than it looks like it could hold.
              </p>
              <div className="shipping" data-copy>
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
            </div>
          </section>

          <section className="chapter chapter--journey" aria-labelledby="journey-title">
            <div className="copy__block copy__block--center">
              <p className="eyebrow" data-copy>
                Chapter two · The journey
              </p>
              <h2 className="display" id="journey-title" data-copy>
                A small parcel. An <em>11,000 km</em> journey.
              </h2>
              <p className="lede" data-copy>
                Across deserts, seas and skies — following a little golden trail all the way to you.
              </p>
            </div>
          </section>

          <section className="chapter chapter--bloom" aria-labelledby="bloom-title">
            <div className="copy__block copy__block--left">
              <p className="eyebrow" data-copy>
                Chapter three · A garden in bloom
              </p>
              <h2 className="display" id="bloom-title" data-copy>
                Some things <em>bloom</em> when they are meant for you.
              </h2>
              <p className="lede" data-copy>
                The flowers seemed to know you were waiting. And someone very small and very excited
                came along to make sure your gift arrived safely.
              </p>
            </div>
          </section>

          <section className="chapter chapter--arrival" aria-labelledby="arrival-title">
            <div className="copy__block copy__block--left">
              <p className="eyebrow" data-copy>
                Chapter four · Arrived in Canada
              </p>
              <h2 className="display" id="arrival-title" data-copy>
                Touchdown, Canada. <em>Your gift is here.</em>
              </h2>
              <p className="lede" data-copy>
                A soft little landing, a parcel on the doorstep, and a tag that says it all: handle
                with love. It has come such a long way to reach you.
              </p>
            </div>
          </section>

          <section className="chapter chapter--unbox" aria-labelledby="unbox-title">
            <div className="copy__block copy__block--center">
              <p className="eyebrow" data-copy>
                Chapter five · The ribbon
              </p>
              <h2 className="display" id="unbox-title" data-copy>
                One little ribbon between you and <em>your surprise.</em>
              </h2>
              <p className="lede" data-copy>
                Take a breath, make a wish, and open it slowly. It has been waiting a very long time
                to meet you.
              </p>
            </div>
          </section>

          <section className="chapter chapter--finale" aria-labelledby="finale-title">
            <div className="copy__block copy__block--center">
              <p className="eyebrow" data-copy>
                Chapter six · Delivered with love
              </p>
              <h2 className="display" id="finale-title" data-copy>
                A little love, all the way from <em>Dubai.</em>
              </h2>
              <p className="lede" data-copy>
                I hope this made you smile. You deserve soft days, fresh flowers, and a tiny golden
                friend who is always happy to see you.
              </p>
              <p className="signature" data-copy>
                {GIFT.recipient
                  ? `For ${GIFT.recipient}, ${GIFT.signature.toLowerCase()}.`
                  : `${GIFT.signature}.`}
              </p>
            </div>
          </section>
        </main>

        <div className="hud" aria-hidden="true">
          <div className="hud__top">
            <div className="hud__brand">
              <span className="hud__mark" />
              Something special
            </div>
            <div className="hud__chapter">
              <span ref={chapterNumRef}>01</span>
              <span className="hud__chapter-line" />
              <span ref={chapterNameRef}>Something special</span>
            </div>
          </div>

          <div className="hud__flight" data-flight-hud>
            <div className="hud__flight-row">
              <span className="hud__flight-route">DXB → YYZ</span>
              <span className="hud__flight-distance" ref={distanceRef}>
                0 km
              </span>
            </div>
            <div className="hud__flight-status" ref={statusRef}>
              Preparing for takeoff
            </div>
            <div className="hud__flight-bar">
              <span ref={flightBarRef} />
            </div>
          </div>

          <div className="hud__bottom">
            <span className="hud__meta">
              <PinIcon />
              Dubai
            </span>
            <div className="hud__progress">
              <span className="hud__progress-fill" data-progress />
            </div>
            <span className="hud__meta">
              <PlaneIcon />
              Canada
            </span>
          </div>
        </div>
      </div>

      <div className="exp__track" ref={trackRef} aria-hidden="true" />
    </div>
  );
}
