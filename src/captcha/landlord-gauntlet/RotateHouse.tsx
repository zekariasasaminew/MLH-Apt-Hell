"use client";

import { useState } from "react";
import type { RoundProps } from "../types";
import { GIVE_UP_MESSAGE, useAttempts } from "../useAttempts";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const STEP_DEGREES = 7;
const START_DEGREES = 100.5;
const TOLERANCE_DEGREES = 4;

const distanceFromUpright = (degrees: number) => Math.abs((((degrees + 180) % 360) + 360) % 360 - 180);

/** Round (b): rotate the house upright in 7 degree steps. Exact is impossible; within 4 degrees passes. */
export function RotateHouse({ onPass }: RoundProps) {
  const [degrees, setDegrees] = useState(START_DEGREES);
  const [message, setMessage] = useState("");
  const { gaveUp, fail } = useAttempts(onPass);

  const verify = () => {
    if (distanceFromUpright(degrees) <= TOLERANCE_DEGREES) {
      onPass();
      return;
    }
    fail();
    setMessage("Still crooked. Foundation problems.");
  };

  return (
    <div>
      <h2 className={shared.prompt}>Rotate the house upright.</h2>
      <svg viewBox="0 0 120 120" className={styles.rotator} role="img" aria-label="A house to rotate upright">
        <g transform={`rotate(${degrees} 60 60)`}>
          <rect x="28" y="56" width="64" height="44" fill="#d9a066" />
          <polygon points="20,58 60,22 100,58" fill="#7a3b2e" />
          <rect x="52" y="74" width="16" height="26" fill="#fff" />
          <rect x="34" y="64" width="12" height="12" fill="#fff" />
        </g>
      </svg>
      <p className={shared.hint} aria-live="polite">
        Tilt: {degrees}°
      </p>
      <div className={shared.actions}>
        <button type="button" className={shared.secondary} onClick={() => setDegrees((value) => value - STEP_DEGREES)}>
          Rotate left 7°
        </button>
        <button type="button" className={shared.secondary} onClick={() => setDegrees((value) => value + STEP_DEGREES)}>
          Rotate right 7°
        </button>
      </div>
      <p className={shared.message} role="status">
        {gaveUp ? GIVE_UP_MESSAGE : message}
      </p>
      <div className={shared.actions}>
        <button type="button" className={shared.primary} disabled={gaveUp} onClick={verify}>
          Verify
        </button>
      </div>
    </div>
  );
}
