"use client";

import type { FilterControlProps } from "@/filters/useRentFilters";
import { FilterPopover } from "../FilterPopover";
import styles from "./filters.module.css";

export function MoreFilters({ filters, setFilters }: FilterControlProps) {
  const count = [filters.pets, filters.laundry, filters.parking, filters.availableBy].filter(Boolean).length;

  return (
    <FilterPopover
      label={count ? `Filters (${count})` : "Filters"}
      active={count > 0}
      minWidth={131}
      icon={
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M4 7h10M18 7h2M4 17h2M10 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="8" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      }
    >
      <div className={styles.group}>
        <div className={styles.groupTitle}>Pets</div>
        <div className={styles.segments}>
          {([undefined, "cats", "dogs"] as const).map((value) => (
            <button
              key={value ?? "any"}
              type="button"
              className={`${styles.segment} ${filters.pets === value ? styles.segmentOn : ""}`}
              onClick={() => setFilters({ pets: value })}
            >
              {value === undefined ? "Any" : value === "cats" ? "Cats ok" : "Dogs ok"}
            </button>
          ))}
        </div>
      </div>
      <label className={styles.check}>
        <input type="checkbox" checked={Boolean(filters.laundry)} onChange={(event) => setFilters({ laundry: event.target.checked || undefined })} />
        In-unit laundry
      </label>
      <label className={styles.check}>
        <input type="checkbox" checked={Boolean(filters.parking)} onChange={(event) => setFilters({ parking: event.target.checked || undefined })} />
        Parking
      </label>
      <label className={`${styles.field} ${styles.group}`} style={{ marginTop: 12 }}>
        Available by
        <input type="date" value={filters.availableBy ?? ""} onChange={(event) => setFilters({ availableBy: event.target.value || undefined })} />
      </label>
    </FilterPopover>
  );
}
