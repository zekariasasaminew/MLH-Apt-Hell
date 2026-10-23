"use client";

import { cities } from "@/data/listings";
import type { FilterControlProps } from "@/filters/useRentFilters";

/** Default location control. fiatbruno's globe (#5) replaces this file; keep the props. */
export function LocationFilter({ filters, setFilters }: FilterControlProps) {
  return (
    <fieldset>
      <legend>Location</legend>
      <input
        type="text"
        aria-label="Address, neighborhood, city, ZIP"
        placeholder="Address, neighborhood, city, ZIP"
        defaultValue={filters.q ?? ""}
        onKeyDown={(event) => {
          if (event.key === "Enter") setFilters({ q: event.currentTarget.value.trim() || undefined });
        }}
      />
      <select
        aria-label="City"
        value={filters.city ?? ""}
        onChange={(event) => setFilters({ city: event.target.value || undefined })}
      >
        <option value="">All cities</option>
        {cities.map((city) => (
          <option key={city.slug} value={city.slug}>
            {city.label}, {city.state}
          </option>
        ))}
      </select>
    </fieldset>
  );
}
