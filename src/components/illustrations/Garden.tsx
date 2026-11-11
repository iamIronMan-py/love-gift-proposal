import { useId } from 'react';
import { Puppy } from './Puppy';
import { Flower } from './Flower';

type GardenProps = {
  puppyParcel?: boolean;
  className?: string;
  instant?: boolean;
};

export function Garden({ puppyParcel = false, className = '', instant = false }: GardenProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const sun = `sun-${uid}`;
  const hill = `hill-${uid}`;

  return (
    <svg
      className={`garden ${className}`}
      viewBox="0 0 1000 620"
      role="img"
      aria-label="A golden puppy sitting in a blooming pastel garden"
    >
      <defs>
        <radialGradient id={sun} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff1c9" stopOpacity="0.95" />
          <stop offset="65%" stopColor="#f9dfa7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f9dfa7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={hill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dcecdf" />
          <stop offset="100%" stopColor="#bfdcc8" />
        </linearGradient>
      </defs>

      <circle cx={780} cy={110} r={130} fill={`url(#${sun})`} />
      <circle cx={780} cy={110} r={44} fill="#fff6dc" opacity={0.8} />

      <path
        d="M 0 468 C 150 420 300 452 470 430 C 640 408 812 452 1000 416 L 1000 620 L 0 620 Z"
        fill={`url(#${hill})`}
      />
      <path
        d="M 0 532 C 172 492 330 522 508 500 C 690 478 838 520 1000 496 L 1000 620 L 0 620 Z"
        fill="#c9e2d1"
      />

      <g className="garden__grasses" stroke="#9fc7a9" strokeWidth={3} strokeLinecap="round" opacity={0.7}>
        <path d="M 300 596 C 294 576 296 560 304 544" />
        <path d="M 312 598 C 314 580 320 566 330 554" />
        <path d="M 690 606 C 684 586 686 568 694 552" />
        <path d="M 704 608 C 706 590 712 574 722 562" />
        <path d="M 820 592 C 814 574 816 558 824 544" />
      </g>

      <g className={`flowers flowers--back${instant ? ' flowers--static' : ''}`}>
        <Flower x={86} y={520} stemHeight={168} headScale={1.14} rotate={-8} petal="#b3122f" petalLight="#e0405a" petalDeep="#7a0b20" petalHighlight="#ff7a8c" center="#e7c98f" variant="rose" />
        <Flower x={196} y={536} stemHeight={126} headScale={0.96} rotate={6} petal="#8b6bd1" petalLight="#a58ae0" center="#c9b6f2" variant="lavender" />
        <Flower x={306} y={516} stemHeight={188} headScale={1.06} rotate={-4} petal="#c9184a" petalLight="#f06d8a" petalDeep="#7a0b20" petalHighlight="#ff7a8c" center="#e7c98f" variant="rose" />
        <Flower x={712} y={528} stemHeight={150} headScale={1} rotate={7} petal="#8b6bd1" petalLight="#c9b6f2" center="#a58ae0" variant="lavender" />
        <Flower x={842} y={506} stemHeight={196} headScale={1.12} rotate={-6} petal="#e0405a" petalLight="#ff7a8c" petalDeep="#7a0b20" petalHighlight="#ffd0d6" center="#e7c98f" variant="rose" />
        <Flower x={946} y={540} stemHeight={118} headScale={0.9} rotate={10} petal="#a58ae0" petalLight="#c9b6f2" center="#8b6bd1" variant="lavender" />
      </g>

      <ellipse cx={500} cy={574} rx={210} ry={34} fill="#a9cbb0" opacity={0.28} />

      <g className="puppy-pop">
        <g transform="translate(340 248) scale(1.05)">
          <g className="puppy-jump">
            <Puppy crown withParcel={puppyParcel} />
          </g>
        </g>
      </g>

      <g className={`flowers flowers--front${instant ? ' flowers--static' : ''}`}>
        <Flower x={52} y={600} stemHeight={126} headScale={1} rotate={-10} petal="#a4161a" petalLight="#e0405a" petalDeep="#7a0b20" petalHighlight="#ff7a8c" center="#e7c98f" variant="rose" />
        <Flower x={156} y={612} stemHeight={96} headScale={0.86} rotate={8} petal="#8b6bd1" petalLight="#c9b6f2" center="#a58ae0" variant="lavender" />
        <Flower x={360} y={604} stemHeight={108} headScale={0.92} rotate={-5} petal="#c9184a" petalLight="#f06d8a" petalDeep="#7a0b20" petalHighlight="#ff7a8c" center="#e7c98f" variant="rose" />
        <Flower x={458} y={618} stemHeight={82} headScale={0.78} rotate={12} petal="#d62839" petalLight="#ff7a8c" petalDeep="#7a0b20" petalHighlight="#ffd0d6" center="#e7c98f" variant="rose" />
        <Flower x={566} y={616} stemHeight={90} headScale={0.82} rotate={-8} petal="#b3122f" petalLight="#e0405a" petalDeep="#7a0b20" petalHighlight="#ff7a8c" center="#e7c98f" variant="rose" />
        <Flower x={666} y={606} stemHeight={112} headScale={0.94} rotate={6} petal="#a58ae0" petalLight="#c9b6f2" center="#8b6bd1" variant="lavender" />
        <Flower x={782} y={596} stemHeight={132} headScale={1.02} rotate={-6} petal="#e0405a" petalLight="#ff7a8c" petalDeep="#7a0b20" petalHighlight="#ffd0d6" center="#e7c98f" variant="rose" />
        <Flower x={906} y={606} stemHeight={102} headScale={0.9} rotate={9} petal="#b3122f" petalLight="#e0405a" petalDeep="#7a0b20" petalHighlight="#ff7a8c" center="#e7c98f" variant="rose" />
        <Flower x={982} y={616} stemHeight={78} headScale={0.74} rotate={-12} petal="#c9184a" petalLight="#f06d8a" petalDeep="#7a0b20" petalHighlight="#ff7a8c" center="#e7c98f" variant="rose" />
      </g>

      <g className="garden__sparkles" fill="#fff6dc">
        <Sparkle x={250} y={330} r={5} />
        <Sparkle x={690} y={300} r={6} />
        <Sparkle x={780} y={400} r={4} />
        <Sparkle x={190} y={410} r={4} />
        <Sparkle x={600} y={250} r={5} />
        <Sparkle x={400} y={210} r={3.6} />
      </g>

      <g className="garden__butterflies">
        <Butterfly x={250} y={250} color="#b3122f" light="#e0405a" />
        <Butterfly x={700} y={210} color="#8b6bd1" light="#c9b6f2" />
      </g>

      <g className="garden__petals" fill="#c9184a" opacity={0.72}>
        <ellipse cx={340} cy={180} rx={7} ry={4} transform="rotate(-24 340 180)" />
        <ellipse cx={620} cy={150} rx={6} ry={3.5} transform="rotate(32 620 150)" fill="#a58ae0" />
        <ellipse cx={830} cy={270} rx={7} ry={4} transform="rotate(-12 830 270)" />
        <ellipse cx={140} cy={250} rx={6} ry={3.5} transform="rotate(48 140 250)" fill="#8b6bd1" />
        <ellipse cx={520} cy={230} rx={5} ry={3} transform="rotate(18 520 230)" fill="#a58ae0" />
        <ellipse cx={740} cy={340} rx={6} ry={3.5} transform="rotate(-34 740 340)" />
      </g>
    </svg>
  );
}

