type FlowerVariant = 'daisy' | 'rose' | 'tulip' | 'poppy' | 'lavender';

type FlowerProps = {
  x: number;
  y: number;
  stemHeight?: number;
  headScale?: number;
  rotate?: number;
  petal?: string;
  petalLight?: string;
  petalDeep?: string;
  petalHighlight?: string;
  center?: string;
  variant?: FlowerVariant;
  leaves?: boolean;
  className?: string;
};

const LEAF = '#9fc7a9';
const LEAF_LIGHT = '#badbbf';
const STEM = '#7fae92';

export function Flower({
  x,
  y,
  stemHeight = 120,
  headScale = 1,
  rotate = 0,
  petal = '#b3122f',
  petalLight = '#e0405a',
  petalDeep = '#7a0b20',
  petalHighlight = '#ff7a8c',
  center = '#e7c98f',
  variant = 'daisy',
  leaves = true,
  className = '',
}: FlowerProps) {
  const h = stemHeight;
  const sway = h * 0.035;

  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={`flower ${className}`}>
        <path
          className="flower__stem"
          d={`M 0 0 C ${sway} ${-h * 0.34}, ${-sway} ${-h * 0.68}, 0 ${-h}`}
          stroke={STEM}
          strokeWidth={5}
          fill="none"
        />

        {leaves && (
          <g className="flower__leaves">
            <path
              d={`M 0 ${-h * 0.34} C -22 ${-h * 0.4}, -34 ${-h * 0.46}, -42 ${-h * 0.54} C -28 ${-h * 0.46}, -12 ${-h * 0.42}, 0 ${-h * 0.36} Z`}
              fill={LEAF}
            />
            <path
              d={`M 0 ${-h * 0.34} C -20 ${-h * 0.38}, -30 ${-h * 0.42}, -40 ${-h * 0.5}`}
              stroke={LEAF_LIGHT}
              strokeWidth={1.6}
              fill="none"
              opacity={0.8}
            />
            <path
              d={`M 1 ${-h * 0.52} C 22 ${-h * 0.58}, 34 ${-h * 0.64}, 42 ${-h * 0.72} C 28 ${-h * 0.64}, 12 ${-h * 0.6}, 1 ${-h * 0.54} Z`}
              fill={LEAF}
            />
            <path
              d={`M 1 ${-h * 0.52} C 20 ${-h * 0.56}, 30 ${-h * 0.6}, 40 ${-h * 0.68}`}
              stroke={LEAF_LIGHT}
              strokeWidth={1.6}
              fill="none"
              opacity={0.8}
            />
          </g>
        )}

        <g transform={`translate(0 ${-h}) rotate(${rotate}) scale(${headScale})`}>
          <g className="flower__head">
            <circle
              r={variant === 'rose' ? 27 : variant === 'lavender' ? 15 : 23}
              fill={petal}
              opacity={variant === 'lavender' ? 0.08 : 0.16}
            />
            {variant === 'daisy' && <Daisy petal={petal} petalLight={petalLight} center={center} />}
            {variant === 'poppy' && <Poppy petal={petal} petalLight={petalLight} center={center} />}
            {variant === 'rose' && (
              <Rose
                petal={petal}
                petalLight={petalLight}
                petalDeep={petalDeep}
                petalHighlight={petalHighlight}
                center={center}
              />
            )}
            {variant === 'tulip' && <Tulip petal={petal} petalLight={petalLight} center={center} />}
            {variant === 'lavender' && (
              <Lavender petal={petal} petalLight={petalLight} petalHighlight={petalHighlight} center={center} />
            )}
          </g>
        </g>
      </g>
    </g>
  );
}

function Daisy({
  petal,
  petalLight,
  center,
}: {
  petal: string;
  petalLight: string;
  center: string;
}) {
  return (
    <g>
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={i}
          className="flower__petal"
          cx={0}
          cy={-15}
          rx={7.5}
          ry={17}
          fill={i % 2 === 0 ? petal : petalLight}
          transform={`rotate(${i * 45})`}
        />
      ))}
      <circle r={8.5} fill={center} />
      <circle r={4.2} fill="#f6e3b9" />
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(a) * 4} cy={Math.sin(a) * 4} r={0.9} fill="#c9a45e" />;
      })}
    </g>
  );
}

