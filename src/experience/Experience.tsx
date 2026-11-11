import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { FlightCanvas, type FlightHandle } from './FlightCanvas';
import { GiftBox3D } from './GiftBox3D';
import { Envelope } from '../components/illustrations/Envelope';
import { GiftParcel } from '../components/illustrations/GiftParcel';
import { Garden } from '../components/illustrations/Garden';
import { Airplane } from '../components/illustrations/Airplane';
import { Bouquet } from '../components/illustrations/Bouquet';
import { Puppy } from '../components/illustrations/Puppy';
import { PinIcon, PlaneIcon } from '../components/Icons';
import { GIFT } from '../config';
import { storyAudio } from './audio';
import './experience.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const GATE_LABELS = [
  'Open the letter',
  'Seal the parcel',
  'Load the gift & take off',
  'Meet your little friend',
  'Meet her at the door',
  'Open the gift',
  'Celebrate',
];

const CHAPTERS = [
  { at: 0, name: 'A little surprise' },
  { at: 11, name: 'Wrapped in Dubai' },
  { at: 25, name: 'The journey' },
  { at: 57, name: 'A garden in bloom' },
  { at: 69, name: 'Arrived in Paris' },
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
  color: ['#b3122f', '#8b6bd1', '#e0405a', '#a58ae0', '#c9184a'][i % 5],
}));

const BLOOM_FLIGHT = [
  { left: 4, top: 82, size: 'near', rotate: -16, delay: 0 },
  { left: 20, top: 90, size: 'mid', rotate: 9, delay: 0.1 },
  { left: 34, top: 58, size: 'mid', rotate: 13, delay: 0.18 },
  { left: 61, top: 32, size: 'far', rotate: -8, delay: 0.26 },
  { left: 82, top: 26, size: 'mid', rotate: 16, delay: 0.12 },
  { left: 12, top: 70, size: 'far', rotate: -5, delay: 0.32 },
  { left: 28, top: 72, size: 'near', rotate: 7, delay: 0.2 },
  { left: 68, top: 66, size: 'mid', rotate: -12, delay: 0.28 },
  { left: 88, top: 74, size: 'near', rotate: 18, delay: 0.36 },
  { left: 96, top: 50, size: 'far', rotate: -18, delay: 0.22 },
] as const;

const BURST_BOUQUETS = [
  { left: 31, top: 50, width: 24, rotate: -24, x: -18, y: 8 },
  { left: 69, top: 42, width: 22, rotate: 18, x: 20, y: -8 },
  { left: 54, top: 79, width: 20, rotate: 8, x: -10, y: 18 },
  { left: 82, top: 75, width: 18, rotate: -12, x: 16, y: 14 },
] as const;

