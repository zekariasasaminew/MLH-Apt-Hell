"use client";

import Link from "next/link";
import type { FilterControlProps } from "@/filters/useRentFilters";
import { FilterPopover } from "./FilterPopover";
import { LocationFilter } from "./filters/LocationFilter";
import { PriceFilter } from "./filters/PriceFilter";
import styles from "./FilterBar.module.css";

type Props = FilterControlProps & {
  onSaveSearch: () => void;
};

export function FilterBar({ filters, setFilters, onSaveSearch }: Props) {
  return (
    <div className={styles.bar} data-rent="filterbar">
      <LocationFilter filters={filters} setFilters={setFilters} />
      <FilterPopover label="For rent" active minWidth={116} hideApply>
        <ul className={styles.menu}>
          <li>
            <span className={styles.current}>For rent</span>
          </li>
          <li>
            <Link href="/search?type=buy">For sale</Link>
          </li>
          <li>
            <Link href="/search?type=sold">Sold</Link>
          </li>
        </ul>
      </FilterPopover>
      <PriceFilter filters={filters} setFilters={setFilters} />
      <div className={styles.spacer} />
      <button type="button" className={styles.save} onClick={onSaveSearch}>
        Save search
      </button>
    </div>
  );
}
