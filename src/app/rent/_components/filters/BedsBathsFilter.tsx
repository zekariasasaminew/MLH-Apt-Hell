"use client";

import type { FilterControlProps } from "@/filters/useRentFilters";
import { FilterPopover } from "../FilterPopover";
import styles from "./filters.module.css";

const BED_OPTIONS = [0, 1, 2, 3, 4];
const BATH_OPTIONS = [0, 1, 1.5, 2, 3];
const WEIRD_BED_OPTIONS = ["0.5", "Studio-ish", "Couch", "Bunk (shared)"];

const label = (value: number) => (value === 0 ? "Any" : `${value}+`);

function summary({ beds, baths }: FilterControlProps["filters"]) {
  const parts = [beds ? `${beds}+ bd` : "", baths ? `${baths}+ ba` : ""].filter(Boolean);
  return parts.length ? parts.join(", ") : "Beds & baths";
}

type Props = FilterControlProps & {
  /** Annoying tier: extra nonsense bedroom options that all behave like "1+". */
  weirdBeds: boolean;
};

export function BedsBathsFilter({ filters, setFilters, weirdBeds }: Props) {
  return (
    <FilterPopover label={summary(filters)} active={Boolean(filters.beds || filters.baths)} minWidth={154}>
      <div className={styles.group}>
        <div className={styles.groupTitle}>Bedrooms</div>
        <div className={styles.segments}>
          {BED_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              className={`${styles.segment} ${(filters.beds ?? 0) === value ? styles.segmentOn : ""}`}
              onClick={() => setFilters({ beds: value || undefined })}
            >
              {label(value)}
            </button>
          ))}
          {weirdBeds &&
            WEIRD_BED_OPTIONS.map((name) => (
              <button key={name} type="button" className={styles.segment} onClick={() => setFilters({ beds: 1 })}>
                {name}
              </button>
            ))}
        </div>
      </div>
      <div className={styles.group}>
        <div className={styles.groupTitle}>Bathrooms</div>
        <div className={styles.segments}>
          {BATH_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              className={`${styles.segment} ${(filters.baths ?? 0) === value ? styles.segmentOn : ""}`}
              onClick={() => setFilters({ baths: value || undefined })}
            >
              {label(value)}
            </button>
          ))}
        </div>
      </div>
    </FilterPopover>
  );
}
