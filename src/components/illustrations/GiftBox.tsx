import { useId } from 'react';

export function GiftBox({ className = '' }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const front = `box-front-${uid}`;
  const side = `box-side-${uid}`;
  const top = `box-top-${uid}`;
  const gold = `box-gold-${uid}`;
  const glow = `box-glow-${uid}`;

  return (
    <svg
      className={`box-svg ${className}`}
      viewBox="0 0 420 400"
      role="img"
      aria-label="A blush gift box with a golden ribbon, opening to reveal a glowing bouquet"
    >
      <defs>
        <linearGradient id={front} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fbe2e9" />
          <stop offset="55%" stopColor="#f4c4d2" />
          <stop offset="100%" stopColor="#e8a3b7" />
        </linearGradient>
        <linearGradient id={side} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8a3b7" />
          <stop offset="100%" stopColor="#d4879d" />
        </linearGradient>
        <linearGradient id={top} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcebf0" />
          <stop offset="100%" stopColor="#f1b9c8" />
        </linearGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3dfb4" />
          <stop offset="50%" stopColor="#e7c98f" />
          <stop offset="100%" stopColor="#cfa963" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff2c9" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffe3a6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffe3a6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx={218} cy={352} rx={152} ry={22} fill="#b98aa0" opacity={0.2} />

      <circle className="box-glow" cx={218} cy={214} r={150} fill={`url(#${glow})`} opacity={0.55} />

      <path d="M 112 220 L 140 192 L 336 192 L 308 220 Z" fill="#a96a80" />
      <ellipse cx={224} cy={208} rx={80} ry={22} fill="#7d465a" opacity={0.65} />

      <g className="box__contents">
        <Bouquet />
      </g>

      <rect x={112} y={220} width={196} height={112} rx={10} fill={`url(#${front})`} />
      <path d="M 308 220 L 336 192 L 336 304 L 308 332 Z" fill={`url(#${side})`} />
      <rect x={112} y={220} width={196} height={112} rx={10} fill="none" stroke="#fff6f6" strokeWidth={2} opacity={0.45} />
      <path d="M 112 232 L 308 232" stroke="#fff8f8" strokeWidth={4} strokeLinecap="round" opacity={0.25} />

      <g className="box__ribbon">
        <rect x={198} y={220} width={24} height={112} fill={`url(#${gold})`} />
        <rect x={112} y={268} width={196} height={18} fill={`url(#${gold})`} />
        <path d="M 308 268 L 336 240 L 336 258 L 308 286 Z" fill="#d5ad68" />
        <rect x={112} y={268} width={196} height={6} fill="#fff" opacity={0.15} />
      </g>

      <g className="box__lid">
        <path d="M 112 184 L 140 156 L 336 156 L 308 184 Z" fill={`url(#${top})`} />
        <path d="M 308 184 L 336 156 L 336 178 L 308 206 Z" fill={`url(#${side})`} />
        <rect x={112} y={184} width={196} height={24} rx={7} fill={`url(#${front})`} />
        <rect x={112} y={184} width={196} height={7} fill="#fff" opacity={0.26} />
        <path d="M 198 184 L 222 184 L 244 156 L 220 156 Z" fill={`url(#${gold})`} />
        <path d="M 206 174 L 250 174 L 272 146 L 228 146 Z" fill={`url(#${gold})`} opacity={0.95} />
        <rect x={198} y={184} width={24} height={22} fill={`url(#${gold})`} />

        <g className="box__bow">
          <path
            d="M 218 158 C 182 126 158 148 186 168 C 195 175 208 167 218 158 Z"
            fill={`url(#${gold})`}
            stroke="#c9a45e"
            strokeWidth={1.4}
          />
          <path
            d="M 218 158 C 254 126 278 148 250 168 C 241 175 228 167 218 158 Z"
            fill={`url(#${gold})`}
            stroke="#c9a45e"
            strokeWidth={1.4}
          />
          <path d="M 209 164 C 196 184 188 192 178 204" stroke="#dcb878" strokeWidth={8} strokeLinecap="round" fill="none" />
          <path d="M 227 164 C 240 184 248 192 258 204" stroke="#dcb878" strokeWidth={8} strokeLinecap="round" fill="none" />
          <circle cx={218} cy={158} r={11} fill="#e7c98f" />
          <circle cx={214} cy={154} r={3.4} fill="#fff3d4" opacity={0.9} />
        </g>
      </g>

      <g className="box__sparkles" fill="#fff6d8">
        <Sparkle x={82} y={150} r={6} />
        <Sparkle x={352} y={124} r={5} />
        <Sparkle x={368} y={284} r={4.5} />
        <Sparkle x={66} y={286} r={4} />
        <Sparkle x={300} y={82} r={3.6} />
      </g>
    </svg>
  );
}

function Bouquet() {
  const flowers = [
    { x: -38, y: -58, scale: 1, color: '#f2a9bc', light: '#f9cbd6' },
    { x: -16, y: -80, scale: 1.16, color: '#d8ccf4', light: '#e7dff9' },
    { x: 10, y: -94, scale: 1.28, color: '#f6d6a7', light: '#fbe8c9' },
    { x: 34, y: -76, scale: 1.08, color: '#f2a9bc', light: '#f9cbd6' },
    { x: 52, y: -52, scale: 0.9, color: '#d8ccf4', light: '#e7dff9' },
  ];

  return (
    <g transform="translate(224 216)">
      <path d="M 0 0 C -30 -28 -38 -46 -40 -58" stroke="#7fae92" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d="M 0 0 C -16 -40 -16 -66 -16 -80" stroke="#7fae92" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d="M 0 0 C 0 -46 6 -78 10 -94" stroke="#7fae92" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d="M 0 0 C 18 -38 28 -62 34 -76" stroke="#7fae92" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d="M 0 0 C 30 -24 44 -40 52 -52" stroke="#7fae92" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d="M -8 -30 C -28 -34 -36 -44 -40 -54 C -22 -52 -12 -42 -8 -30 Z" fill="#a9cdb2" />
      <path d="M 10 -42 C 30 -48 40 -58 44 -70 C 26 -66 14 -56 10 -42 Z" fill="#c4ddca" />
      {flowers.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) scale(${f.scale})`}>
          {Array.from({ length: 5 }).map((_, j) => (
            <ellipse
              key={j}
              cx={0}
              cy={-9}
              rx={5.6}
              ry={9.6}
              fill={j % 2 === 0 ? f.color : f.light}
              transform={`rotate(${j * 72})`}
            />
          ))}
          <circle r={4.6} fill="#e7c98f" />
          <circle r={2} fill="#c9a45e" />
        </g>
      ))}
      <circle cx={8} cy={-32} r={20} fill="#fff6d8" opacity={0.32} />
    </g>
  );
}

function Sparkle({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      className="box__sparkle"
      d={`M ${x} ${y - r} C ${x + r * 0.22} ${y - r * 0.22} ${x + r * 0.22} ${y - r * 0.22} ${x + r} ${y} C ${x + r * 0.22} ${y + r * 0.22} ${x + r * 0.22} ${y + r * 0.22} ${x} ${y + r} C ${x - r * 0.22} ${y + r * 0.22} ${x - r * 0.22} ${y + r * 0.22} ${x - r} ${y} C ${x - r * 0.22} ${y - r * 0.22} ${x - r * 0.22} ${y - r * 0.22} ${x} ${y - r} Z`}
      opacity={0.85}
    />
  );
}
