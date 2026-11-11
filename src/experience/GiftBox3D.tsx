import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

type Props = {
  open: number; // 0..1
  auto?: boolean;
};

export const GiftBox3D = forwardRef<HTMLDivElement, Props>(function GiftBox3D({ open }, ref) {
  const rootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const t = Math.max(0, Math.min(1, open));
    const lid = root.querySelector('[data-box-lid]') as HTMLElement | null;
    const contents = root.querySelector('[data-box-contents]') as HTMLElement | null;
    const glow = root.querySelector('[data-box-glow]') as HTMLElement | null;
    const float = root.querySelector('[data-box-float]') as HTMLElement | null;
    if (lid) lid.style.transform = `translateZ(0px) rotateX(${t * -118}deg) translateY(${-t * 20}px)`;
    if (contents) { contents.style.opacity = String(t); contents.style.transform = `translateY(${-t * 110}px) scale(${0.8 + t * 0.25})`; }
    if (glow) glow.style.opacity = String(0.15 + t * 0.85);
    if (float) float.style.transform = `translateY(${-6 - t * 8}px) rotateX(${-12 - t * 4}deg) rotateY(${18 + t * 10}deg)`;
  }, [open]);
  return (
    <div className="box3d" data-box aria-hidden="true" ref={rootRef}>
      <div className="box3d__halo" />
      <div className="box3d__scene">
        <div className="box3d__float" data-box-float>
          <div className="box3d__glow" data-box-glow />
          <div className="box3d__cube">
            <div className="box3d__face box3d__face--back" />
            <div className="box3d__face box3d__face--left" />
            <div className="box3d__face box3d__face--right" />
            <div className="box3d__face box3d__face--bottom" />
            <div className="box3d__face box3d__face--front" />

            <div className="box3d__contents" data-box-contents>
              <div className="box3d__spin">
                <svg viewBox="0 0 320 420" className="box3d__bouquet">
                  <g transform="translate(160 230)">
                    <ellipse cx="0" cy="90" rx="60" ry="24" fill="rgba(0,0,0,0.12)" />
                    <g>
                      {[-40,-20,0,20,40,-30,-10,10,30].map((x,i)=>(<g key={i} transform={`translate(${x} ${-40 - (i%3)*18}) rotate(${x/3})`}><line x1="0" y1="0" x2="0" y2="120" stroke="#4f7d4a" strokeWidth="4" /><circle cx="0" cy="0" r={18 + (i%3)*4} fill={['#b3122f','#e0405a','#8b6bd1','#c9b6f2','#f2c14e'][i%5]} /><circle cx="-4" cy="-4" r={6} fill="rgba(255,255,255,.5)" /></g>))}
                    </g>
                    <path d="M -58 40 L 0 150 L 58 40 Z" fill="#f6dccb" stroke="#e8c0a8" />
                    <path d="M -50 40 L 0 130 L 50 40" fill="none" stroke="#d9a78d" strokeWidth="3" />
                    <path d="M -28 46 Q 0 70 28 46" fill="#d4af37" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="box3d__ribbon box3d__ribbon--v" />
            <div className="box3d__ribbon box3d__ribbon--h" />

            <div className="box3d__lid-anchor">
              <div className="box3d__lid" data-box-lid>
                <div className="box3d__lid-face" />
                <div className="box3d__lid-ribbon box3d__lid-ribbon--v" />
                <div className="box3d__lid-ribbon box3d__lid-ribbon--h" />
              </div>
            </div>
          </div>
          <div className="box3d__shadow" />
        </div>
      </div>
    </div>
  );
});
