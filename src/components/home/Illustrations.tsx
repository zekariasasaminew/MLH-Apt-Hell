const size = { width: 160, height: 160, viewBox: "0 0 160 160", "aria-hidden": true } as const;

export function BuyIllustration() {
  return (
    <svg {...size}>
      <circle cx="80" cy="80" r="70" fill="#ffe7e0" />
      <path d="M38 78 80 44l42 34v50H38Z" fill="#fff" stroke="#111116" strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 82 80 40l50 42" fill="none" stroke="#d03c0b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="70" y="98" width="20" height="30" fill="#0041d9" />
      <rect x="50" y="84" width="14" height="14" fill="#a3c4ff" stroke="#111116" strokeWidth="2" />
      <circle cx="112" cy="104" r="17" fill="#fff" stroke="#111116" strokeWidth="5" />
      <path d="m124 117 13 13" stroke="#111116" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export function SellIllustration() {
  return (
    <svg {...size}>
      <circle cx="80" cy="80" r="70" fill="#e0ecff" />
      <path d="M30 128h100" stroke="#2a7a3b" strokeWidth="8" strokeLinecap="round" />
      <rect x="40" y="36" width="10" height="92" fill="#f4a100" />
      <path d="M50 44h56v6H50Z" fill="#f4a100" />
      <rect x="66" y="56" width="48" height="40" rx="4" fill="#0041d9" stroke="#111116" strokeWidth="3" />
      <path d="m82 80 8-9 8 9v8H82Z" fill="#fff" />
      <path d="M78 50v6M102 50v6" stroke="#111116" strokeWidth="2" />
    </svg>
  );
}

export function RentIllustration() {
  return (
    <svg {...size}>
      <circle cx="80" cy="80" r="70" fill="#ffe9d6" />
      <rect x="44" y="34" width="56" height="94" fill="#ff8a6b" stroke="#111116" strokeWidth="3" />
      <path d="M44 34h56l-6-10H50Z" fill="#d03c0b" stroke="#111116" strokeWidth="3" strokeLinejoin="round" />
      {[46, 66, 86].map((y) =>
        [54, 78].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="12" height="12" fill="#fff" stroke="#111116" strokeWidth="2" />),
      )}
      <rect x="64" y="106" width="16" height="22" fill="#f4a100" stroke="#111116" strokeWidth="2" />
      <rect x="100" y="70" width="24" height="58" fill="#0041d9" stroke="#111116" strokeWidth="3" />
      <path d="M106 80h4M114 80h4M106 92h4M114 92h4M106 104h4M114 104h4" stroke="#fff" strokeWidth="3" />
      <path d="M26 128h108" stroke="#2a7a3b" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}
