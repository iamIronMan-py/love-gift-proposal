import { useId, type RefObject } from 'react';
import { Airplane } from './Airplane';

type Point = { x: number; y: number };

export const FLIGHT: { p0: Point; p1: Point; p2: Point; p3: Point } = {
  p0: { x: 640, y: 292 },
  p1: { x: 560, y: 110 },
  p2: { x: 340, y: 110 },
  p3: { x: 222, y: 190 },
};

export const FLIGHT_PATH = `M ${FLIGHT.p0.x} ${FLIGHT.p0.y} C ${FLIGHT.p1.x} ${FLIGHT.p1.y}, ${FLIGHT.p2.x} ${FLIGHT.p2.y}, ${FLIGHT.p3.x} ${FLIGHT.p3.y}`;

export function flightPoint(t: number): Point {
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;
  return {
    x: a * FLIGHT.p0.x + b * FLIGHT.p1.x + c * FLIGHT.p2.x + d * FLIGHT.p3.x,
    y: a * FLIGHT.p0.y + b * FLIGHT.p1.y + c * FLIGHT.p2.y + d * FLIGHT.p3.y,
  };
}

export function flightTangent(t: number): Point {
  const mt = 1 - t;
  return {
    x: 3 * mt * mt * (FLIGHT.p1.x - FLIGHT.p0.x) + 6 * mt * t * (FLIGHT.p2.x - FLIGHT.p1.x) + 3 * t * t * (FLIGHT.p3.x - FLIGHT.p2.x),
    y: 3 * mt * mt * (FLIGHT.p1.y - FLIGHT.p0.y) + 6 * mt * t * (FLIGHT.p2.y - FLIGHT.p1.y) + 3 * t * t * (FLIGHT.p3.y - FLIGHT.p2.y),
  };
}

type WorldMapProps = {
  planeRef: RefObject<SVGGElement | null>;
  routeRef: RefObject<SVGPathElement | null>;
};

