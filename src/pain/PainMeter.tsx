"use client";

import { useEffect, useState } from "react";
import { PAIN_IGNORE_ATTR, usePain } from "./PainProvider";
import styles from "./PainMeter.module.css";

/** Dev helper showing the pain level with buttons to change it. On by default in dev; Ctrl+Shift+P toggles it anywhere. */
export function PainMeter() {
  const { pain, tier, ready, bump, reset } = usePain();
  const [open, setOpen] = useState(process.env.NODE_ENV === "development");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "p") setOpen((value) => !value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open || !ready) return null;

  return (
    <div className={styles.meter} {...{ [PAIN_IGNORE_ATTR]: "" }}>
      <span>
        pain <strong>{pain}</strong> · {tier}
      </span>
      <button onClick={() => bump(10)}>+10</button>
      <button onClick={() => bump(-10)}>-10</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}
