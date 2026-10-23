"use client";

import { useState } from "react";
import type { HomeType } from "@/data/listings";
import type { FilterControlProps } from "@/filters/useRentFilters";
import styles from "./FiltersForm.module.css";

const JOKE_FILTERS = [
  "Must have: walls",
  "Must have: floor",
  "Must have: a door (any door)",
  "Ceiling (optional)",
  "Windows (at least one, with glass)",
  "Running water (cold is fine)",
  "Heat (seasonal)",
  "Neighbors (quiet)",
  "Neighbors (loud, for ambiance)",
  "Landlord who replies",
  "Landlord who exists",
  "No ghosts (friendly ghosts ok)",
  "Smells like nothing",
  "Floor plan not drawn in crayon",
  "Stairs that go somewhere",
  "Pet-friendly to your pet specifically",
  "No mystery stain",
  "Light switch that does a thing",
  "Mailbox",
  "Not technically a closet",
];

const TYPES: HomeType[] = ["Apartment", "House", "Townhome", "Condo"];

/** The filter bar collapses into one long form. A handful of the boxes really filter. */
export function FiltersForm({ filters, setFilters }: FilterControlProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const types = filters.homeTypes ?? [];

  const toggleType = (type: HomeType) => {
    const next = types.includes(type) ? types.filter((item) => item !== type) : [...types, type];
    setFilters({ homeTypes: next.length ? next : undefined });
  };

  return (
    <fieldset className={styles.form} data-rent="filters-form">
      <legend>Filters (all of them)</legend>
      <div className={styles.scroll}>
        {TYPES.map((type) => (
          <label key={type} className={styles.row}>
            <input type="checkbox" checked={types.includes(type)} onChange={() => toggleType(type)} />
            Must be a {type.toLowerCase()}
          </label>
        ))}
        <label className={styles.row}>
          <input type="checkbox" checked={filters.pets === "cats"} onChange={(event) => setFilters({ pets: event.target.checked ? "cats" : undefined })} />
          Must allow cats
        </label>
        <label className={styles.row}>
          <input type="checkbox" checked={filters.pets === "dogs"} onChange={(event) => setFilters({ pets: event.target.checked ? "dogs" : undefined })} />
          Must allow dogs
        </label>
        <label className={styles.row}>
          <input type="checkbox" checked={Boolean(filters.laundry)} onChange={(event) => setFilters({ laundry: event.target.checked || undefined })} />
          Must have in-unit laundry
        </label>
        <label className={styles.row}>
          <input type="checkbox" checked={Boolean(filters.parking)} onChange={(event) => setFilters({ parking: event.target.checked || undefined })} />
          Must have parking
        </label>
        {[1, 2, 3].map((beds) => (
          <label key={beds} className={styles.row}>
            <input
              type="checkbox"
              checked={filters.beds === beds}
              onChange={(event) => setFilters({ beds: event.target.checked ? beds : undefined })}
            />
            At least {beds} bedroom{beds > 1 ? "s" : ""}
          </label>
        ))}
        {JOKE_FILTERS.map((label) => (
          <label key={label} className={styles.row}>
            <input type="checkbox" checked={Boolean(checked[label])} onChange={(event) => setChecked((state) => ({ ...state, [label]: event.target.checked }))} />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
