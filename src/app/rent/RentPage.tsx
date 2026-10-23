"use client";

import Link from "next/link";
import { formatRent, listings } from "@/data/listings";
import { applyRentFilters, paginate, SORT_KEYS } from "@/filters/rent-filters";
import { useRentFilters } from "@/filters/useRentFilters";
import { LocationFilter } from "./_components/filters/LocationFilter";
import { PriceFilter } from "./_components/filters/PriceFilter";
import styles from "./rent.module.css";

/** Temporary unstyled shell that proves the filter contract end to end. The calm-tier PR replaces its body. */
export function RentPage() {
  const { filters, setFilters, clearFilters } = useRentFilters();
  const results = applyRentFilters(listings, filters);
  const { items, pageCount, page } = paginate(results, filters.page);

  return (
    <div className={styles.shell}>
      <h1>Rental listings</h1>
      <LocationFilter filters={filters} setFilters={setFilters} />
      <PriceFilter filters={filters} setFilters={setFilters} />
      <label>
        Sort{" "}
        <select
          value={filters.sort}
          onChange={(event) => setFilters({ sort: event.target.value as (typeof SORT_KEYS)[number] })}
        >
          {SORT_KEYS.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </label>{" "}
      <button onClick={clearFilters}>Remove all filters</button>

      <h2>{results.length} rentals available</h2>
      {results.length === 0 && <p>No matching results. Try changing your search, such as removing filters.</p>}
      <ul>
        {items.map((listing) => (
          <li key={listing.id}>
            <Link href={`/listing/${listing.id}`}>
              {formatRent(listing.rent)}: {listing.beds} bd, {listing.baths} ba, {listing.street}, {listing.city}
            </Link>
          </li>
        ))}
      </ul>

      <nav aria-label="Pagination">
        <button disabled={page <= 1} onClick={() => setFilters({ page: page - 1 })}>
          Previous
        </button>{" "}
        Page {page} of {pageCount}{" "}
        <button disabled={page >= pageCount} onClick={() => setFilters({ page: page + 1 })}>
          Next
        </button>
      </nav>
    </div>
  );
}
