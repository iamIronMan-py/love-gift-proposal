import { useEffect, useState } from 'react';

export function TransparentImage({ src, className, threshold = 245 }: { src: string; className?: string; threshold?: number }) {
  const [out, setOut] = useState(src);
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height);
        const p = d.data;
        for (let i = 0; i < p.length; i += 4) {
          const r = p[i], g = p[i + 1], b = p[i + 2];
          const max = Math.max(r, g, b), min = Math.min(r, g, b);
          if (r > threshold && g > threshold && b > threshold) {
            p[i + 3] = 0;
          } else if (r > 225 && g > 225 && b > 225 && max - min < 18) {
            p[i + 3] = Math.min(p[i + 3], Math.round((255 - (r + g + b) / 3) * 2.2));
          }
        }
        ctx.putImageData(d, 0, 0);
        const url = c.toDataURL('image/png');
        if (!cancelled) setOut(url);
      } catch {}
    };
    img.src = src;
    return () => { cancelled = true; };
  }, [src, threshold]);
  return <img className={className} src={out} alt="" />;
}
