"use client";

import { CheckboxRound } from "../checkbox-wobble";
import type { RoundProps } from "../types";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

/** Round (e): a CAPTCHA inside a CAPTCHA, holding a tiny copy of the round-1 checkbox in its own frame. */
export function NestedCheckbox({ onPass }: RoundProps) {
  return (
    <div>
      <h2 className={shared.prompt}>To confirm you passed the previous CAPTCHAs, pass this CAPTCHA.</h2>
      <div className={styles.innerFrame} role="group" aria-label="Inner CAPTCHA">
        <p className={styles.innerTitle}>Hellow Human Verification (inner)</p>
        <CheckboxRound compact onPass={onPass} />
      </div>
    </div>
  );
}
