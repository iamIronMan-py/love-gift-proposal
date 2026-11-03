type FlowerVariant = 'daisy' | 'rose' | 'tulip' | 'poppy';

type FlowerProps = {
  x: number;
  y: number;
  stemHeight?: number;
  headScale?: number;
  rotate?: number;
  petal?: string;
  petalLight?: string;
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
  petal = '#f2a9bc',
  petalLight = '#f9cbd6',
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
            <circle r={variant === 'rose' ? 27 : 23} fill={petal} opacity={0.16} />
            {variant === 'daisy' && <Daisy petal={petal} petalLight={petalLight} center={center} />}
            {variant === 'poppy' && <Poppy petal={petal} petalLight={petalLight} center={center} />}
            {variant === 'rose' && <Rose petal={petal} petalLight={petalLight} center={center} />}
            {variant === 'tulip' && <Tulip petal={petal} petalLight={petalLight} center={center} />}
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
  center,
}: {
  petal: string;
  petalLight: string;
  center: string;
}) {
  const layers = [
    { count: 7, len: 25, width: 12, offset: 0, fill: petal },
    { count: 6, len: 18, width: 9, offset: 25, fill: petalLight },
    { count: 5, len: 12, width: 7, offset: 12, fill: petal },
  ];
  return (
    <g>
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
              transform={`rotate(${layer.offset + (i * 360) / layer.count})`}
            />
          ))}
        </g>
      ))}
      <circle r={6.5} fill={center} />
      <path
        d="M -5 0 C -5 -6 2 -8 5 -3 C 7 1 1 5 -3 3"
        fill="none"
        stroke={center}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.75}
      />
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
