import { useId } from 'react';
import { Flower } from './Flower';

type BouquetProps = {
  className?: string;
  compact?: boolean;
  bare?: boolean;
};

type RoseStem = {
  x: number;
  y: number;
  stem: number;
  scale: number;
  rotate: number;
  petal: string;
  light: string;
  deep: string;
  highlight: string;
};

type LavenderStem = {
  x: number;
  y: number;
  stem: number;
  scale: number;
  rotate: number;
  petal: string;
  light: string;
};

const FULL_ROSES: RoseStem[] = [
  { x: 88, y: 308, stem: 272, scale: 0.98, rotate: -14, petal: '#b3122f', light: '#e0405a', deep: '#7a0b20', highlight: '#ff7a8c' },
  { x: 116, y: 312, stem: 266, scale: 1.04, rotate: -7, petal: '#c9184a', light: '#f06d8a', deep: '#7a0b20', highlight: '#ff7a8c' },
  { x: 142, y: 314, stem: 286, scale: 1.1, rotate: -2, petal: '#e0405a', light: '#ff7a8c', deep: '#7a0b20', highlight: '#ffd0d6' },
  { x: 168, y: 310, stem: 258, scale: 1.02, rotate: 6, petal: '#a4161a', light: '#e0405a', deep: '#7a0b20', highlight: '#ff7a8c' },
  { x: 190, y: 304, stem: 236, scale: 0.92, rotate: 13, petal: '#d62839', light: '#ff7a8c', deep: '#7a0b20', highlight: '#ffd0d6' },
  { x: 72, y: 300, stem: 226, scale: 0.88, rotate: -20, petal: '#b3122f', light: '#e0405a', deep: '#7a0b20', highlight: '#ff7a8c' },
  { x: 104, y: 318, stem: 228, scale: 0.96, rotate: -10, petal: '#d90429', light: '#ff5c7a', deep: '#7a0b20', highlight: '#ffd0d6' },
  { x: 152, y: 320, stem: 232, scale: 0.94, rotate: 3, petal: '#c9184a', light: '#f06d8a', deep: '#7a0b20', highlight: '#ff7a8c' },
  { x: 182, y: 316, stem: 214, scale: 0.88, rotate: 11, petal: '#a4161a', light: '#e0405a', deep: '#7a0b20', highlight: '#ff7a8c' },
];

const FULL_LAVENDER: LavenderStem[] = [
  { x: 66, y: 300, stem: 232, scale: 0.92, rotate: -16, petal: '#8b6bd1', light: '#a58ae0' },
  { x: 96, y: 314, stem: 246, scale: 1.04, rotate: -8, petal: '#8b6bd1', light: '#c9b6f2' },
  { x: 130, y: 318, stem: 258, scale: 1.08, rotate: -2, petal: '#a58ae0', light: '#c9b6f2' },
  { x: 164, y: 316, stem: 238, scale: 0.96, rotate: 7, petal: '#8b6bd1', light: '#a58ae0' },
  { x: 200, y: 306, stem: 218, scale: 0.88, rotate: 15, petal: '#a58ae0', light: '#c9b6f2' },
];

const COMPACT_ROSES = [FULL_ROSES[0], FULL_ROSES[2], FULL_ROSES[4], FULL_ROSES[6], FULL_ROSES[8]];
const COMPACT_LAVENDER = [FULL_LAVENDER[0], FULL_LAVENDER[2], FULL_LAVENDER[4]];

export function Bouquet({ className = '', compact = false, bare = false }: BouquetProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const glow = `bouquet-glow-${uid}`;
  const wrap = `bouquet-wrap-${uid}`;
  const roses = compact ? COMPACT_ROSES : FULL_ROSES;
  const lavender = compact ? COMPACT_LAVENDER : FULL_LAVENDER;

  return (
    <svg className={`bouquet ${className}`.trim()} viewBox="0 0 260 320" aria-hidden="true">
      <defs>
        <radialGradient id={glow} cx="50%" cy="26%" r="58%">
          <stop offset="0%" stopColor="#fff2c9" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffe0a8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffe0a8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={wrap} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff5ec" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#f3ddc8" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {!bare && <ellipse cx="130" cy="110" rx="126" ry="112" fill={`url(#${glow})`} />}

      <g className="bouquet__stems">
        {roses.map((rose, i) => (
          <Flower
            key={`rose-${i}`}
            x={rose.x}
            y={rose.y}
            stemHeight={rose.stem}
            headScale={rose.scale}
            rotate={rose.rotate}
            petal={rose.petal}
            petalLight={rose.light}
            petalDeep={rose.deep}
            petalHighlight={rose.highlight}
            center="#e7c98f"
            variant="rose"
          />
        ))}
        {lavender.map((sprig, i) => (
          <Flower
            key={`lavender-${i}`}
            x={sprig.x}
            y={sprig.y}
            stemHeight={sprig.stem}
            headScale={sprig.scale}
            rotate={sprig.rotate}
            petal={sprig.petal}
            petalLight={sprig.light}
            center="#8b6bd1"
            variant="lavender"
          />
        ))}
      </g>

      {!compact && !bare && (
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
      )}

      {!bare && (
        <>
          <path
            d="M 58 208 C 78 178 104 162 130 162 C 156 162 182 178 202 208 L 178 312 C 160 306 146 304 130 304 C 114 304 100 306 82 312 Z"
            fill={`url(#${wrap})`}
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
        </>
      )}
    </svg>
  );
}