export function Experience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<FlightHandle>(null);
  const chapterNumRef = useRef<HTMLSpanElement>(null);
  const chapterNameRef = useRef<HTMLSpanElement>(null);
  const distanceRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const flightBarRef = useRef<HTMLSpanElement>(null);
  const gateLabelRef = useRef<HTMLSpanElement>(null);
  const gateActionRef = useRef<() => void>(() => {});
  const celebrationRef = useRef<HTMLDivElement>(null);
  const cutsceneRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<(progress: number) => void>(() => {});
  const celebrateRef = useRef<() => void>(() => {});
  const cuddleRef = useRef<() => void>(() => {});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleGate = () => {
    storyAudio.unlock();
    if (!document.fullscreenElement && window.innerWidth > 700) toggleFullscreen();
    gateActionRef.current();
  };

  const toggleFullscreen = () => {
    const doc = document as Document & { webkitFullscreenElement?: Element };
    if (document.fullscreenElement || doc.webkitFullscreenElement) {
      if (document.exitFullscreen) void document.exitFullscreen();
      return;
    }
    const root = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    const request = root.requestFullscreen?.bind(root) ?? root.webkitRequestFullscreen?.bind(root);
    if (request) {
      Promise.resolve(request()).catch(() => undefined);
    }
  };

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const q = gsap.utils.selector(root);
    let lastIndex = 0;

    const scrollToProgress = (progress: number) => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      gsap.to(window, {
        scrollTo: { y: distance * progress, autoKill: false },
        duration: reduced ? 0.01 : 1.7,
        ease: 'power2.inOut',
        overwrite: true,
      });
    };
    scrollRef.current = scrollToProgress;

    const addTemporaryClass = (name: string, duration: number) => {
      root.classList.remove(name);
      void root.offsetWidth;
      root.classList.add(name);
      window.setTimeout(() => root.classList.remove(name), duration);
    };
    cuddleRef.current = () => addTemporaryClass('is-cuddling', 2400);

    const cutsceneTimers: number[] = [];
    const playCutscene = (
      scene: 'runway' | 'door',
      duration: number,
      done: () => void,
    ) => {
      const node = cutsceneRef.current;
      if (!node || node.dataset.active === 'true') return;
      node.dataset.scene = scene;
      node.dataset.active = 'true';
      root.classList.add('is-cinema');
      document.documentElement.classList.add('is-cinema');
      const finish = () => {
        node.dataset.active = 'false';
        root.classList.remove('is-cinema');
        document.documentElement.classList.remove('is-cinema');
        cutsceneTimers.push(window.setTimeout(done, 380));
      };
      cutsceneTimers.push(window.setTimeout(finish, duration));
    };

    const spawnCelebration = () => {
      const layer = celebrationRef.current;
      if (!layer) return;
      layer.replaceChildren();
      const colors = ['#b3122f', '#8b6bd1', '#e0405a', '#a58ae0', '#c9184a', '#c9b6f2'];
      const count = reduced ? 12 : 46;
      for (let i = 0; i < count; i += 1) {
        const piece = document.createElement('span');
        const size = 6 + Math.random() * 9;
        piece.className = 'confetti';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.width = `${size}px`;
        piece.style.height = `${size * (0.45 + Math.random() * 0.7)}px`;
        piece.style.background = colors[i % colors.length];
        piece.style.animationDelay = `${Math.random() * 0.6}s`;
        piece.style.animationDuration = `${2.2 + Math.random() * 1.8}s`;
        piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 220}px`);
        piece.style.setProperty('--spin', `${Math.random() * 720 - 360}deg`);
        layer.appendChild(piece);
      }
      window.setTimeout(() => layer.replaceChildren(), 5200);
    };
    celebrateRef.current = spawnCelebration;

    const gateActions: Array<() => void> = [
      () => {
        storyAudio.play('pop');
        scrollToProgress(0.155);
      },
      () => {
        storyAudio.play('whoosh');
        scrollToProgress(0.265);
      },
      () => {
        storyAudio.unlock();
        storyAudio.play('takeoff');
        addTemporaryClass('is-taking-off', 2100);
        [0, 2200, 4800, 7600].forEach((delay, i) => {
          cutsceneTimers.push(
            window.setTimeout(() => storyAudio.setFlight(0.08 + i * 0.17), delay),
          );
        });
        cutsceneTimers.push(window.setTimeout(() => storyAudio.play('clunk'), 3000));
        cutsceneTimers.push(window.setTimeout(() => storyAudio.play('loader'), 4200));
        playCutscene('runway', 11800, () => scrollToProgress(0.31));
      },
      () => {
        storyAudio.play('bark');
        addTemporaryClass('is-cuddling', 2400);
        scrollToProgress(0.695);
      },
      () => {
        storyAudio.play('landing');
        storyAudio.setFlight(null);
        playCutscene('door', 8200, () => {
          storyAudio.play('bark');
          scrollToProgress(0.81);
        });
      },
      () => {
        storyAudio.play('open');
        spawnCelebration();
        scrollToProgress(0.935);
      },
      () => {
        storyAudio.play('bark');
        storyAudio.play('celebrate');
        addTemporaryClass('is-cuddling', 2400);
        spawnCelebration();
      },
    ];

    const updateChapter = (progress: number) => {
      const time = progress * 100;
      let index = 0;
      CHAPTERS.forEach((chapter, i) => {
        if (time >= chapter.at) index = i;
      });
      root.dataset.chapter = String(index);
      if (time < 21 || time > 56) storyAudio.setFlight(null);
      if (chapterNumRef.current) chapterNumRef.current.textContent = String(index + 1).padStart(2, '0');
      if (chapterNameRef.current) chapterNameRef.current.textContent = CHAPTERS[index].name;
      if (gateLabelRef.current) gateLabelRef.current.textContent = GATE_LABELS[index];
      gateActionRef.current = gateActions[index];
      if (index !== lastIndex) {
        const cues = ['pop', 'whoosh', 'chime', 'landing', 'bark', 'open', 'celebrate'] as const;
        if (index > lastIndex) storyAudio.play(cues[index]);
        lastIndex = index;
      }
    };

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reduced ? true : 0.55,
          fastScrollEnd: true,
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
        if (t < 0.94) return 'Descending into Paris';
        return 'Touchdown, Paris';
      };
      const onFlight = () => {
        flightRef.current?.setProgress(flight.t);
        storyAudio.setFlight(flight.t);
        if (distanceRef.current) {
          distanceRef.current.textContent = `${Math.round(flight.t * 6700).toLocaleString('en-US')} km`;
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
        q('[data-garden] .garden .flower'),
        { scale: 0.06, opacity: 0, svgOrigin: '0 0' },
        { scale: 1, opacity: 1, duration: 5.6, stagger: 0.3, ease: 'power2.out' },
        56.2,
      );
      const bloomItems = q('[data-bloom-item]');
      if (reduced) {
        timeline.set(bloomItems, { opacity: 1, x: 0, y: 0, scale: 1 }, 55.8);
      } else {
        timeline.fromTo(
          bloomItems,
          {
            opacity: 0,
            x: (index: number) => (index % 2 === 0 ? -window.innerWidth * 0.55 : window.innerWidth * 0.55),
            y: (index: number) => ((index % 3) - 1) * window.innerHeight * 0.42,
            scale: 0.52,
            rotation: (index: number) => BLOOM_FLIGHT[index].rotate - 34,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: (index: number) => BLOOM_FLIGHT[index].rotate,
            duration: 4.4,
            stagger: 0.12,
            ease: 'power3.out',
          },
          55.8,
        );
      }
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
      timeline.to('[data-bloom-flight]', { opacity: 0, duration: 1.8, ease: 'power2.in' }, 66.2);

      // 04 — Arrived in Paris.
      timeline.to('[data-sky="garden"]', { opacity: 0, duration: 3 }, 67.4);
      timeline.to('[data-sky="paris"]', { opacity: 1, duration: 4 }, 67.7);
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
      timeline.to('[data-sky="paris"]', { opacity: 0, duration: 3 }, 79.6);
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
        {
          x: () => (window.innerWidth < 700 ? 54 : 118),
          y: -46,
          z: 96,
          rotationX: -44,
          rotationZ: 15,
          opacity: 0,
          duration: 5.4,
          ease: 'power3.inOut',
        },
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
        { opacity: 0, scale: 0.32, y: 92 },
        { opacity: 1, scale: 0.85, y: -20, duration: 5, ease: 'power3.out' },
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
      const burstItems = q('[data-burst-item]');
      if (reduced) {
        timeline.set(burstItems, { opacity: 1, x: 0, y: 0, scale: 1 }, 92);
      } else {
        timeline.fromTo(
          burstItems,
          { opacity: 0, x: 0, y: 0, scale: 0.24, rotation: 0 },
          {
            opacity: 1,
            x: (index: number) => BURST_BOUQUETS[index].x,
            y: (index: number) => BURST_BOUQUETS[index].y,
            scale: 1,
            rotation: (index: number) => BURST_BOUQUETS[index].rotate,
            duration: 3.4,
            stagger: 0.12,
            ease: 'power3.out',
          },
          92,
        );
      }
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
      cutsceneTimers.forEach((id) => window.clearTimeout(id));
      void fontRefresh;
      ctx.revert();
    };
  }, []);

  return (
    <div className="exp" ref={rootRef} onPointerDown={() => storyAudio.unlock()}>
      <div className="exp__stage">
        <div className="backdrop" aria-hidden="true">
          <div className="sky sky--dawn is-on" data-sky="dawn" />
          <div className="sky sky--flight" data-sky="flight" />
          <div className="sky sky--garden" data-sky="garden" />
          <div className="sky sky--paris" data-sky="paris" />
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

          <div
            className="object object--parcel"
            onClick={() => {
              storyAudio.unlock();
              storyAudio.play('pop');
              scrollRef.current(0.265);
            }}
          >
            <div className="object__inner" data-parcel>
              <GiftParcel />
            </div>
          </div>

          <div
            className="object object--garden"
            onClick={() => {
              storyAudio.unlock();
              storyAudio.play('bark');
              cuddleRef.current();
            }}
          >
            <div className="object__inner" data-garden>
              <Garden puppyParcel />
            </div>
          </div>

          <div className="bloom-flight" data-bloom-flight aria-hidden="true">
            {BLOOM_FLIGHT.map((item, index) => (
              <div
                key={index}
                className={`bloom-flight__item bloom-flight__item--${item.size}`}
                data-bloom-item
                style={{
                  left: `${item.left}%`,
                  top: `${item.top}%`,
                }}
              >
                <Bouquet compact bare className="bloom-flight__bouquet" />
              </div>
            ))}
          </div>

          <div
            className="object object--arrival"
            onClick={() => {
              storyAudio.unlock();
              storyAudio.play('pop');
              scrollRef.current(0.81);
            }}
          >
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
                <div className="delivery-card__code">DXB → ORY</div>
                <div className="delivery-card__line" />
                <p className="delivery-card__note">For you, with all my love.</p>
              </div>
              <div className="delivery-stamp" data-arrival-stamp>
                Delivered
                <br />
                with love
                <br />
                Paris
              </div>
            </div>
          </div>

          <div
            className="object object--box"
            onClick={() => {
              storyAudio.unlock();
              storyAudio.play('open');
              celebrateRef.current();
            }}
          >
            <div className="object__inner" data-box-stage>
              <GiftBox3D />
            </div>
            <div className="bouquet-burst" data-bouquet-burst aria-hidden="true">
              {BURST_BOUQUETS.map((item, index) => (
                <div
                  key={index}
                  className="bouquet-burst__item"
                  data-burst-item
                  style={{
                    left: `${item.left}%`,
                    top: `${item.top}%`,
                    width: `${item.width}%`,
                  }}
                >
                  <Bouquet compact={index > 1} bare className="bouquet-burst__bouquet" />
                </div>
              ))}
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
                  A little <em>surprise</em>
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
                  <span className="shipping__value">Paris</span>
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
                A small parcel. A <em>6,700 km</em> journey.
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
                Chapter four · Arrived in Paris
              </p>
              <h2 className="display" id="arrival-title" data-copy>
                Touchdown, Paris. <em>Your gift is here.</em>
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
            <div className="hud__chapter">
              <span ref={chapterNumRef}>01</span>
              <span className="hud__chapter-line" />
              <span ref={chapterNameRef}>A little surprise</span>
            </div>
          </div>

          <div className="hud__flight" data-flight-hud>
            <div className="hud__flight-row">
              <span className="hud__flight-route">DXB → ORY</span>
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
              Paris
            </span>
          </div>
        </div>

        <div className="story-gate">
          <button className="story-gate__btn" type="button" onClick={handleGate}>
            <span ref={gateLabelRef}>Open the letter</span>
            <span className="story-gate__arrow" aria-hidden="true">
              &rarr;
            </span>
          </button>
        </div>

        <button
          className="fullscreen-toggle"
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M9 20H5a1 1 0 0 1-1-1v-4M15 20h4a1 1 0 0 0 1-1v-4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" />
            </svg>
          )}
        </button>

        <div className="cutscene" ref={cutsceneRef} data-active="false" aria-hidden="true">
          <div className="cutscene__veil" />
          <div className="cutscene__scene cutscene__scene--runway">
            <div className="runway">
              <div className="runway__sky" />
              <div className="runway__haze" />
              <div className="runway__ground">
                <div className="runway__centreline" aria-hidden="true">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span
                      key={i}
                      className="runway__dash"
                      style={{ bottom: `${4 + i * 4.1}%`, animationDelay: `${i * -0.38}s` }}
                    />
                  ))}
                </div>
                <div className="runway__edge-lights" aria-hidden="true">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className="runway__edge-light"
                      style={{
                        left: `${23 + i * 5.6}%`,
                        bottom: `${3 + (i % 2) * 4}%`,
                        animationDelay: `${i * -0.22}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="runway__fog" />
                <div className="runway__apron" />
              </div>

              <div className="runway__courier">
                <span className="runway__courier-head" />
                <span className="runway__courier-body" />
                <span className="runway__courier-arm" />
                <span className="runway__courier-leg runway__courier-leg--a" />
                <span className="runway__courier-leg runway__courier-leg--b" />
              </div>

              <div className="runway__cart">
                <span className="runway__cart-bed" />
                <div className="runway__parcel">
                  <GiftParcel />
                </div>
                <div className="runway__bouquet">
                  <Bouquet compact />
                </div>
              </div>

              <div className="runway__aircraft">
                <div className="runway__plane">
                  <svg viewBox="-60 -45 130 100">
                    <Airplane />
                  </svg>
                </div>
                <div className="runway__cargo">
                  <span className="runway__cargo-hold" />
                  <span className="runway__cargo-ramp" />
                  <span className="runway__cargo-door" />
                  <span className="runway__cargo-beacon" />
                </div>
                <div className="runway__trail" aria-hidden="true">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span
                      key={i}
                      className={`runway__petal runway__petal--${i % 4}`}
                      style={{
                        left: `${5 + (i % 5) * 5}%`,
                        top: `${47 + (i % 4) * 6}%`,
                        animationDelay: `${(i % 6) * 0.14}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="runway__sparkles" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    className="runway__sparkle"
                    style={{
                      left: `${26 + ((i * 7) % 40)}%`,
                      bottom: `${27 + (i % 4) * 5}%`,
                      animationDelay: `${(i % 5) * 0.12}s`,
                    }}
                  />
                ))}
              </div>

              <div className="runway__speed" />
            </div>
            <p className="cutscene__caption">The parcel is loaded · Dubai to Paris</p>
          </div>
          <div className="cutscene__scene cutscene__scene--door">
            <div className="doorway">
              <div className="doorway__wall" />
              <div className="doorway__frame">
                <div className="doorway__light" />
                <div className="doorway__door doorway__door--left">
                  <span className="doorway__panel" />
                  <span className="doorway__knob" />
                </div>
                <div className="doorway__door doorway__door--right">
                  <span className="doorway__panel" />
                </div>
              </div>
              <div className="doorway__puppy">
                <svg viewBox="55 45 210 300">
                  <Puppy withParcel crown />
                </svg>
              </div>
              <span className="doorway__heart doorway__heart--1" />
              <span className="doorway__heart doorway__heart--2" />
              <span className="doorway__heart doorway__heart--3" />
            </div>
            <p className="cutscene__caption">A little friend is at your door</p>
          </div>
        </div>

        <div className="celebration" ref={celebrationRef} aria-hidden="true" />
      </div>

      <div className="exp__track" ref={trackRef} aria-hidden="true" />
    </div>
  );
}