function Poppy({
  petal,
  petalLight,
  center,
}: {
  petal: string;
  petalLight: string;
  center: string;
}) {
  return (
    <g>
      {Array.from({ length: 5 }).map((_, i) => (
        <ellipse
          key={i}
          className="flower__petal"
          cx={0}
          cy={-16}
          rx={13}
          ry={19}
          fill={i % 2 === 0 ? petal : petalLight}
          transform={`rotate(${i * 72})`}
        />
      ))}
      <circle r={7} fill={center} />
      <circle r={3.2} fill="#a98a4f" opacity={0.8} />
    </g>
  );
}

function Rose({
  petal,
  petalLight,
  petalDeep,
  petalHighlight,
  center,
}: {
  petal: string;
  petalLight: string;
  petalDeep: string;
  petalHighlight: string;
  center: string;
}) {
  const layers = [
    { count: 7, len: 26, width: 13, offset: 0, fill: petal, edge: petalDeep, edgeOpacity: 0.45 },
    { count: 6, len: 19, width: 10, offset: 26, fill: petalLight, edge: petalHighlight, edgeOpacity: 0.5 },
    { count: 5, len: 13, width: 7, offset: 12, fill: petal, edge: petalHighlight, edgeOpacity: 0.55 },
  ];
  return (
    <g>
      <circle r={27} fill={petalDeep} opacity={0.34} />
      {layers.map((layer, li) => (
        <g key={li}>
          {Array.from({ length: layer.count }).map((_, i) => (
            <ellipse
              key={i}
              className="flower__petal"
              cx={0}
              cy={-layer.len * 0.58}
              rx={layer.width}
              ry={layer.len}
              fill={layer.fill}
              stroke={layer.edge}
              strokeWidth={0.7}
              strokeOpacity={layer.edgeOpacity}
              transform={`rotate(${layer.offset + (i * 360) / layer.count})`}
            />
          ))}
        </g>
      ))}
      <circle r={7} fill={petalDeep} />
      <circle r={3.2} fill={center} opacity={0.92} />
      <path
        d="M -5 1 C -7 -5 -1 -9 4 -6 C 9 -3 6 4 0 5"
        fill="none"
        stroke={petalHighlight}
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={0.82}
      />
      <path
        d="M -2 3 C -4 0 0 -4 3 -3"
        fill="none"
        stroke={center}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={0.72}
      />
    </g>
  );
}

function Lavender({
  petal,
  petalLight,
  petalHighlight,
  center,
}: {
  petal: string;
  petalLight: string;
  petalHighlight: string;
  center: string;
}) {
  const florets = Array.from({ length: 18 }, (_, i) => {
    const t = i / 17;
    return {
      x: Math.sin(t * Math.PI * 2.1) * 7 * (1 - t * 0.3),
      y: -7 - t * 63,
      r: 4.6 - t * 1.7,
      fill: i % 3 === 0 ? petalLight : i % 3 === 1 ? petal : petalHighlight,
    };
  });
  return (
    <g>
      <path d="M 0 3 C -3 -18 3 -43 0 -73" stroke="#7fae92" strokeWidth={2.6} fill="none" />
      {florets.map((floret, i) => (
        <circle
          key={i}
          className="flower__petal"
          cx={floret.x}
          cy={floret.y}
          r={floret.r}
          fill={floret.fill}
          opacity={0.96}
        />
      ))}
      {florets
        .filter((_, i) => i % 2 === 0)
        .map((floret, i) => (
          <circle
            key={`highlight-${i}`}
            cx={floret.x - 0.9}
            cy={floret.y - 1}
            r={floret.r * 0.34}
            fill="#f3e6ff"
            opacity={0.72}
          />
        ))}
      <circle cy={-77} r={2.8} fill={petalLight} />
      <circle cy={-83} r={1.7} fill={center} opacity={0.9} />
    </g>
  );
}

function Tulip({
  petal,
  petalLight,
  center,
}: {
  petal: string;
  petalLight: string;
  center: string;
}) {
  return (
    <g>
      <path
        className="flower__petal"
        d="M 0 2 C -16 -4 -20 -28 -9 -40 C -3 -47 0 -36 0 -28 C 0 -36 3 -47 9 -40 C 20 -28 16 -4 0 2 Z"
        fill={petal}
      />
      <path
        className="flower__petal"
        d="M 0 2 C -12 -6 -14 -26 -5 -38 C 0 -45 0 -30 0 -20 Z"
        fill={petalLight}
        opacity={0.9}
      />
      <path
        d="M 0 -2 L 0 -26"
        stroke={center}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.55}
      />
      <circle cy={-1} r={5} fill={center} opacity={0.9} />
    </g>
  );
}
