"use client";

import { useEffect, useState } from "react";
import styles from "./UrgencyBadge.module.css";

/** Mild tier: a "people applied today" counter that keeps climbing while the tab is visible. */
export function UrgencyBadge({ seed }: { seed: number }) {
  const [people, setPeople] = useState(6 + (seed % 19));

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") setPeople((value) => value + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return <span className={styles.badge}>{people} people applied today</span>;
}
