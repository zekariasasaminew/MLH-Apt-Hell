"use client";

import type { FilterControlProps } from "@/filters/useRentFilters";

const STEPS = Array.from({ length: 51 }, (_, i) => i * 100);

/** Default price control. fiatbruno's slot machine (#9) replaces this file; keep the props. */
export function PriceFilter({ filters, setFilters }: FilterControlProps) {
  return (
    <fieldset>
      <legend>Price</legend>
      <select
        aria-label="Minimum rent"
        value={filters.minRent ?? ""}
        onChange={(event) => setFilters({ minRent: event.target.value ? Number(event.target.value) : undefined })}
      >
        <option value="">No min</option>
        {STEPS.slice(1).map((step) => (
          <option key={step} value={step}>
            ${step.toLocaleString("en-US")}
          </option>
        ))}
      </select>
      {" to "}
      <select
        aria-label="Maximum rent"
        value={filters.maxRent ?? ""}
        onChange={(event) => setFilters({ maxRent: event.target.value ? Number(event.target.value) : undefined })}
      >
        <option value="">No max</option>
        {STEPS.slice(1).map((step) => (
          <option key={step} value={step}>
            ${step.toLocaleString("en-US")}
          </option>
        ))}
      </select>
    </fieldset>
  );
}
