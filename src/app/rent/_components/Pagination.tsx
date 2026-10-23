"use client";

import styles from "./Pagination.module.css";

type Props = {
  page: number;
  pageCount: number;
  /** Annoying tier: pretends there are hundreds of pages. */
  lying: boolean;
  onPage: (page: number) => void;
};

function windowOf(page: number, pageCount: number): (number | "gap")[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((value) => value >= 1 && value <= pageCount));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((value, index) => (index > 0 && value - sorted[index - 1] > 1 ? ["gap" as const, value] : [value]));
}

export function Pagination({ page, pageCount, lying, onPage }: Props) {
  if (pageCount <= 1 && !lying) return null;
  const entries = windowOf(page, pageCount);

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <button type="button" className={styles.step} disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
        ‹
      </button>
      {entries.map((entry, index) =>
        entry === "gap" ? (
          <span key={`gap-${index}`} className={styles.gap}>
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            className={`${styles.page} ${entry === page ? styles.current : ""}`}
            aria-current={entry === page ? "page" : undefined}
            onClick={() => onPage(entry)}
          >
            {entry}
          </button>
        ),
      )}
      {lying && (
        <>
          <span className={styles.gap}>…</span>
          <button type="button" className={styles.page} onClick={() => onPage(412)}>
            412
          </button>
        </>
      )}
      <button type="button" className={styles.step} disabled={page >= pageCount} onClick={() => onPage(page + 1)} aria-label="Next page">
        ›
      </button>
    </nav>
  );
}
