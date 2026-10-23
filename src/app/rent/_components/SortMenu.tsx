"use client";

import { useEffect, useRef, useState } from "react";
import type { SortKey } from "@/filters/rent-filters";
import styles from "./SortMenu.module.css";

export const SORT_LABELS: Record<SortKey, string> = {
  recommended: "Recommended",
  "price-asc": "Price (low to high)",
  "price-desc": "Price (high to low)",
  newest: "Newest",
  beds: "Bedrooms",
  sqft: "Square feet",
};

export function SortMenu({ sort, onChange }: { sort: SortKey; onChange: (sort: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className={styles.wrap}>
      <button type="button" className={styles.button} aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((value) => !value)}>
        Sort: {SORT_LABELS[sort]}
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className={styles.menu} role="listbox" aria-label="Sort">
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <li key={key} role="option" aria-selected={key === sort}>
              <button
                type="button"
                className={`${styles.option} ${key === sort ? styles.selected : ""}`}
                onClick={() => {
                  setOpen(false);
                  onChange(key);
                }}
              >
                {SORT_LABELS[key]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
