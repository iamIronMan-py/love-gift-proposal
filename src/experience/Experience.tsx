import React, { PointerEvent, useEffect, useRef, useState } from 'react';
import { FlightCanvas, FlightHandle } from './FlightCanvas';
import { Envelope } from '../components/illustrations/Envelope';
import { GiftParcel } from '../components/illustrations/GiftParcel';
import { Garden } from '../components/illustrations/Garden';
import { Puppy } from '../components/illustrations/Puppy';
import { DubaiLandmarks, ParisLandmarks } from '../components/illustrations/Landmarks';
import { GiftBox3D } from './GiftBox3D';
import { storyAudio } from './audio';
import { GIFT } from '../config';
import './experience.css';

const GATE_LABELS = [
  'Open the letter',
  'Send from Dubai',
  'Start the journey',
  'Meet your little friend',
  'Meet her at the door',
  'Open the gift',
  'Celebrate',
];
const CHAPTERS = [
  { at: 0, name: 'A little surprise' },
  { at: 11, name: 'Wrapped in Dubai' },
  { at: 23, name: 'The journey' },
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
  color: ['#b3122f', '#8b6bd1', '#e0405a', '#a58ae0', '#c9184a'][i % 5],
}));
const BLOOM_FLIGHT = [
  { left: 4, top: 82, size: 'near', rotate: -16 },
  { left: 20, top: 90, size: 'mid', rotate: 9 },
  { left: 34, top: 58, size: 'mid', rotate: 13 },
  { left: 61, top: 32, size: 'far', rotate: -8 },
  { left: 82, top: 26, size: 'mid', rotate: 16 },
  { left: 12, top: 70, size: 'far', rotate: -5 },
  { left: 28, top: 72, size: 'near', rotate: 7 },
  { left: 68, top: 66, size: 'mid', rotate: -12 },
  { left: 88, top: 74, size: 'near', rotate: 18 },
  { left: 96, top: 50, size: 'far', rotate: -18 },
] as const;
const BURST_BOUQUETS = [
  { left: 31, top: 50, width: 24, rotate: -24, x: -18, y: 8 },
  { left: 69, top: 42, width: 22, rotate: 18, x: 20, y: -8 },
  { left: 54, top: 79, width: 20, rotate: 8, x: -10, y: 18 },
  { left: 82, top: 75, width: 18, rotate: -12, x: 16, y: 14 },
] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a || 1));
  return x * x * (3 - 2 * x);
};