function Sparkle({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      className="garden__sparkle"
      d={`M ${x} ${y - r} C ${x + r * 0.22} ${y - r * 0.22} ${x + r * 0.22} ${y - r * 0.22} ${x + r} ${y} C ${x + r * 0.22} ${y + r * 0.22} ${x + r * 0.22} ${y + r * 0.22} ${x} ${y + r} C ${x - r * 0.22} ${y + r * 0.22} ${x - r * 0.22} ${y + r * 0.22} ${x - r} ${y} C ${x - r * 0.22} ${y - r * 0.22} ${x - r * 0.22} ${y - r * 0.22} ${x} ${y - r} Z`}
      opacity={0.85}
    />
  );
}

function Butterfly({ x, y, color, light }: { x: number; y: number; color: string; light: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="garden__butterfly">
        <g className="garden__butterfly-wings">
          <path d="M 0 0 C -22 -20 -30 -4 -13 6 C -25 18 -14 28 0 10 Z" fill={color} opacity={0.9} />
          <path d="M 0 0 C 22 -20 30 -4 13 6 C 25 18 14 28 0 10 Z" fill={light} opacity={0.95} />
          <path d="M 0 -2 C 3 -10 4 -10 5 -2 C 4 4 2 6 0 8 C -2 6 -4 4 -5 -2 C -4 -10 -3 -10 0 -2 Z" fill="#c9a45e" />
        </g>
      </g>
    </g>
  );
}
