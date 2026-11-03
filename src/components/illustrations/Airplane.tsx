import { useId } from 'react';

export function Airplane() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const body = `plane-body-${uid}`;
  const wing = `plane-wing-${uid}`;
  const tail = `plane-tail-${uid}`;

  return (
    <g transform="scale(0.78)">
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffdfb" />
          <stop offset="55%" stopColor="#eaf3f8" />
          <stop offset="100%" stopColor="#cfe4ef" />
        </linearGradient>
        <linearGradient id={wing} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c5deea" />
          <stop offset="100%" stopColor="#94bfd4" />
        </linearGradient>
        <linearGradient id={tail} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f2a9bc" />
          <stop offset="100%" stopColor="#d27490" />
        </linearGradient>
      </defs>

      <path d="M 2 6 L 28 34 L 10 36 L -12 8 Z" fill={`url(#${wing})`} stroke="#7fb4cf" strokeWidth={1} strokeLinejoin="round" />
      <path d="M -4 8 L -18 26 L -8 28 L 6 10 Z" fill="#c5deea" stroke="#7fb4cf" strokeWidth={0.9} strokeLinejoin="round" opacity={0.85} />
      <path d="M 30 6 L 50 14 L 57 9 L 38 1 Z" fill={`url(#${wing})`} stroke="#7fb4cf" strokeWidth={0.9} strokeLinejoin="round" />
      <path d="M 26 -12 L 39 -36 L 50 -36 L 45 -9 Z" fill={`url(#${tail})`} stroke="#c96a86" strokeWidth={1} strokeLinejoin="round" />

      <path
        d="M -46 0 C -46 -9 -34 -16 -18 -17 L 22 -15 C 36 -13 46 -7 46 0 C 46 7 36 13 22 15 L -18 17 C -34 16 -46 9 -46 0 Z"
        fill={`url(#${body})`}
        stroke="#a9c8d8"
        strokeWidth={1.2}
      />
      <path
        d="M -44 2 C -36 8 -20 11 -2 11 L 24 9 C 36 8 43 5 45 1 C 40 8 30 12 22 13 L -18 15 C -32 14 -42 9 -44 2 Z"
        fill="#b7d4e2"
        opacity={0.7}
      />
      <path
        d="M -30 -9 C -24 -13 -15 -13 -11 -9 C -15 -2 -24 0 -30 -3 Z"
        fill="#8fc2dd"
        opacity={0.9}
      />
      <path d="M -28 -9 C -24 -11 -19 -11 -16 -9" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" fill="none" opacity={0.65} />
      <path d="M -18 2 C 0 5 22 6 42 2" stroke="#e89aae" strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M -18 2 C 0 5 22 6 42 2" stroke="#fff" strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.5} />

      {[-2, 8, 18, 28].map((x) => (
        <g key={x}>
          <circle cx={x} cy={-5} r={2.3} fill="#6f9db5" />
          <circle cx={x - 0.7} cy={-5.7} r={0.8} fill="#fff" opacity={0.8} />
        </g>
      ))}

      <path d="M -40 -1 C -38 -5 -34 -7 -30 -7" stroke="#fffdfb" strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0.8} />

      <path
        d="M 37 -22 C 34 -22 32 -25 33 -27 C 34 -29 36 -28 37 -26.5 C 38 -28 40 -29 41 -27 C 42 -25 40 -22 37 -22 Z"
        fill="#fff4e0"
        opacity={0.95}
      />
    </g>
  );
}
