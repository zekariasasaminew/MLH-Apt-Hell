"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "@/app/rent/_lib/useReducedMotion";
import { RoundSequence } from "../RoundSequence";
import type { Captcha, RoundProps } from "../types";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const MAX_DODGES = 3;
const SPOTS = [
  { left: 4, top: 50 },
  { left: 72, top: 22 },
  { left: 38, top: 78 },
  { left: 66, top: 70 },
];

/** "I'm not a robot" checkbox that dodges a few times, then lets you click it. */
export function CheckboxRound({ onPass, compact = false }: RoundProps & { compact?: boolean }) {
  const reducedMotion = useReducedMotion();
  const dodges = useRef(0);
  const [spot, setSpot] = useState(0);
  const [checked, setChecked] = useState(false);

  const dodge = () => {
    if (reducedMotion || dodges.current >= MAX_DODGES) return false;
    dodges.current += 1;
    setSpot(dodges.current);
    return true;
  };

  const handleClick = (event: React.MouseEvent) => {
    if (event.detail > 0 && dodge()) return;
    setChecked(true);
    onPass();
  };

  return (
    <div>
      <div className={`${styles.arena} ${compact ? styles.compact : ""}`} onPointerEnter={(event) => event.pointerType === "mouse" && dodge()}>
        <button
          type="button"
          className={styles.box}
          style={{ left: `${SPOTS[spot].left}%`, top: `${SPOTS[spot].top}%`, transform: `translate(-${SPOTS[spot].left}%, -50%)` }}
          role="checkbox"
          aria-checked={checked}
          onClick={handleClick}
        >
          <span className={styles.tick} aria-hidden="true">
            {checked ? "✓" : ""}
          </span>
          I&apos;m not a robot
        </button>
      </div>
      {reducedMotion && <p className={shared.hint}>Reduced motion is on, so the checkbox politely stays put. It would have dodged you.</p>}
    </div>
  );
}

/** Asks twice; both answers are "Yes". */
export function AreYouSureRound({ onPass }: RoundProps) {
  return (
    <div>
      <h2 className={shared.prompt}>Are you sure you&apos;re not a robot?</h2>
      <div className={shared.actions}>
        <button type="button" className={shared.primary} onClick={onPass}>
          Yes
        </button>
        <button type="button" className={shared.primary} onClick={onPass}>
          Yes
        </button>
      </div>
    </div>
  );
}

const rounds = [
  { id: "checkbox", Component: CheckboxRound },
  { id: "are-you-sure", Component: AreYouSureRound },
];

const checkboxWobble: Captcha = {
  id: "checkbox-wobble",
  Component: ({ onPass }) => <RoundSequence rounds={rounds} onPass={onPass} progress="none" />,
};

export default checkboxWobble;