export function Experience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<FlightHandle>(null);
  const chapterNumRef = useRef<HTMLSpanElement>(null);
  const chapterNameRef = useRef<HTMLSpanElement>(null);
  const distanceRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const flightBarRef = useRef<HTMLSpanElement>(null);
  const gateLabelRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const cutsceneRef = useRef<HTMLDivElement>(null);
  const celebrationRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const boxOpenRef = useRef(0);
  const unboxDwellRef = useRef(0);
  const [boxOpen, setBoxOpen] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleGate = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    storyAudio.unlock();
    if (!document.fullscreenElement && window.innerWidth > 700) toggleFullscreen();
    (window as any).__advanceToNext?.();
  };

  const handleStagePointer = (event: PointerEvent<HTMLDivElement>) => {
    storyAudio.unlock();
    const target = event.target as HTMLElement;
    if (target.closest('.fullscreen-toggle, .story-gate')) return;
    (window as any).__advanceToNext?.();
  };

  const toggleFullscreen = () => {
    const doc = document as Document & { webkitFullscreenElement?: Element };
    if (document.fullscreenElement || doc.webkitFullscreenElement) {
      if (document.exitFullscreen) void document.exitFullscreen();
      return;
    }
    const root = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
    const request = root.requestFullscreen?.bind(root) ?? root.webkitRequestFullscreen?.bind(root);
    if (request) Promise.resolve(request()).catch(() => undefined);
  };

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = (sel: string) => Array.from(root.querySelectorAll(sel)) as HTMLElement[];
    const setStyles = (sel: string, styles: Partial<CSSStyleDeclaration>) => {
      q(sel).forEach((el) => Object.assign(el.style, styles));
    };
    const setOpacity = (sel: string, v: number) => setStyles(sel, { opacity: String(clamp01(v)) });
    const setTransform = (sel: string, transform: string, opacity?: number) => {
      const s: any = { transform };
      if (opacity !== undefined) s.opacity = String(clamp01(opacity));
      setStyles(sel, s);
    };

    let raf = 0;
    let last = performance.now();
    let boostUntil = 0;
    let userScrollUntil = 0;
    let cutscene: { scene: 'door'; t0: number; dur: number; onDone?: () => void } | null = null;
    let doorAutoDone = false;
    let bloomBarkDone = false;
    let takeoffSoundStarted = false;
    let landingSoundStarted = false;
    let syncingScroll = false;

    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const syncScrollFromProgress = (p: number) => {
      syncingScroll = true;
      window.scrollTo({ top: p * maxScroll() });
      requestAnimationFrame(() => { syncingScroll = false; });
    };

    const onScroll = () => {
      if (syncingScroll) return;
      progressRef.current = clamp01(window.scrollY / maxScroll());
      userScrollUntil = performance.now() + 1800;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const spawnCelebration = () => {
      const layer = celebrationRef.current;
      if (!layer) return;
      layer.replaceChildren();
      const colors = ['#b3122f', '#8b6bd1', '#e0405a', '#a58ae0', '#c9184a', '#c9b6f2'];
      for (let i = 0; i < 40; i += 1) {
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

    const startDoor = (onDone?: () => void) => {
      if (cutscene) return;
      storyAudio.unlock();
      cutscene = { scene: 'door', t0: performance.now(), dur: 8200, onDone };
      const node = cutsceneRef.current;
      if (node) {
        node.dataset.scene = 'door';
        node.dataset.active = 'true';
        const pup = node.querySelector('.doorway__puppy') as HTMLElement | null;
        if (pup) { pup.style.animation = 'none'; void pup.offsetHeight; pup.style.animation = ''; }
      }
      root.classList.add('is-cinema');
      document.documentElement.classList.add('is-cinema');
      if (!landingSoundStarted) { storyAudio.play('landing'); landingSoundStarted = true; }
      window.setTimeout(() => storyAudio.play('bark'), 500);
      window.setTimeout(() => storyAudio.play('bark'), 1800);
      window.setTimeout(() => storyAudio.play('bark'), 3400);
      window.setTimeout(() => storyAudio.play('bark'), 5200);
      window.setTimeout(() => storyAudio.play('bark'), 7000);
    };

    (window as any).__advanceToNext = () => {
      storyAudio.unlock();
      boostUntil = performance.now() + 2600;
      if (cutscene) return;
      const p = progressRef.current;
      if (p >= 0.67 && p < 0.785) {
        startDoor(() => { progressRef.current = Math.max(progressRef.current, 0.785); syncScrollFromProgress(progressRef.current); });
        return;
      }
      if (p >= 0.785 && p < 0.84) {
        startDoor();
        return;
      }
      if (p >= 0.81 && p < 0.93) {
        boxOpenRef.current = Math.min(1, boxOpenRef.current + 0.35);
        setBoxOpen(boxOpenRef.current);
      }
      if (p >= 0.93) { spawnCelebration(); storyAudio.play('bark'); }
    };

    const update = (p: number, dt: number, now: number) => {
      p = clamp01(p);
      progressRef.current = p;
      const pct = p * 100;

      let chapter = 0;
      CHAPTERS.forEach((c, i) => { if (pct >= c.at) chapter = i; });
      root.dataset.chapter = String(chapter);
      if (chapterNumRef.current) chapterNumRef.current.textContent = String(chapter + 1).padStart(2, '0');
      if (chapterNameRef.current) chapterNameRef.current.textContent = CHAPTERS[chapter].name;
      if (gateLabelRef.current) gateLabelRef.current.textContent = GATE_LABELS[chapter];
      if (progressFillRef.current) progressFillRef.current.style.transform = `scaleX(${p})`;

      const hud = root.querySelector('.hud') as HTMLElement | null;
      if (hud) {
        const light = (pct >= 21 && pct < 56) || (pct >= 79 && pct < 93);
        hud.style.color = light ? '#fff8f2' : '#2b2028';
      }

      const introOut = smooth(0.08, 0.12, p);
      setOpacity('[data-sky="dawn"]', 1 - smooth(0.21, 0.25, p));
      setOpacity('[data-sky="flight"]', smooth(0.21, 0.24, p) * (1 - smooth(0.545, 0.575, p)));
      setOpacity('[data-sky="garden"]', smooth(0.548, 0.58, p) * (1 - smooth(0.674, 0.704, p)));
      setOpacity('[data-sky="paris"]', smooth(0.677, 0.71, p) * (1 - smooth(0.796, 0.826, p)));
      setOpacity('[data-sky="studio"]', smooth(0.799, 0.84, p) * (1 - smooth(0.924, 0.954, p)));
      setOpacity('[data-sky="finale"]', smooth(0.927, 0.97, p));
      setOpacity('[data-scroll-hint]', 1 - smooth(0.014, 0.04, p));

      const dubaiMarks = smooth(0.12, 0.155, p) * (1 - smooth(0.255, 0.285, p));
      const parisMarks = smooth(0.50, 0.54, p) * (1 - smooth(0.70, 0.73, p));
      setOpacity('[data-runway-mark="dubai"]', dubaiMarks);
      setOpacity('[data-runway-mark="paris"]', parisMarks);

      q('.chapter--intro [data-copy]').forEach((el, i) => {
        const o = 1 - introOut;
        el.style.opacity = String(clamp01(o));
        el.style.transform = `translateY(${-42 * introOut - i * 2 * introOut}px)`;
      });
      setTransform('[data-envelope]', `translateY(${-54 * smooth(0,0.09,p) - 170 * introOut}px) rotate(${-2 * smooth(0,0.09,p) - 9 * introOut}deg) scale(${1 + 0.03 * smooth(0,0.09,p) + 0.08 * introOut})`, 1 - introOut);

      const dubaiIn = smooth(0.095, 0.13, p);
      const dubaiOut = smooth(0.206, 0.224, p);
      q('.chapter--dubai [data-copy]').forEach((el, i) => {
        const y = (1 - dubaiIn) * 40 - dubaiOut * 30;
        el.style.opacity = String(clamp01(dubaiIn * (1 - dubaiOut)));
        el.style.transform = `translateY(${y + i * 2}px)`;
      });
      const parcelDrop = smooth(0.094, 0.148, p);
      const parcelOut = smooth(0.206, 0.224, p);
      setTransform('[data-parcel]', `translateY(${-260 * (1 - parcelDrop) + 90 * parcelOut}px) rotate(${-11 * (1 - parcelDrop) + 7 * parcelOut}deg) scale(${0.82 + 0.18 * parcelDrop - 0.1 * parcelOut})`, parcelDrop * (1 - parcelOut));

      const takeU = clamp01((p - 0.155) / 0.105);
      const flightLayer = root.querySelector('[data-flight]') as HTMLElement | null;
      if (flightLayer) flightLayer.style.opacity = String(p >= 0.15 && p < 0.72 ? 1 : 0);
      if (p >= 0.155 && p < 0.265) {
        if (!takeoffSoundStarted && takeU > 0.32) { storyAudio.play('takeoff'); takeoffSoundStarted = true; }
        flightRef.current?.setTakeoff(takeU);
      } else if (p >= 0.265 && p < 0.72) {
        if (takeoffSoundStarted) { storyAudio.stopTakeoff(); takeoffSoundStarted = false; }
        const ft = clamp01((p - 0.265) / 0.455);
        flightRef.current?.setProgress(ft);
        if (distanceRef.current) distanceRef.current.textContent = `${Math.round(ft * 6700).toLocaleString('en-US')} km`;
        let st = 'Cruising over the Atlantic';
        if (ft < 0.04) st = 'Preparing for takeoff';
        else if (ft < 0.2) st = 'Lifting off from Dubai';
        else if (ft > 0.9) st = 'Touchdown, Paris';
        else if (ft > 0.72) st = 'Descending into Paris';
        if (statusRef.current) statusRef.current.textContent = st;
        if (flightBarRef.current) flightBarRef.current.style.transform = `scaleX(${ft})`;
      } else {
        if (p < 0.155) { takeoffSoundStarted = false; flightRef.current?.setTakeoff(0); }
      }
      setOpacity('[data-flight-hud]', smooth(0.24, 0.27, p) * (1 - smooth(0.68, 0.71, p)));
      q('.chapter--journey [data-copy]').forEach((el) => { el.style.opacity = String(smooth(0.23,0.26,p)*(1-smooth(0.284,0.3,p))); el.style.transform = `translateY(${(1-smooth(0.23,0.26,p))*40}px)`; });

      const bloomIn = smooth(0.566, 0.60, p);
      const bloomOut = smooth(0.659, 0.68, p);
      setTransform('[data-garden]', `translateY(${50 * (1 - bloomIn) + 48 * bloomOut}px) scale(${0.94 + 0.06 * bloomIn + 0.04 * bloomOut})`, bloomIn * (1 - bloomOut));
      if (bloomIn > 0.5 && !bloomBarkDone) { storyAudio.play('bark'); bloomBarkDone = true; }
      q('[data-bloom-item]').forEach((el, i) => { const bi = smooth(0.558 + i*0.004, 0.60 + i*0.004, p) * (1 - smooth(0.662,0.68,p)); el.style.opacity = String(clamp01(bi)); el.style.transform = `scale(${0.5 + 0.5*bi})`; });
      q('.chapter--bloom [data-copy]').forEach((el)=>{ const o=smooth(0.566,0.59,p)*(1-smooth(0.659,0.675,p)); el.style.opacity=String(clamp01(o)); el.style.transform=`translateY(${(1-smooth(0.566,0.59,p))*40}px)`; });

      const arrIn = smooth(0.686, 0.71, p);
      const arrOut = smooth(0.782, 0.8, p);
      setTransform('[data-arrival]', `translateY(${52 * arrOut}px) scale(${1 - 0.03 * arrOut})`, arrIn * (1 - arrOut));
      setTransform('[data-arrival-parcel]', `translateY(${-300 * (1 - arrIn)}px) scale(${0.84 + 0.16 * arrIn})`, arrIn);
      q('.chapter--arrival [data-copy]').forEach((el)=>{ const o=smooth(0.686,0.71,p)*(1-smooth(0.782,0.8,p)); el.style.opacity=String(clamp01(o)); el.style.transform=`translateY(${(1-smooth(0.686,0.71,p))*40}px)`; });

      if (!cutscene && !doorAutoDone && p >= 0.705 && p < 0.72) {
        doorAutoDone = true;
        startDoor(() => { progressRef.current = Math.max(progressRef.current, 0.785); syncScrollFromProgress(progressRef.current); });
      }

      const boxIn = smooth(0.806, 0.84, p);
      const boxOut = smooth(0.922, 0.95, p);
      setTransform('[data-box-stage]', `translateY(${90 * (1 - boxIn) - 60 * boxOut}px) scale(${0.82 + 0.18 * boxIn})`, boxIn * (1 - boxOut));
      q('.chapter--unbox [data-copy]').forEach((el)=>{ const o=smooth(0.808,0.84,p)*(1-smooth(0.886,0.91,p)); el.style.opacity=String(clamp01(o)); el.style.transform=`translateY(${(1-smooth(0.808,0.84,p))*40}px)`; });

      if (p >= 0.84 && p < 0.93) {
        unboxDwellRef.current += dt;
        if (unboxDwellRef.current > 1.0 || now < boostUntil) {
          boxOpenRef.current = Math.min(1, boxOpenRef.current + dt * 0.18);
        }
      } else if (p < 0.84) {
        unboxDwellRef.current = 0;
        boxOpenRef.current = Math.max(0, Math.min(boxOpenRef.current, smooth(0.806, 0.84, p) * 0.1));
      } else if (p >= 0.93) {
        boxOpenRef.current = 1;
      }
      if (Math.abs(boxOpenRef.current - boxOpen) > 0.01) setBoxOpen(boxOpenRef.current);

      q('.chapter--finale [data-copy]').forEach((el,i)=>{ const o=smooth(0.929+i*0.004,0.96+i*0.004,p); el.style.opacity=String(clamp01(o)); el.style.transform=`translateY(${(1-o)*40}px)`; });
      setOpacity('[data-petals]', smooth(0.932, 0.96, p));
      q('[data-burst-item]').forEach((el,i)=>{ const o=smooth(0.92+i*0.01,0.95+i*0.01,p); el.style.opacity=String(clamp01(o)); });
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (cutscene) {
        if (now - cutscene.t0 >= cutscene.dur) {
          const done = cutscene.onDone;
          cutscene = null;
          const node = cutsceneRef.current;
          if (node) node.dataset.active = 'false';
          root.classList.remove('is-cinema');
          document.documentElement.classList.remove('is-cinema');
          storyAudio.stopLanding();
          if (done) done();
        }
      } else {
        const boosted = now < boostUntil;
        const userScrolling = now < userScrollUntil;
        let speed = boosted ? 0.05 : 0.007;
        if (userScrolling && !boosted) speed = 0.0015;
        if (progressRef.current >= 0.84 && progressRef.current < 0.9 && boxOpenRef.current < 0.98) speed = Math.min(speed, 0.001);
        if (progressRef.current < 1) {
          progressRef.current = Math.min(1, progressRef.current + speed * dt);
          if (!userScrolling || boosted) syncScrollFromProgress(progressRef.current);
        }
      }
      update(progressRef.current, dt, now);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, [boxOpen]);

  return (
    <div className="exp" ref={rootRef}>
      <div className="exp__stage" onPointerDown={handleStagePointer}>
        <div className="backdrop" aria-hidden="true">
          <div className="sky sky--dawn is-on" data-sky="dawn" />
          <div className="sky sky--flight" data-sky="flight" />
          <div className="sky sky--garden" data-sky="garden" />
          <div className="sky sky--paris" data-sky="paris" />
          <div className="sky sky--studio" data-sky="studio" />
          <div className="sky sky--finale" data-sky="finale" />
          <div className="backdrop__aura" /><div className="backdrop__vignette" /><div className="backdrop__grain" />
        </div>
        <div className="flight" data-flight>
          <FlightCanvas ref={flightRef} />
          <div className="runway-mark runway-mark--dubai" data-runway-mark="dubai"><DubaiLandmarks /></div>
          <div className="runway-mark runway-mark--paris" data-runway-mark="paris"><ParisLandmarks /></div>
        </div>
        <div className="objects" aria-hidden="true">
          <div className="object object--envelope"><div className="object__inner" data-envelope><Envelope /></div></div>
          <div className="object object--parcel"><div className="object__inner" data-parcel><GiftParcel /></div></div>
          <div className="object object--garden"><div className="object__inner" data-garden><Garden puppyParcel /></div></div>
          <div className="bloom-flight" data-bloom-flight aria-hidden="true">
            {BLOOM_FLIGHT.map((item, index) => (
              <div key={index} className={`bloom-flight__item bloom-flight__item--${item.size}`} data-bloom-item style={{ left: `${item.left}%`, top: `${item.top}%` }} />
            ))}
          </div>
          <div className="object object--arrival">
            <div className="object__inner arrival-scene" data-arrival>
              <div className="arrival-scene__glow" />
              <div className="arrival-scene__parcel" data-arrival-parcel><GiftParcel /></div>
              <div className="delivery-card" data-arrival-card><div className="delivery-card__top"><span>Express</span><span>Handle with love</span></div><div className="delivery-card__code">DXB → ORY</div><div className="delivery-card__line" /><p className="delivery-card__note">For you, with all my love.</p></div>
              <div className="delivery-stamp" data-arrival-stamp>Delivered<br />with love<br />Paris</div>
            </div>
          </div>
          <div className="object object--box">
            <div className="object__inner" data-box-stage><GiftBox3D open={boxOpen} /></div>
            <div className="bouquet-burst" data-bouquet-burst aria-hidden="true">
              {BURST_BOUQUETS.map((item, index) => (<div key={index} className="bouquet-burst__item" data-burst-item style={{ left: `${item.left}%`, top: `${item.top}%`, width: `${item.width}%` }} />))}
            </div>
          </div>
        </div>
        <div className="petals" data-petals aria-hidden="true">
          {PETALS.map((petal, i) => (<span key={i} style={{ left: `${petal.left}%`, width: petal.size, height: petal.size * 0.72, background: petal.color }} />))}
        </div>
        <main className="copy">
          <section className="chapter chapter--intro" aria-labelledby="intro-title"><div className="copy__block copy__block--left"><p className="eyebrow" data-copy>A little surprise, wrapped with love</p><h1 className="display" id="intro-title"><span className="line" data-copy>A little <em>surprise</em></span><span className="line" data-copy>is on its way...</span></h1><p className="lede" data-copy>It began in Dubai, among warm golden evenings and quiet wishes. Now it is crossing oceans and skies — travelling a very long way just to make you smile.</p><div className="scroll-hint" data-scroll-hint><span className="scroll-hint__line" />Scroll to begin</div></div></section>
          <section className="chapter chapter--dubai" aria-labelledby="dubai-title"><div className="copy__block copy__block--left"><p className="eyebrow" data-copy>Chapter one · Wrapped in Dubai</p><h2 className="display" id="dubai-title" data-copy>First, a little <em>something</em> was wrapped just for you.</h2><p className="lede" data-copy>Ribbons tied by hand, a tag written with care, and a tiny parcel carrying far more love than it looks like it could hold.</p><div className="shipping" data-copy><div className="shipping__item"><span className="shipping__label">From</span><span className="shipping__value">Dubai</span></div><div className="shipping__item"><span className="shipping__label">To</span><span className="shipping__value">Paris</span></div><div className="shipping__item"><span className="shipping__label">With</span><span className="shipping__value">Love</span></div></div></div></section>
          <section className="chapter chapter--journey" aria-labelledby="journey-title"><div className="copy__block copy__block--center"><p className="eyebrow" data-copy>Chapter two · The journey</p><h2 className="display" id="journey-title" data-copy>A small parcel. A <em>6,700 km</em> journey.</h2><p className="lede" data-copy>Across deserts, seas and skies — following a little golden trail all the way to you.</p></div></section>
          <section className="chapter chapter--bloom" aria-labelledby="bloom-title"><div className="copy__block copy__block--left"><p className="eyebrow" data-copy>Chapter three · A garden in bloom</p><h2 className="display" id="bloom-title" data-copy>Some things <em>bloom</em> when they are meant for you.</h2><p className="lede" data-copy>The flowers seemed to know you were waiting. And someone very small and very excited came along to make sure your gift arrived safely.</p></div></section>
          <section className="chapter chapter--arrival" aria-labelledby="arrival-title"><div className="copy__block copy__block--left"><p className="eyebrow" data-copy>Chapter four · Arrived in Paris</p><h2 className="display" id="arrival-title" data-copy>Touchdown, Paris. <em>Your gift is here.</em></h2><p className="lede" data-copy>A soft little landing, a parcel on the doorstep, and a tag that says it all: handle with love. It has come such a long way to reach you.</p></div></section>
          <section className="chapter chapter--unbox" aria-labelledby="unbox-title"><div className="copy__block copy__block--center"><p className="eyebrow" data-copy>Chapter five · The ribbon</p><h2 className="display" id="unbox-title" data-copy>One little ribbon between you and <em>your surprise.</em></h2><p className="lede" data-copy>Take a breath, make a wish, and open it slowly. It has been waiting a very long time to meet you.</p></div></section>
          <section className="chapter chapter--finale" aria-labelledby="finale-title"><div className="copy__block copy__block--center"><p className="eyebrow" data-copy>Chapter six · Delivered with love</p><h2 className="display" id="finale-title" data-copy>A little love, all the way from <em>Dubai.</em></h2><p className="lede" data-copy>I hope this made you smile. You deserve soft days, fresh flowers, and a tiny golden friend who is always happy to see you.</p><p className="signature" data-copy>{GIFT.recipient ? `For ${GIFT.recipient}, ${GIFT.signature.toLowerCase()}.` : `${GIFT.signature}.`}</p></div></section>
        </main>
        <div className="hud" aria-hidden="true">
          <div className="hud__top"><div className="hud__chapter"><span ref={chapterNumRef}>01</span><span className="hud__chapter-line" /><span ref={chapterNameRef}>A little surprise</span></div></div>
          <div className="hud__flight" data-flight-hud><div className="hud__flight-row"><span className="hud__flight-route">DXB → ORY</span><span className="hud__flight-distance" ref={distanceRef}>0 km</span></div><div className="hud__flight-status" ref={statusRef}>Preparing for takeoff</div><div className="hud__flight-bar"><span ref={flightBarRef} /></div></div>
          <div className="hud__bottom"><span className="hud__meta">Dubai</span><div className="hud__progress"><span className="hud__progress-fill" ref={progressFillRef} /></div><span className="hud__meta">Paris</span></div>
        </div>
        <div className="story-gate"><button className="story-gate__btn" type="button" onClick={handleGate}><span ref={gateLabelRef}>Open the letter</span><span className="story-gate__arrow" aria-hidden="true">→</span></button></div>
        <button className="fullscreen-toggle" type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-pressed={isFullscreen}>
          {isFullscreen ? (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M9 20H5a1 1 0 0 1-1-1v-4M15 20h4a1 1 0 0 0 1-1v-4" /></svg>) : (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" /></svg>)}
        </button>
        <div className="cutscene" ref={cutsceneRef} data-active="false" aria-hidden="true">
          <div className="cutscene__veil" />
          <div className="cutscene__scene cutscene__scene--door">
            <div className="doorway">
              <div className="doorway__wall" /><div className="doorway__frame"><div className="doorway__light" /><div className="doorway__door doorway__door--left"><span className="doorway__panel" /><span className="doorway__knob" /></div><div className="doorway__door doorway__door--right"><span className="doorway__panel" /></div></div>
              <div className="doorway__puppy"><svg viewBox="55 45 210 300"><Puppy withParcel crown withRose /></svg></div>
              <span className="doorway__heart doorway__heart--1" /><span className="doorway__heart doorway__heart--2" /><span className="doorway__heart doorway__heart--3" />
            </div>
            <p className="cutscene__caption">A little friend is at your door</p>
          </div>
        </div>
        <div className="celebration" ref={celebrationRef} aria-hidden="true" />
      </div>
      <div className="exp__track" aria-hidden="true" />
    </div>
  );
}
