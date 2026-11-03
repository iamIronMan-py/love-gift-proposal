export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 15" fill="currentColor" aria-hidden="true">
      <path d="M8 14.2S1 10.1 1 5.6C1 3.1 3 1.5 5 2.5c1.2.6 2 1.7 3 3 1-1.3 1.8-2.4 3-3 2-1 4 .6 4 3.1 0 4.5-7 8.6-7 8.6Z" />
    </svg>
  );
}

export function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 18" fill="none" aria-hidden="true">
      <path d="M8 17s6-5.4 6-10A6 6 0 1 0 2 7c0 4.6 6 10 6 10Z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="7" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 3 3 10.4l6.3 2.6L15 21l2-8.2L21 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReplayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 4v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GiftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10h16v10H4V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 7h18v4H3V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 7v13M8.5 7C6 7 6 3.5 8.5 3.5c2 0 3.5 3.5 3.5 3.5S13.5 3.5 15.5 3.5C18 3.5 18 7 15.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
