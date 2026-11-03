import { useId } from 'react';

export function GiftParcel({ className = '' }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const front = `front-${uid}`;
  const side = `side-${uid}`;
  const top = `top-${uid}`;
  const gold = `gold-${uid}`;

  return (
    <svg
      className={`parcel-svg ${className}`}
      viewBox="0 0 320 300"
      role="img"
      aria-label="A blush pink gift parcel tied with a golden ribbon and a handwritten tag"
    >
      <defs>
        <linearGradient id={front} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#fbe0e8" />
          <stop offset="52%" stopColor="#f5c6d4" />
          <stop offset="100%" stopColor="#eaa9bc" />
        </linearGradient>
        <linearGradient id={side} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eaa9bc" />
          <stop offset="100%" stopColor="#d98ba2" />
        </linearGradient>
        <linearGradient id={top} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbe6ec" />
          <stop offset="100%" stopColor="#f2bccb" />
        </linearGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3dfb4" />
          <stop offset="52%" stopColor="#e7c98f" />
          <stop offset="100%" stopColor="#cfa963" />
        </linearGradient>
      </defs>

      <ellipse cx={172} cy={266} rx={132} ry={20} fill="#b98aa0" opacity={0.2} />

      <g className="parcel__float">
        <g className="parcel__sprig">
          <path d="M 72 116 C 52 92 50 66 62 44" stroke="#8bb69a" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M 66 100 C 46 96 36 84 34 70 C 52 72 62 84 66 100 Z" fill="#a9cdb2" />
          <path d="M 60 76 C 78 66 84 52 82 38 C 66 44 58 58 60 76 Z" fill="#c4ddca" />
          <g transform="translate(63 38)">
            {Array.from({ length: 5 }).map((_, i) => (
              <circle
                key={i}
                cx={Math.cos((i / 5) * Math.PI * 2) * 5.4}
                cy={Math.sin((i / 5) * Math.PI * 2) * 5.4}
                r={4.2}
                fill={i % 2 === 0 ? '#d8ccf4' : '#e7dff9'}
              />
            ))}
            <circle r={2.6} fill="#e7c98f" />
          </g>
        </g>

        <g className="parcel__box">
          <path d="M 68 120 L 100 88 L 284 88 L 252 120 Z" fill={`url(#${top})`} />
          <path d="M 252 120 L 284 88 L 284 216 L 252 248 Z" fill={`url(#${side})`} />
          <rect x={68} y={120} width={184} height={128} rx={12} fill={`url(#${front})`} />
          <rect x={68} y={120} width={184} height={128} rx={12} fill="none" stroke="#fff6f6" strokeWidth={2} opacity={0.5} />
          <path d="M 68 132 L 252 132" stroke="#fff8f8" strokeWidth={4} strokeLinecap="round" opacity={0.28} />

          <g className="parcel__ribbon">
            <path d="M 150 120 L 170 120 L 202 88 L 182 88 Z" fill={`url(#${gold})`} />
            <rect x={148} y={120} width={24} height={128} fill={`url(#${gold})`} />
            <rect x={68} y={176} width={184} height={20} fill={`url(#${gold})`} />
            <path d="M 252 176 L 284 144 L 284 164 L 252 196 Z" fill="#d5ad68" opacity={0.9} />
            <path d="M 150 120 L 170 120 L 202 88 L 182 88 Z" fill="#fff" opacity={0.16} />
            <rect x={68} y={176} width={184} height={7} fill="#fff" opacity={0.14} />
          </g>

          <g className="parcel__bow">
            <path
              d="M 176 90 C 146 62 124 80 148 98 C 156 104 168 98 176 90 Z"
              fill={`url(#${gold})`}
              stroke="#c9a45e"
              strokeWidth={1.4}
            />
            <path
              d="M 176 90 C 206 62 228 80 204 98 C 196 104 184 98 176 90 Z"
              fill={`url(#${gold})`}
              stroke="#c9a45e"
              strokeWidth={1.4}
            />
            <path d="M 168 94 C 156 112 150 120 142 132" stroke="#dcb878" strokeWidth={7} strokeLinecap="round" fill="none" />
            <path d="M 184 94 C 196 112 202 120 210 132" stroke="#dcb878" strokeWidth={7} strokeLinecap="round" fill="none" />
            <circle cx={176} cy={90} r={10} fill="#e7c98f" />
            <circle cx={173} cy={87} r={3} fill="#fff3d4" opacity={0.85} />
          </g>

          <g transform="translate(210 128) rotate(12)">
            <g className="parcel__tag">
              <path d="M -29 0 C -44 10 -46 24 -34 30" stroke="#c9a45e" strokeWidth={2} fill="none" strokeLinecap="round" />
              <rect x={-34} y={24} width={68} height={38} rx={8} fill="#fffdfb" stroke="#f0c2cb" strokeWidth={1.5} />
              <circle cx={-24} cy={34} r={2.8} fill="#f3d8de" />
              <text
                x={2}
                y={48}
                textAnchor="middle"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize={17}
                fontStyle="italic"
                fill="#9d4e68"
              >
                For you
              </text>
            </g>
          </g>
        </g>

        <g className="parcel__sparkles" fill="#fff5d8">
          <Sparkle x={44} y={172} r={6} />
          <Sparkle x={294} y={150} r={5} />
          <Sparkle x={286} y={248} r={4} />
          <Sparkle x={92} y={62} r={4.5} />
          <Sparkle x={254} y={58} r={3.6} />
        </g>
      </g>
    </svg>
  );
}

function Sparkle({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      className="parcel__sparkle"
      d={`M ${x} ${y - r} C ${x + r * 0.22} ${y - r * 0.22} ${x + r * 0.22} ${y - r * 0.22} ${x + r} ${y} C ${x + r * 0.22} ${y + r * 0.22} ${x + r * 0.22} ${y + r * 0.22} ${x} ${y + r} C ${x - r * 0.22} ${y + r * 0.22} ${x - r * 0.22} ${y + r * 0.22} ${x - r} ${y} C ${x - r * 0.22} ${y - r * 0.22} ${x - r * 0.22} ${y - r * 0.22} ${x} ${y - r} Z`}
      opacity={0.85}
    />
  );
}
