import { useCallback, useEffect, useRef, useState } from 'react';
import { createTimeline, type Timeline } from 'animejs';
import { AmbientBackground } from './components/AmbientBackground';
import { ProgressRail } from './components/ProgressRail';
import { Preloader } from './components/Preloader';
import { HeartIcon } from './components/Icons';
import { IntroScene } from './scenes/IntroScene';
import { ConfirmScene } from './scenes/ConfirmScene';
import { JourneyScene } from './scenes/JourneyScene';
import { BloomScene } from './scenes/BloomScene';
import { ArrivalScene } from './scenes/ArrivalScene';
import { UnboxScene } from './scenes/UnboxScene';
import { FinaleScene } from './scenes/FinaleScene';
import { STAGES, type Stage } from './config';
import { dur, REDUCED_MOTION } from './motion';

export default function App() {
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState<Stage>('intro');
  const veilRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const timelineRef = useRef<Timeline | null>(null);

  useEffect(() => {
    return () => {
      timelineRef.current?.revert();
    };
  }, []);

  const go = useCallback(
    (next: Stage) => {
      if (lockRef.current || next === stage) return;

      const veil = veilRef.current;
      if (!veil || REDUCED_MOTION) {
        setStage(next);
        window.scrollTo(0, 0);
        return;
      }

      lockRef.current = true;
      timelineRef.current?.revert();

      const tl = createTimeline();
      timelineRef.current = tl;

      tl.add(veil, { opacity: [0, 1], duration: dur(520), ease: 'inOutQuad' })
        .call(() => {
          setStage(next);
          window.scrollTo(0, 0);
        })
        .add(veil, { opacity: [1, 0], duration: dur(680), ease: 'inOutQuad' }, `+=${dur(180)}`)
        .call(() => {
          lockRef.current = false;
        });
    },
    [stage],
  );

  const current = STAGES.indexOf(stage);

  const scene = (() => {
    switch (stage) {
      case 'intro':
        return <IntroScene onNext={() => go('confirm')} />;
      case 'confirm':
        return <ConfirmScene onNext={() => go('journey')} />;
      case 'journey':
        return <JourneyScene onNext={() => go('bloom')} />;
      case 'bloom':
        return <BloomScene onNext={() => go('arrival')} />;
      case 'arrival':
        return <ArrivalScene onNext={() => go('unbox')} />;
      case 'unbox':
        return <UnboxScene onNext={() => go('finale')} />;
      case 'finale':
        return <FinaleScene onReplay={() => go('intro')} />;
    }
  })();

  return (
    <div className="app">
      <AmbientBackground />

      {ready ? (
        <>
          <header className="brand">
            <span className="brand__mark">
              <HeartIcon />
            </span>
            <span>Something special</span>
            <span className="brand__sep">·</span>
            <span>DXB → CDG</span>
          </header>

          <ProgressRail current={current} />

          <main key={stage}>{scene}</main>

          <div className="veil" ref={veilRef} aria-hidden="true" />
        </>
      ) : (
        <Preloader onDone={() => setReady(true)} />
      )}
    </div>
  );
}
