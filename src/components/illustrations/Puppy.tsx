import { useId } from 'react';

type PuppyProps = {
  withParcel?: boolean;
  crown?: boolean;
  withRose?: boolean;
  className?: string;
};

export function Puppy({ withParcel = false, crown = false, withRose = false, className = '' }: PuppyProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const fur = `fur-${uid}`;
  const ear = `ear-${uid}`;
  const muzzle = `muzzle-${uid}`;
  const parcel = `parcel-${uid}`;
  const glow = `glow-${uid}`;

  return (
    <g className={`puppy ${className}`}>
      <defs>
        <linearGradient id={fur} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9e8ca" />
          <stop offset="58%" stopColor="#f2d7ab" />
          <stop offset="100%" stopColor="#e8c492" />
        </linearGradient>
        <linearGradient id={ear} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eec294" />
          <stop offset="100%" stopColor="#d99f6c" />
        </linearGradient>
        <radialGradient id={muzzle} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#fff8ea" />
          <stop offset="100%" stopColor="#fbe9cc" />
        </radialGradient>
        <linearGradient id={parcel} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7c8d8" />
          <stop offset="100%" stopColor="#e89aae" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe7ad" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffe7ad" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="puppy__tail">
        <path
          d="M 220 246 C 262 258 296 228 282 190 C 272 162 244 164 244 186"
          fill="none"
          stroke={`url(#${ear})`}
          strokeWidth={27}
          strokeLinecap="round"
        />
        <path
          d="M 220 246 C 260 256 290 228 278 194 C 270 172 250 172 250 188"
          fill="none"
          stroke="#f8dfb8"
          strokeWidth={11}
          strokeLinecap="round"
          opacity={0.65}
        />
        <circle cx={278} cy={188} r={9} fill="#f2cfa1" opacity={0.85} />
      </g>

      <g className="puppy__body">
        <ellipse cx={160} cy={238} rx={82} ry={68} fill={`url(#${fur})`} />
        <path
          d="M 112 214 C 120 262 200 262 208 214 C 216 252 198 300 160 300 C 122 300 104 252 112 214 Z"
          fill="#fff5e4"
          opacity={0.6}
        />
        <ellipse cx={126} cy={302} rx={31} ry={20} fill="#fff5e4" />
        <ellipse cx={194} cy={302} rx={31} ry={20} fill="#fff5e4" />
      </g>

      <g className="puppy__head">
        <g className="puppy__ear puppy__ear--left">
          <path
            d="M 110 116 C 82 112 60 140 60 178 C 60 206 78 218 96 204 C 112 192 116 166 120 140 Z"
            fill={`url(#${ear})`}
          />
          <path
            d="M 97 138 C 82 144 77 166 83 186 C 89 199 100 195 104 182 C 108 168 105 150 97 138 Z"
            fill="#f4c8c5"
            opacity={0.9}
          />
        </g>
        <g className="puppy__ear puppy__ear--right">
          <path
            d="M 210 116 C 238 112 260 140 260 178 C 260 206 242 218 224 204 C 208 192 204 166 200 140 Z"
            fill={`url(#${ear})`}
          />
          <path
            d="M 223 138 C 238 144 243 166 237 186 C 231 199 220 195 216 182 C 212 168 215 150 223 138 Z"
            fill="#f4c8c5"
            opacity={0.9}
          />
        </g>

        <ellipse cx={160} cy={148} rx={80} ry={70} fill={`url(#${fur})`} />
        <path
          d="M 160 80 C 190 90 206 118 198 150 C 184 138 172 134 160 134 C 148 134 136 138 122 150 C 114 118 130 90 160 80 Z"
          fill="#fff6e7"
          opacity={0.72}
        />

        <ellipse cx={110} cy={178} rx={13} ry={8} fill="#f4a6b4" opacity={0.42} />
        <ellipse cx={210} cy={178} rx={13} ry={8} fill="#f4a6b4" opacity={0.42} />

        <g className="puppy__eye puppy__eye--left">
          <ellipse cx={130} cy={146} rx={11} ry={13} fill="#46353f" />
          <circle cx={126} cy={141} r={4.1} fill="#fffdfb" />
          <circle cx={134} cy={151} r={2} fill="#fffdfb" opacity={0.72} />
        </g>
        <g className="puppy__eye puppy__eye--right">
          <ellipse cx={190} cy={146} rx={11} ry={13} fill="#46353f" />
          <circle cx={186} cy={141} r={4.1} fill="#fffdfb" />
          <circle cx={194} cy={151} r={2} fill="#fffdfb" opacity={0.72} />
        </g>

        <ellipse cx={160} cy={184} rx={47} ry={34} fill={`url(#${muzzle})`} />

        <path
          d="M 160 164 C 150 164 144 170 144 177 C 144 185 152 191 160 195 C 168 191 176 185 176 177 C 176 170 170 164 160 164 Z"
          fill="#46353f"
        />
        <path
          d="M 151 170 C 154 166 158 167 160 170"
          stroke="#fffdfb"
          strokeWidth={2.1}
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
        />
        <path
          d="M 160 195 L 160 204 M 160 204 C 151 211 142 208 138 201 M 160 204 C 169 211 178 208 182 201"
          stroke="#46353f"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
        <path d="M 152 207 C 152 216 168 216 168 207 Z" fill="#ef8fa0" />

        {withRose && (
          <g className="puppy__rose" transform="translate(168 194) rotate(24)">
            <path d="M 0 -2 C 6 10 14 22 20 34" stroke="#6f9b73" strokeWidth="3.4" fill="none" strokeLinecap="round" />
            <ellipse cx="6" cy="14" rx="5.4" ry="2.8" fill="#8fb996" transform="rotate(-24 6 14)" />
            <ellipse cx="12" cy="24" rx="4.6" ry="2.4" fill="#9fc7a9" transform="rotate(18 12 24)" />
            <g transform="translate(20 34)">
              <circle cx="0" cy="-5.4" r="5.6" fill="#d62839" />
              <circle cx="5" cy="-1.8" r="5.4" fill="#e0405a" />
              <circle cx="3.2" cy="4.2" r="5.2" fill="#b3122f" />
              <circle cx="-3.2" cy="4.2" r="5.2" fill="#c9184a" />
              <circle cx="-5" cy="-1.8" r="5.4" fill="#e0405a" />
              <circle cx="0" cy="0.2" r="3.6" fill="#7a0b20" />
            </g>
          </g>
        )}

        {crown && <Crown />}
      </g>

      {withParcel && (
        <g className="puppy__parcel">
          <circle cx={160} cy={238} r={72} fill={`url(#${glow})`} />
          <rect x={116} y={204} width={88} height={72} rx={13} fill={`url(#${parcel})`} />
          <rect x={116} y={204} width={88} height={19} rx={10} fill="#fbe3ea" />
          <rect x={151} y={204} width={18} height={72} fill="#e7c98f" />
          <rect x={116} y={238} width={88} height={13} fill="#e7c98f" />
          <ellipse cx={160} cy={206} rx={26} ry={11} fill="#f2d7ab" opacity={0.6} />
          <path
            d="M 160 207 C 149 207 143 199 147 192 C 151 186 158 189 160 194 C 162 189 169 186 173 192 C 177 199 171 207 160 207 Z"
            fill="#c96a86"
          />
          <path
            d="M 160 258 C 151 258 146 251 150 246 C 153 242 158 244 160 248 C 162 244 167 242 170 246 C 174 251 169 258 160 258 Z"
            fill="#fffdfb"
            opacity={0.85}
          />
        </g>
      )}

      <g className="puppy__paws">
        <ellipse cx={128} cy={292} rx={32} ry={21} fill="#fff5e4" />
        <ellipse cx={192} cy={292} rx={32} ry={21} fill="#fff5e4" />
        <path
          d="M 118 296 L 118 304 M 129 296 L 129 305 M 140 296 L 140 304"
          stroke="#e5c79e"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="M 182 296 L 182 304 M 193 296 L 193 305 M 204 296 L 204 304"
          stroke="#e5c79e"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function Crown() {
  const flowers = [
    { x: 116, y: 106, color: '#f2a9bc', light: '#f9cbd6' },
    { x: 140, y: 96, color: '#d8ccf4', light: '#e7dff9' },
    { x: 160, y: 92, color: '#f6d6a7', light: '#fbe8c9' },
    { x: 180, y: 96, color: '#d8ccf4', light: '#e7dff9' },
    { x: 204, y: 106, color: '#f2a9bc', light: '#f9cbd6' },
  ];
  return (
    <g className="puppy__crown">
      {flowers.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y})`}>
          {Array.from({ length: 5 }).map((_, j) => (
            <circle
              key={j}
              cx={Math.cos((j / 5) * Math.PI * 2) * 5.2}
              cy={Math.sin((j / 5) * Math.PI * 2) * 5.2}
              r={3.9}
              fill={j % 2 === 0 ? f.color : f.light}
            />
          ))}
          <circle r={2.6} fill="#c9a45e" />
        </g>
      ))}
      <path
        d="M 118 108 C 138 96 182 96 202 108"
        stroke="#9fc7a9"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        opacity={0.8}
      />
    </g>
  );
}
