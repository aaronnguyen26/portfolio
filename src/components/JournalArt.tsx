// Hand-made SVG "photos" and sketches so the journal looks illustrated
// without needing real images. Swap these for real <img> photos later.

const ink = "#3a342c";

export function Skyline() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fa3c9" />
          <stop offset="0.6" stopColor="#f1c9a2" />
          <stop offset="1" stopColor="#e9a46f" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill="url(#sky)" />
      <g fill="#2e3a52">
        <rect x="6" y="64" width="14" height="56" />
        <rect x="22" y="48" width="16" height="72" />
        <rect x="40" y="30" width="12" height="90" />
        <polygon points="46,10 49,30 43,30" />
        <rect x="54" y="58" width="18" height="62" />
        <rect x="74" y="42" width="14" height="78" />
        <rect x="90" y="68" width="14" height="52" />
        <rect x="106" y="54" width="14" height="66" />
      </g>
      <g fill="#ffd98a" opacity=".85">
        <rect x="26" y="56" width="3" height="3" /><rect x="32" y="64" width="3" height="3" />
        <rect x="58" y="70" width="3" height="3" /><rect x="64" y="80" width="3" height="3" />
        <rect x="78" y="52" width="3" height="3" /><rect x="94" y="80" width="3" height="3" />
      </g>
    </svg>
  );
}

export function Coffee() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="120" height="120" fill="#5a3a28" />
      <circle cx="60" cy="62" r="46" fill="#f4efe6" />
      <circle cx="60" cy="62" r="34" fill="#ffffff" stroke="#d9cfbf" strokeWidth="2" />
      <circle cx="60" cy="62" r="28" fill="#7a4a2c" />
      <path d="M60 44c-8 6-8 12 0 18s8 12 0 18c10-6 10-12 0-18s-10-12 0-18z" fill="#e9d3b4" />
      <path d="M96 56c10 0 10 14 0 14" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function Portrait() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="120" height="120" fill="#cdbb9f" />
      <path d="M10 120c4-30 22-40 50-40s46 10 50 40z" fill="#2a2a2e" />
      <rect x="50" y="66" width="20" height="18" fill="#c68f6a" />
      <ellipse cx="60" cy="50" rx="19" ry="23" fill="#d4a07a" />
      <path d="M40 46c0-18 10-24 22-24s20 8 18 24c-4-10-10-14-20-14s-16 4-20 14z" fill="#1d1a17" />
    </svg>
  );
}

export function Group() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="120" height="120" fill="#d8d0c0" />
      <ellipse cx="60" cy="86" rx="52" ry="24" fill="#b79b78" />
      <rect x="22" y="72" width="28" height="12" fill="#f7f3ea" transform="rotate(-8 36 78)" />
      <rect x="66" y="74" width="30" height="12" fill="#f7f3ea" transform="rotate(6 80 80)" />
      {[
        [24, 44, "#2a2a2e"], [48, 36, "#6b3a2a"], [72, 38, "#1d1a17"], [96, 46, "#3b4a6b"],
        [36, 66, "#8a4b3a"], [84, 66, "#2f5b4a"],
      ].map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r="9" fill="#d4a07a" />
          <path d={`M${(x as number) - 12} ${(y as number) + 22}c0-10 6-13 12-13s12 3 12 13z`} fill={c as string} />
        </g>
      ))}
    </svg>
  );
}

export function FloorPlan() {
  return (
    <svg viewBox="0 0 120 100" width="100%" aria-hidden="true" fill="none" stroke={ink} strokeWidth="1.4" strokeLinecap="round">
      <rect x="6" y="6" width="108" height="88" />
      <path d="M6 44h46M52 6v50M52 56h62M80 56v38M30 44v24M6 68h24" />
      <path d="M40 44a8 8 0 0 1 0-8M80 74a8 8 0 0 0 8 8" />
      <path d="M62 14h20M62 22h14" strokeDasharray="2 3" />
    </svg>
  );
}

export function BuildingSketch() {
  return (
    <svg viewBox="0 0 220 130" width="100%" aria-hidden="true" fill="none" stroke={ink} strokeWidth="1.3" strokeLinecap="round">
      <path d="M20 118h190" />
      <path d="M50 118V40l50-16 20 8v86M50 40l70 24M100 24v94" />
      <path d="M62 56h26M62 72h26M62 88h26M62 104h26" />
      <path d="M110 70h32v48M142 70l30-14v62M120 80h14M120 94h14M150 76h14" />
      <path d="M20 118C60 60 130 20 200 30" strokeDasharray="3 4" />
      <circle cx="176" cy="104" r="8" /><path d="M176 112v6" />
    </svg>
  );
}

export function BoxSketch() {
  return (
    <svg viewBox="0 0 110 90" width="100%" aria-hidden="true" fill="none" stroke={ink} strokeWidth="1.3" strokeLinecap="round">
      <path d="M12 34l38-16 46 14v38L56 86 12 70z" />
      <path d="M12 34l44 16 40-18M56 50v36" />
      <path d="M62 26l12 4M70 20l10 4" />
      <path d="M96 20l8-6M98 28l10-2" />
    </svg>
  );
}

export function PhoneSketch() {
  return (
    <svg viewBox="0 0 60 100" width="100%" aria-hidden="true" fill="none" stroke={ink} strokeWidth="1.3" strokeLinecap="round">
      <rect x="8" y="4" width="44" height="92" rx="7" />
      <rect x="15" y="16" width="30" height="20" />
      <path d="M15 46h30M15 54h22M15 62h28M15 70h18" />
      <circle cx="30" cy="86" r="3" />
    </svg>
  );
}

export function Code() {
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="160" height="100" fill="#efe6d2" />
      <rect x="12" y="12" width="136" height="76" rx="6" fill="#2b2620" />
      <circle cx="24" cy="24" r="3" fill="#d9534f" /><circle cx="34" cy="24" r="3" fill="#ffcc00" /><circle cx="44" cy="24" r="3" fill="#6cc070" />
      <g stroke="#ffcc00" strokeWidth="3" strokeLinecap="round">
        <path d="M24 42h40" /><path d="M32 54h58" stroke="#e8dcc2" /><path d="M32 66h34" stroke="#cf6a5a" /><path d="M24 78h24" />
      </g>
    </svg>
  );
}
