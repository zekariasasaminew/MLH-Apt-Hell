"use client";

import { useEffect, useState } from "react";
import { TIERS } from "@/pain/pain-cookie";
import type { Annoyance, AnnoyanceProps } from "../types";
import styles from "./styles.module.css";

const DELAY_MS = 4000;

function RentWentUp({ pain, dismiss }: AnnoyanceProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const increase = 12 + pain * 3;

  return (
    <div className={styles.toast} role="status">
      <p>
        <strong>Heads up:</strong> rent on homes you viewed went up ${increase}/mo since you got here.
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
  minPain: TIERS.mild,
  Component: RentWentUp,
};

export default rentWentUp;
