"use client";

import { useEffect, useRef, useState } from "react";
import type { Captcha, CaptchaProps } from "../types";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const VERIFY_MS = 2000;
const WALLS = ["#d9a066", "#7fa6c9", "#c97f8e", "#8fbf7f", "#e4c45c", "#a58fc9", "#d98f66", "#6fb8b0", "#c9b07f"];
const ROOFS = ["#7a3b2e", "#2f4a63", "#5a2f3a", "#3e5f34", "#8a6b1f", "#4a3a63", "#7a4a2e", "#2f635e", "#63512f"];

function House({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 80 80" className={styles.house} aria-hidden="true">
      <rect x="14" y="36" width="52" height="34" fill={WALLS[index]} />
      <polygon points="8,38 40,10 72,38" fill={ROOFS[index]} />
      <rect x="34" y="50" width="12" height="20" fill="#fff" opacity="0.85" />
      <rect x="19" y="44" width="10" height="10" fill="#fff" opacity="0.7" />
    </svg>
  );
}

/** Every tile is a house, so any selection passes after a short fake verification. */
function HouseGrid({ onPass }: CaptchaProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [verifying, setVerifying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const toggle = (index: number) =>
    setSelected((current) => {
      const next = new Set(current);
      if (!next.delete(index)) next.add(index);
      return next;
    });

  const verify = () => {
    setVerifying(true);
    timer.current = setTimeout(onPass, VERIFY_MS);
  };

  return (
    <div>
      <h2 className={shared.prompt}>Select all images with a house.</h2>
      <div className={styles.grid} role="group" aria-label="Image tiles">
        {WALLS.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.tile} ${selected.has(index) ? styles.selected : ""}`}
            aria-pressed={selected.has(index)}
            aria-label={`House ${index + 1}`}
            onClick={() => toggle(index)}
          >
            <House index={index} />
          </button>
        ))}
      </div>
      <div className={shared.actions}>
        <button type="button" className={shared.primary} disabled={verifying} onClick={verify}>
          {verifying ? "Verifying vibes..." : "Verify"}
        </button>
      </div>
    </div>
  );
}

const houseGrid: Captcha = { id: "house-grid", Component: HouseGrid };

export default houseGrid;
