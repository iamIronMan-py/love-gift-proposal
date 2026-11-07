import { useId } from 'react';
import { Flower } from '../components/illustrations/Flower';

export function GiftBox3D() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const bow = `bow-${uid}`;

  return (
    <div className="box3d" data-box aria-hidden="true">
      <div className="box3d__halo" />
      <div className="box3d__scene">
        <div className="box3d__float" data-box-float>
          <div className="box3d__glow" data-box-glow />
          <div className="box3d__cube">
            <div className="box3d__face box3d__face--back" />
            <div className="box3d__face box3d__face--left" />
            <div className="box3d__face box3d__face--right" />
            <div className="box3d__face box3d__face--bottom" />
            <div className="box3d__face box3d__face--front" />

            <div className="box3d__contents" data-box-contents>
              <Bouquet />
            </div>

            <div className="box3d__ribbon box3d__ribbon--v" />
            <div className="box3d__ribbon box3d__ribbon--h" />

            <div className="box3d__lid-anchor">
              <div className="box3d__lid" data-box-lid>
                <div className="box3d__lid-face" />
                <div className="box3d__lid-ribbon box3d__lid-ribbon--v" />
                <div className="box3d__lid-ribbon box3d__lid-ribbon--h" />
                <svg className="box3d__bow" viewBox="0 0 150 100">
                  <defs>
                    <linearGradient id={bow} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f6e3b9" />
                      <stop offset="48%" stopColor="#e7c98f" />
                      <stop offset="100%" stopColor="#c9a45e" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 75 48 C 34 10 8 34 42 56 C 54 64 66 56 75 48 Z"
                    fill={`url(#${bow})`}
                    stroke="#b9955a"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 75 48 C 116 10 142 34 108 56 C 96 64 84 56 75 48 Z"
                    fill={`url(#${bow})`}
                    stroke="#b9955a"
                    strokeWidth="1.5"
                  />
                  <path d="M 66 54 C 54 76 46 86 34 96" stroke="#dcb878" strokeWidth="9" strokeLinecap="round" fill="none" />
                  <path d="M 84 54 C 96 76 104 86 116 96" stroke="#dcb878" strokeWidth="9" strokeLinecap="round" fill="none" />
                  <circle cx="75" cy="48" r="13" fill="#e7c98f" />
                  <circle cx="71" cy="44" r="4" fill="#fff3d4" opacity="0.9" />
                </svg>
              </div>
            </div>
          </div>
          <div className="box3d__shadow" />
        </div>
      </div>
    </div>
  );
}

function Bouquet() {
  return (
    <svg className="box3d__bouquet" viewBox="0 0 260 270" aria-hidden="true">
      <defs>
        <radialGradient id="bouquet-glow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#fff2c9" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffe0a8" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#ffe0a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="130" cy="120" rx="120" ry="112" fill="url(#bouquet-glow)" />
      <path d="M 62 210 C 70 154 90 132 130 128 C 170 132 190 154 198 210 Z" fill="#f7e6d2" opacity="0.55" />
      <Flower x={82} y={232} stemHeight={132} headScale={0.98} rotate={-14} petal="#f2a9bc" petalLight="#f9cbd6" center="#e7c98f" variant="rose" />
      <Flower x={112} y={240} stemHeight={158} headScale={1.08} rotate={-6} petal="#d8ccf4" petalLight="#e7dff9" center="#e7c98f" variant="daisy" />
      <Flower x={138} y={244} stemHeight={176} headScale={1.18} rotate={2} petal="#f6d6a7" petalLight="#fbe8c9" center="#c9a45e" variant="poppy" />
      <Flower x={166} y={238} stemHeight={146} headScale={1.02} rotate={10} petal="#f2a9bc" petalLight="#f9cbd6" center="#e7c98f" variant="daisy" />
      <Flower x={192} y={230} stemHeight={120} headScale={0.9} rotate={16} petal="#d8ccf4" petalLight="#e7dff9" center="#e7c98f" variant="tulip" />
    </svg>
  );
}
