"use client";

import { useState } from "react";
import { cities } from "@/data/listings";
import type { FilterControlProps } from "@/filters/useRentFilters";
import styles from "./LocationFilter.module.css";

const cityFromText = (text: string) =>
  cities.find((city) => [city.label, `${city.label}, ${city.state}`, `${city.label} ${city.state}`].some((name) => name.toLowerCase() === text.toLowerCase()));

function Field({ filters, setFilters }: FilterControlProps) {
  const initial = filters.q ?? cities.find((city) => city.slug === filters.city)?.label ?? "";
  const [text, setText] = useState(initial);

  const submit = () => {
    const value = text.trim();
    const city = cityFromText(value);
    if (!value) setFilters({ q: undefined, city: undefined });
    else if (city) setFilters({ city: city.slug, q: undefined });
    else setFilters({ q: value, city: undefined });
  };

  return (
    <form
      className={styles.form}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <input
        type="text"
        className={styles.input}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Address, neighborhood, city, ZIP"
        aria-label="Address, neighborhood, city, ZIP"
        autoComplete="off"
      />
      {text && (
        <button
          type="button"
          className={styles.clear}
          aria-label="clear search text button"
          onClick={() => {
            setText("");
            setFilters({ q: undefined, city: undefined });
          }}
        >
          <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
      )}
      <button type="submit" className={styles.submit} aria-label="Submit Search">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.25" />
          <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}

/** Default location control. fiatbruno's globe (#5) replaces this file; keep the exported name and props. */
export function LocationFilter(props: FilterControlProps) {
  // Remount when the location changes from outside (Back button, "Remove all filters") so the text follows the URL.
  return <Field key={`${props.filters.q ?? ""}|${props.filters.city ?? ""}`} {...props} />;
}
