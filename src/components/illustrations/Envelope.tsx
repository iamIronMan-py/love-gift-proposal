import { useId } from 'react';

export function Envelope({ className = '' }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const paper = `paper-${uid}`;
  const pocket = `pocket-${uid}`;
  const wax = `wax-${uid}`;

  return (
    <svg
      className={`envelope ${className}`}
      viewBox="0 0 460 360"
      role="img"
      aria-label="A sealed letter with a wax heart, surrounded by flowers"
    >
      <defs>
        <linearGradient id={paper} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#fffdfb" />
          <stop offset="100%" stopColor="#fbe9e4" />
        </linearGradient>
        <linearGradient id={pocket} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff8f1" />
          <stop offset="100%" stopColor="#f9ded9" />
        </linearGradient>
        <radialGradient id={wax} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#e37f9a" />
          <stop offset="62%" stopColor="#c96a86" />
          <stop offset="100%" stopColor="#a94e6b" />
        </radialGradient>
      </defs>

      <ellipse cx={230} cy={314} rx={164} ry={22} fill="#c99aae" opacity={0.18} />

      <g className="envelope__sprig envelope__sprig--left">
        <Sprig x={48} y={292} rotate={-38} flip />
      </g>
      <g className="envelope__sprig envelope__sprig--right">
        <Sprig x={416} y={96} rotate={146} />
      </g>

      <g className="envelope__body">
        <rect x={80} y={118} width={300} height={176} rx={20} fill={`url(#${paper})`} stroke="#f3c8cb" strokeWidth={1.5} />

        <g className="envelope__letter">
          <rect x={128} y={54} width={204} height={142} rx={11} fill="#fffefc" stroke="#f4d9d4" strokeWidth={1.2} />
          <rect x={128} y={54} width={204} height={142} rx={11} fill="none" stroke="#fff" strokeWidth={3} opacity={0.7} />
          <path d="M 154 88 C 196 84 246 84 306 88" stroke="#e9c9cb" strokeWidth={4} strokeLinecap="round" />
          <path d="M 154 106 C 206 102 256 102 306 106" stroke="#f0d9da" strokeWidth={3.2} strokeLinecap="round" />
          <path d="M 154 122 C 196 119 238 119 278 122" stroke="#f0d9da" strokeWidth={3.2} strokeLinecap="round" />
          <path
            d="M 292 126 C 286 126 282 121 285 117 C 287 114 291 115 292 118 C 293 115 297 114 299 117 C 302 121 298 126 292 126 Z"
            fill="#e89aae"
            opacity={0.8}
          />
        </g>

        <path
          d="M 80 140 L 230 238 L 380 140 L 380 274 Q 380 294 360 294 L 100 294 Q 80 294 80 274 Z"
          fill={`url(#${pocket})`}
          stroke="#f3c8cb"
          strokeWidth={1.5}
        />
        <path d="M 82 142 L 230 236 L 378 142" fill="none" stroke="#f6d6d4" strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M 82 292 L 196 208" stroke="#f7dedb" strokeWidth={2} strokeLinecap="round" />
        <path d="M 378 292 L 264 208" stroke="#f7dedb" strokeWidth={2} strokeLinecap="round" />

        <g className="envelope__seal">
          <circle cx={230} cy={226} r={34} fill={`url(#${wax})`} />
          <circle cx={230} cy={226} r={27} fill="none" stroke="#f0a9b8" strokeWidth={1.4} opacity={0.7} />
          <path
            d="M 230 242 C 219 242 212 233 217 225 C 221 218 228 221 230 227 C 232 221 239 218 243 225 C 248 233 241 242 230 242 Z"
            fill="#ffe7ea"
            opacity={0.9}
          />
          <path d="M 213 209 C 219 204 226 204 230 209" stroke="#f7c8d0" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.8} />
        </g>
      </g>

      <g className="envelope__sparkles" fill="#fff5d8">
        <Sparkle x={96} y={82} r={6} />
        <Sparkle x={384} y={250} r={5} />
        <Sparkle x={70} y={196} r={4} />
        <Sparkle x={398} y={180} r={4} />
      </g>
    </svg>
  );
}

function Sprig({ x, y, rotate = 0, flip = false }: { x: number; y: number; rotate?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})${flip ? ' scale(1 -1)' : ''}`}>
      <path d="M 0 0 C 18 -26 24 -54 14 -86" stroke="#8bb69a" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M 6 -22 C -14 -28 -22 -40 -24 -52 C -6 -50 4 -38 6 -22 Z" fill="#a9cdb2" />
      <path d="M 14 -40 C 32 -48 40 -60 42 -74 C 24 -70 14 -58 14 -40 Z" fill="#c4ddca" />
      <path d="M 16 -58 C -2 -64 -10 -76 -12 -88 C 4 -84 14 -72 16 -58 Z" fill="#a9cdb2" />
      <g transform="translate(14 -92)">
        {Array.from({ length: 5 }).map((_, i) => (
          <circle
            key={i}
            cx={Math.cos((i / 5) * Math.PI * 2) * 6}
            cy={Math.sin((i / 5) * Math.PI * 2) * 6}
            r={4.6}
            fill={i % 2 === 0 ? '#f2a9bc' : '#f9cbd6'}
          />
        ))}
        <circle r={3} fill="#e7c98f" />
      </g>
      <g transform="translate(-4 -64) scale(0.72)">
        {Array.from({ length: 5 }).map((_, i) => (
          <circle
            key={i}
            cx={Math.cos((i / 5) * Math.PI * 2) * 6}
            cy={Math.sin((i / 5) * Math.PI * 2) * 6}
            r={4.6}
            fill={i % 2 === 0 ? '#d8ccf4' : '#e7dff9'}
          />
        ))}
        <circle r={3} fill="#e7c98f" />
      </g>
    </g>
  );
}

function Sparkle({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      className="envelope__sparkle"
      d={`M ${x} ${y - r} C ${x + r * 0.22} ${y - r * 0.22} ${x + r * 0.22} ${y - r * 0.22} ${x + r} ${y} C ${x + r * 0.22} ${y + r * 0.22} ${x + r * 0.22} ${y + r * 0.22} ${x} ${y + r} C ${x - r * 0.22} ${y + r * 0.22} ${x - r * 0.22} ${y + r * 0.22} ${x - r} ${y} C ${x - r * 0.22} ${y - r * 0.22} ${x - r * 0.22} ${y - r * 0.22} ${x} ${y - r} Z`}
      opacity={0.8}
    />
  );
}