export function WorldMap({ planeRef, routeRef }: WorldMapProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const dots = `dots-${uid}`;
  const sky = `sky-${uid}`;
  const route = `route-${uid}`;
  const continents = `continents-${uid}`;

  return (
    <svg
      className="map-card__svg"
      viewBox="0 0 900 520"
      role="img"
      aria-label="A stylised world map showing a plane flying from Dubai to Paris"
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fdf6ee" />
          <stop offset="48%" stopColor="#eef6f7" />
          <stop offset="100%" stopColor="#e3f0f4" />
        </linearGradient>
        <pattern id={dots} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.7" fill="#a9c8ae" />
        </pattern>
        <linearGradient id={route} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e7c98f" />
          <stop offset="46%" stopColor="#e89aae" />
          <stop offset="100%" stopColor="#a794d6" />
        </linearGradient>
        <radialGradient id={`pin-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6dc" />
          <stop offset="100%" stopColor="#e7c98f" />
        </radialGradient>

        <g id={continents}>
          <path d="M 128 150 C 150 118 196 104 244 116 C 286 126 320 148 326 178 C 332 206 314 224 300 244 C 288 262 272 278 250 276 C 230 274 222 256 206 244 C 186 228 158 222 142 204 C 128 188 118 168 128 150 Z" />
          <path d="M 300 86 C 320 78 342 88 344 106 C 346 124 330 136 314 130 C 298 124 290 104 300 86 Z" />
          <path d="M 262 306 C 286 296 312 306 316 336 C 320 366 306 402 288 432 C 276 452 256 456 248 438 C 240 420 244 394 240 372 C 236 346 244 318 262 306 Z" />
          <path d="M 438 148 C 456 128 486 122 508 134 C 528 145 536 164 526 180 C 516 196 494 200 476 192 C 456 183 434 172 432 160 C 431 155 432 151 438 148 Z" />
          <path d="M 420 146 C 428 138 440 140 442 148 C 444 156 436 162 428 158 C 420 154 416 150 420 146 Z" />
          <path d="M 462 208 C 490 196 524 204 540 230 C 556 258 552 292 538 322 C 526 348 510 374 492 382 C 474 390 462 372 458 350 C 452 318 442 286 446 256 C 448 236 452 216 462 208 Z" />
          <path d="M 548 326 C 556 320 564 326 564 338 C 564 350 556 360 550 356 C 544 352 542 334 548 326 Z" />
          <path d="M 520 142 C 548 116 598 106 648 114 C 706 124 766 144 812 174 C 850 198 858 230 836 250 C 814 270 776 266 748 272 C 718 278 690 290 662 282 C 634 274 618 250 594 238 C 570 226 544 212 532 190 C 522 174 514 154 520 142 Z" />
          <path d="M 792 262 C 800 256 810 260 812 270 C 814 280 806 288 798 284 C 790 280 786 268 792 262 Z" />
          <path d="M 832 298 C 840 292 848 296 848 306 C 848 316 840 322 834 318 C 828 314 826 304 832 298 Z" />
          <path d="M 744 370 C 766 358 798 360 816 376 C 834 392 830 414 810 422 C 790 430 762 424 748 410 C 736 398 734 380 744 370 Z" />
          <path d="M 850 430 C 856 426 864 430 862 438 C 860 446 850 448 846 442 C 842 436 844 432 850 430 Z" />
        </g>
      </defs>

      <rect width="900" height="520" fill={`url(#${sky})`} />

      <g opacity="0.32" stroke="#bcd8de" fill="none" strokeWidth="1" strokeDasharray="2 8">
        <path d="M 40 250 C 240 218 660 218 860 250" />
        <path d="M 60 360 C 280 330 620 330 840 360" />
        <path d="M 60 150 C 270 128 630 128 840 150" />
        <path d="M 300 96 C 282 240 282 386 300 500" />
        <path d="M 600 96 C 582 240 582 386 600 500" />
      </g>

      <g transform="translate(170 300)">
        <g className="map-cloud" fill="#fffdfb" opacity="0.65">
          <ellipse cx="-22" cy="4" rx="28" ry="12" />
          <ellipse cx="4" cy="0" rx="40" ry="15" />
          <ellipse cx="30" cy="-7" rx="28" ry="13" />
        </g>
      </g>
      <g transform="translate(420 380)">
        <g className="map-cloud" fill="#fffdfb" opacity="0.55">
          <ellipse cx="-18" cy="3" rx="22" ry="10" />
          <ellipse cx="4" cy="0" rx="32" ry="12" />
          <ellipse cx="26" cy="-6" rx="22" ry="10" />
        </g>
      </g>
      <g transform="translate(742 386)">
        <g className="map-cloud" fill="#fffdfb" opacity="0.5">
          <ellipse cx="-14" cy="2" rx="18" ry="8" />
          <ellipse cx="6" cy="0" rx="26" ry="10" />
          <ellipse cx="24" cy="-5" rx="18" ry="8" />
        </g>
      </g>

      <use href={`#${continents}`} fill="#edf4ea" />
      <use href={`#${continents}`} fill={`url(#${dots})`} opacity="0.62" />
      <use href={`#${continents}`} fill="none" stroke="#c8decb" strokeWidth="1.6" />

      <path d={FLIGHT_PATH} fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" opacity="0.55" />
      <path d={FLIGHT_PATH} fill="none" stroke="#c9b7b9" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="3 10" opacity="0.4" />
      <path
        ref={routeRef}
        className="map-route"
        d={FLIGHT_PATH}
        stroke={`url(#${route})`}
      />

      <g transform={`translate(${FLIGHT.p0.x} ${FLIGHT.p0.y})`}>
        <g className="map-pin map-pin--origin">
          <circle r="30" fill="#e7c98f" opacity="0.12" />
          <circle r="16" fill="#e7c98f" opacity="0.2" />
          <circle r="7.5" fill={`url(#pin-${uid})`} />
          <circle r="3" fill="#fffdfb" />
          <g transform="translate(18 -19)">
            <rect className="map-plate" x="0" y="0" width="142" height="40" rx="20" />
            <text className="map-label" x="16" y="17" fill="#9d4e68">
              DUBAI
            </text>
            <text className="map-label map-label--sub" x="16" y="31">
              United Arab Emirates
            </text>
          </g>
        </g>
      </g>

      <g transform={`translate(${FLIGHT.p3.x} ${FLIGHT.p3.y})`}>
        <g className="map-pin map-pin--dest">
          <circle r="30" fill="#8bb69a" opacity="0.13" />
          <circle r="16" fill="#8bb69a" opacity="0.2" />
          <circle r="7.5" fill="#a9c8ae" />
          <circle r="3" fill="#fffdfb" />
          <g transform="translate(-16 -50)">
            <rect className="map-plate" x="-136" y="0" width="136" height="40" rx="20" />
            <text className="map-label" x="-16" y="17" textAnchor="end" fill="#5f8d71">
              PARIS
            </text>
            <text className="map-label map-label--sub" x="-16" y="31" textAnchor="end">
              Your gift is here
            </text>
          </g>
        </g>
      </g>

      <g className="map-distance" transform="translate(438 66)">
        <rect x="-94" y="-17" width="188" height="34" rx="17" fill="rgba(255,253,251,0.72)" stroke="rgba(255,255,255,0.95)" />
        <path
          d="M -72 -2 C -76 -2 -78 -6 -76 -9 C -74 -11 -71 -10 -70 -8 C -69 -10 -66 -11 -64 -9 C -62 -6 -64 -2 -72 -2 Z"
          fill="#e89aae"
        />
        <text x="0" y="5" textAnchor="middle" fontFamily="'Quicksand', sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.12em" fill="#9d4e68">
          11,000 KM OF LOVE
        </text>
      </g>

      <g ref={planeRef} className="map-plane" transform={`translate(${FLIGHT.p0.x} ${FLIGHT.p0.y})`}>
        <Airplane />
      </g>

      <g transform="translate(818 438)" opacity="0.5">
        <circle r="27" fill="none" stroke="#b9cfd6" strokeWidth="1" />
        <path d="M 0 -23 L 5 -5 L 23 0 L 5 5 L 0 23 L -5 5 L -23 0 L -5 -5 Z" fill="#a9c8ae" />
        <circle r="3" fill="#fffdfb" />
        <text y="-33" textAnchor="middle" fontFamily="'Quicksand', sans-serif" fontSize="9" fontWeight="700" fill="#7d959b">
          N
        </text>
      </g>
    </svg>
  );
}
