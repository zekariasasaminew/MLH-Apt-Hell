"use client";

import { useMarket } from "../_lib/MarketContext";
import Link from "next/link";
import { useEffect } from "react";
import styles from "./SaveSearchModal.module.css";

/** "Save search" opens a sign-in wall with a small close button. Escape always closes it. */
export function SaveSearchModal({ onClose }: { onClose: () => void }) {
  const mode = useMarket();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Sign in to save your search">
        <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          ×
        </button>
        <h2>Sign in to save your search</h2>
        <p>Get alerts when new {mode === "buy" ? "homes for sale" : "rentals"} match. Also get alerts when they stop matching, which is most of the time.</p>
        <Link href="/signin" className={styles.cta}>
          Sign in or create an account
        </Link>
      </div>
    </div>
  );
}
