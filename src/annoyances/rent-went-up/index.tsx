"use client";

import { useEffect, useState } from "react";
import type { Annoyance, AnnoyanceProps } from "../types";
import styles from "./styles.module.css";

const DELAY_MS = 4000;
const INCREASE_PER_MONTH = 312;

function RentWentUp({ dismiss }: AnnoyanceProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.toast} role="status">
      <p>
        <strong>Heads up:</strong> rent on homes you viewed went up ${INCREASE_PER_MONTH}/mo since you got here.
      </p>
      <button className={styles.close} onClick={dismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}

const rentWentUp: Annoyance = {
  id: "rent-went-up",
  owner: "zekariasasaminew",
  Component: RentWentUp,
};

export default rentWentUp;
