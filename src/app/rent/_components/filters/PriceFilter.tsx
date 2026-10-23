"use client";

import type { FilterControlProps } from "@/filters/useRentFilters";
import { FilterPopover } from "../FilterPopover";
import styles from "./filters.module.css";

const STEPS = Array.from({ length: 50 }, (_, i) => (i + 1) * 100);
const money = (value: number) => `$${value.toLocaleString("en-US")}`;

function summary({ minRent, maxRent }: FilterControlProps["filters"]) {
  if (minRent === undefined && maxRent === undefined) return "Price";
  if (minRent === undefined) return `Up to ${money(maxRent!)}`;
  if (maxRent === undefined) return `${money(minRent)}+`;
  return `${money(minRent)} - ${money(maxRent)}`;
}

/** Default price control. fiatbruno's slot machine (#9) replaces this file; keep the exported name and props. */
export function PriceFilter({ filters, setFilters }: FilterControlProps) {
  return (
    <FilterPopover label={summary(filters)} active={filters.minRent !== undefined || filters.maxRent !== undefined} minWidth={154}>
      <div className={styles.row}>
        <label className={styles.field}>
          Minimum
          <select
            value={filters.minRent ?? ""}
            onChange={(event) => setFilters({ minRent: event.target.value ? Number(event.target.value) : undefined })}
          >
            <option value="">No min</option>
            {STEPS.map((step) => (
              <option key={step} value={step}>
                {money(step)}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Maximum
          <select
            value={filters.maxRent ?? ""}
            onChange={(event) => setFilters({ maxRent: event.target.value ? Number(event.target.value) : undefined })}
          >
            <option value="">No max</option>
            {STEPS.map((step) => (
              <option key={step} value={step}>
                {money(step)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </FilterPopover>
  );
}
