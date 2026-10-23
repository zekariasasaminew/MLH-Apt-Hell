"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FilterPopover.module.css";

type Props = {
  label: string;
  /** Highlights the pill, like Zillow does for a filter that is currently applied. */
  active?: boolean;
  minWidth?: number;
  /** Hides the Apply button for menus that act immediately (sort, listing type). */
  hideApply?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onOpen?: () => void;
};

export function FilterPopover({ label, active, minWidth, hideApply, icon, children, onOpen }: Props) {
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
      <button
        type="button"
        className={`${styles.pill} ${active ? styles.active : ""}`}
        style={{ minWidth }}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          if (!open) onOpen?.();
          setOpen((value) => !value);
        }}
      >
        {icon}
        {label}
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className={styles.chevron}>
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div role="dialog" aria-label={label} className={styles.popover}>
          {children}
          {!hideApply && (
            <button type="button" className={styles.apply} onClick={() => setOpen(false)}>
              Apply
            </button>
          )}
        </div>
      )}
    </div>
  );
}
