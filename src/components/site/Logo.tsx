"use client";

import { useEffect, useState } from "react";
import styles from "./Logo.module.css";

export const BRAND_NAME = "Hellow";

let hellHasAwakened = false;
const HELL_EVENT = "hellow:awaken";

export function Logo({ size = 24 }: { size?: number }) {
  const [isHell, setIsHell] = useState(false);

  useEffect(() => {
    const awaken = () => {
      hellHasAwakened = true;
      setIsHell(true);
      window.dispatchEvent(new Event(HELL_EVENT));
    };
    const syncHell = () => setIsHell(true);

    if (hellHasAwakened) setIsHell(true);

    window.addEventListener(HELL_EVENT, syncHell);
    window.addEventListener("pointerdown", awaken, { once: true, capture: true });
    window.addEventListener("keydown", awaken, { once: true, capture: true });
    window.addEventListener("input", awaken, { once: true, capture: true });

    return () => {
      window.removeEventListener(HELL_EVENT, syncHell);
      window.removeEventListener("pointerdown", awaken, true);
      window.removeEventListener("keydown", awaken, true);
      window.removeEventListener("input", awaken, true);
    };
  }, []);

  return (
    <span
      className={`${styles.logo} ${isHell ? styles.hell : ""}`}
      style={{ fontSize: size }}
      aria-label={isHell ? "Hellow: hell mode awakened" : BRAND_NAME}
    >
      <svg className={styles.mark} viewBox="0 0 24 24" aria-hidden="true">
        {isHell ? (
          <>
            <path className={styles.horn} d="M7.2 7.4C4 6.6 3.3 3.6 4.1 1.5c.8 1.7 2.4 2.8 4.7 3.1M16.8 7.4c3.2-.8 3.9-3.8 3.1-5.9-.8 1.7-2.4 2.8-4.7 3.1" />
            <path d="M3 11 12 3l9 8M6.5 10v11M17.5 10v11M6.5 15.5h11" />
            <path className={styles.flame} d="M9.1 21.7c-1.1-2.1.6-3.3.8-5.2 1.2.9 1.4 2 1.3 2.9 1.5-1.3 2.2-3.1 1.7-5.1 2.7 2 3.3 5.6.8 7.4" />
          </>
        ) : (
          <>
            <path d="M3 11 12 3l9 8" />
            <path d="M6.5 10v11M17.5 10v11M6.5 15.5h11" />
          </>
        )}
      </svg>
      {BRAND_NAME}
    </span>
  );
}


