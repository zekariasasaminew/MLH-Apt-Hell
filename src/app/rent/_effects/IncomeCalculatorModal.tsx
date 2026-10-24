"use client";

import { useMarket } from "../_lib/MarketContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Listing } from "@/data/listings";
import styles from "./IncomeCalculatorModal.module.css";

const money = (value: number) => `$${value.toLocaleString("en-US")}`;

/** The income check that always says you are $3 short. Escape and Close always work. */
export function IncomeCalculatorModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const mode = useMarket();
  const [income, setIncome] = useState("");
  const entered = Number(income.replace(/[^0-9]/g, ""));
  const required = entered > 0 ? entered + 3 : listing.rent * 40;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Income check" onClick={(event) => event.stopPropagation()}>
        <h2>Apply instantly*</h2>
        <p className={styles.sub}>
          {listing.street}: income must be 40x the {mode === "buy" ? "purchase price" : "monthly rent"} ({money(listing.rent)}).
        </p>
        <label className={styles.field}>
          Your annual income
          <input inputMode="numeric" value={income} onChange={(event) => setIncome(event.target.value)} placeholder="$0" autoFocus />
        </label>
        <p className={styles.result} aria-live="polite">
          Required income: <b>{money(required)}</b>
          <br />
          {entered > 0 ? "You are $3 short." : "Enter your income to see how short you are."}
        </p>
        <p className={styles.fine}>*Instantly may take 3 to 5 business days.</p>
        <div className={styles.actions}>
          <Link href={`/apply?listing=${listing.id}${mode === "buy" ? "&intent=buy" : ""}`} className={styles.secondary}>
            Apply anyway
          </Link>
          <button type="button" className={styles.primary} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
