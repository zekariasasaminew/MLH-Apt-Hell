"use client";

import { HOME_TYPES } from "@/filters/rent-filters";
import type { FilterControlProps } from "@/filters/useRentFilters";
import { FilterPopover } from "../FilterPopover";
import styles from "./filters.module.css";

export function PropertyTypeFilter({ filters, setFilters }: FilterControlProps) {
  const selected = filters.homeTypes ?? [];
  const toggle = (type: (typeof HOME_TYPES)[number]) => {
    const next = selected.includes(type) ? selected.filter((item) => item !== type) : [...selected, type];
    setFilters({ homeTypes: next.length ? next : undefined });
  };

  return (
    <FilterPopover
      label={selected.length ? `${selected.length} type${selected.length > 1 ? "s" : ""}` : "Property type"}
      active={selected.length > 0}
      minWidth={173}
    >
      {HOME_TYPES.map((type) => (
        <label key={type} className={styles.check}>
          <input type="checkbox" checked={selected.includes(type)} onChange={() => toggle(type)} />
          {type === "Apartment" ? "Apartments" : `${type}s`}
        </label>
      ))}
    </FilterPopover>
  );
}
