"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/app/rent/_lib/useReducedMotion";
import type { Captcha, CaptchaProps } from "../types";
import { GIVE_UP_MESSAGE, useAttempts } from "../useAttempts";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const SCENE_WIDTH = 300;
const PIECE_WIDTH = 40;
const MAX_VALUE = SCENE_WIDTH - PIECE_WIDTH;
const GAP_BASE = 190;
const DRIFT_PX = 7;
const TOLERANCE = 16;

function HouseShape({ x, className }: { x: number; className: string }) {
  return (
    <g transform={`translate(${x} 34)`} className={className}>
      <rect x="4" y="24" width="32" height="26" />
      <polygon points="0,26 20,4 40,26" />
    </g>
  );
}

/** Drag the piece into the gap. The gap drifts a few pixels while you hold the slider. */
function SliderGap({ onPass }: CaptchaProps) {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  const [holding, setHolding] = useState(false);
  const [drift, setDrift] = useState(0);
  const [message, setMessage] = useState("");
  const { gaveUp, fail } = useAttempts(onPass);

  useEffect(() => {
    if (!holding || reducedMotion) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      setDrift(Math.sin((now - start) / 350) * DRIFT_PX);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [holding, reducedMotion]);

  const gapX = GAP_BASE + drift;

  const verify = () => {
    if (Math.abs(value - gapX) <= TOLERANCE) {
      onPass();
      return;
    }
    fail();
    setMessage("Missed. The gap moved. It does that.");
  };

  return (
    <div>
      <h2 className={shared.prompt}>Slide the piece into the gap.</h2>
      <svg viewBox={`0 0 ${SCENE_WIDTH} 110`} className={styles.scene} role="img" aria-label="Puzzle: a house-shaped piece and a gap">
        <rect width={SCENE_WIDTH} height="110" className={styles.sky} />
        <HouseShape x={gapX} className={styles.gap} />
        <HouseShape x={value} className={styles.piece} />
      </svg>
      <label className={styles.label}>
        Piece position (arrow keys also work)
        <input
          type="range"
          className={shared.range}
          min={0}
          max={MAX_VALUE}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          onPointerDown={() => setHolding(true)}
          onPointerUp={() => setHolding(false)}
          onKeyDown={() => setHolding(true)}
          onKeyUp={() => setHolding(false)}
          onBlur={() => setHolding(false)}
        />
      </label>
      {reducedMotion && <p className={shared.hint}>Reduced motion is on, so the gap holds still. It would have drifted.</p>}
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

const sliderGap: Captcha = { id: "slider-gap", Component: SliderGap };

export default sliderGap;
