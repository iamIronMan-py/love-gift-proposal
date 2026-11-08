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
              <div className="box3d__spin">
                <Bouquet />
              </div>
              <div className="box3d__glitter" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={`box3d__spark box3d__spark--${i % 5}`} />
                ))}
              </div>
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
    <svg className="box3d__bouquet" viewBox="0 0 260 320" aria-hidden="true">
      <defs>
        <radialGradient id="bouquet-glow" cx="50%" cy="26%" r="58%">
          <stop offset="0%" stopColor="#fff2c9" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffe0a8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffe0a8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bouquet-wrap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff5ec" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#f3ddc8" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <ellipse cx="130" cy="110" rx="126" ry="112" fill="url(#bouquet-glow)" />

      <g className="bouquet__stems">
        <Flower x={88} y={308} stemHeight={272} headScale={0.98} rotate={-14} petal="#b3122e" petalLight="#e56b7c" center="#7a1020" variant="rose" />
        <Flower x={116} y={312} stemHeight={266} headScale={1.04} rotate={-7} petal="#d62839" petalLight="#f08a9a" center="#8c1524" variant="rose" />
        <Flower x={142} y={314} stemHeight={286} headScale={1.1} rotate={-2} petal="#c9184a" petalLight="#f06d8a" center="#e7c98f" variant="rose" />
        <Flower x={168} y={310} stemHeight={258} headScale={1.02} rotate={6} petal="#a4161a" petalLight="#e05a60" center="#6b0f13" variant="rose" />
        <Flower x={190} y={304} stemHeight={236} headScale={0.92} rotate={13} petal="#e5383b" petalLight="#ff8a8d" center="#9b1b1e" variant="rose" />
        <Flower x={72} y={300} stemHeight={226} headScale={0.88} rotate={-20} petal="#ba181b" petalLight="#ef5a5e" center="#710d0f" variant="rose" />
        <Flower x={104} y={318} stemHeight={228} headScale={0.96} rotate={-10} petal="#d90429" petalLight="#ff5c7a" center="#8a0b1a" variant="rose" />
        <Flower x={152} y={320} stemHeight={232} headScale={0.94} rotate={3} petal="#e63946" petalLight="#ff7f8a" center="#9e1a24" variant="rose" />
        <Flower x={182} y={316} stemHeight={214} headScale={0.88} rotate={11} petal="#c1121f" petalLight="#e85d66" center="#780812" variant="rose" />
      </g>

      <g className="bouquet__baby">
        {[
          [68, 96],
          [90, 70],
          [150, 58],
          [188, 84],
          [206, 116],
          [58, 132],
          [124, 44],
          [170, 40],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={3.4} fill="#fff7e6" opacity={0.9} />
            <circle cx={cx + 2} cy={cy + 2} r={2.2} fill="#f7e6c8" opacity={0.8} />
          </g>
        ))}
      </g>

      <path
        d="M 58 208 C 78 178 104 162 130 162 C 156 162 182 178 202 208 L 178 312 C 160 306 146 304 130 304 C 114 304 100 306 82 312 Z"
        fill="url(#bouquet-wrap)"
        stroke="rgba(214, 180, 148, 0.5)"
        strokeWidth={1.2}
      />
      <path
        d="M 70 214 C 88 194 108 184 130 184 C 152 184 172 194 190 214"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <path d="M 84 268 C 106 284 154 284 176 268" stroke="#e2b98f" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M 84 268 C 106 284 154 284 176 268" stroke="#f6ddbd" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <g transform="translate(130 276)">
        <path d="M 0 0 C -18 -14 -34 -2 -18 8 C -10 12 -4 8 0 0 Z" fill="#f3c98f" stroke="#d9ab6a" strokeWidth={1} />
        <path d="M 0 0 C 18 -14 34 -2 18 8 C 10 12 4 8 0 0 Z" fill="#f3c98f" stroke="#d9ab6a" strokeWidth={1} />
        <circle r={4.6} fill="#e7c98f" />
      </g>
    </svg>
  );
}
