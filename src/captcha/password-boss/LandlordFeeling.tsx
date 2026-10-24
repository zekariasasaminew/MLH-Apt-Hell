"use client";

import { useState } from "react";
import type { RoundProps } from "../types";
import { GIVE_UP_MESSAGE, useAttempts } from "../useAttempts";
import shared from "../shared.module.css";

const FAR_LEFT_MAX = 2;

/** Round (d): only the far left passes, and the hint says so after one miss. */
export function LandlordFeeling({ onPass }: RoundProps) {
  const [feeling, setFeeling] = useState(50);
  const { failures, gaveUp, fail } = useAttempts(onPass);

  const verify = () => {
    if (feeling <= FAR_LEFT_MAX) {
      onPass();
      return;
    }
    fail();
  };

  return (
    <div>
      <h2 className={shared.prompt}>Prove you are human: move the slider to how you feel about your landlord.</h2>
      <label className={shared.hint}>
        Feelings about your landlord, from hate (left) to love (right)
        <input type="range" className={shared.range} min={0} max={100} value={feeling} onChange={(event) => setFeeling(Number(event.target.value))} />
      </label>
      {failures > 0 && !gaveUp && <p className={shared.hint}>Hint: only the far left passes. (Home key works too.)</p>}
      <p className={shared.message} role="status">
        {gaveUp ? GIVE_UP_MESSAGE : failures > 0 ? "That is not how a human feels." : ""}
      </p>
      <div className={shared.actions}>
        <button type="button" className={shared.primary} disabled={gaveUp} onClick={verify}>
          Verify
        </button>
      </div>
    </div>
  );
}
