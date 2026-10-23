"use client";

import Link from "next/link";
import type { FilterControlProps } from "@/filters/useRentFilters";
import type { RentEffects } from "../_lib/rent-pain";
import { FilterPopover } from "./FilterPopover";
import { BedsBathsFilter } from "./filters/BedsBathsFilter";
import { LocationFilter } from "./filters/LocationFilter";
import { MoreFilters } from "./filters/MoreFilters";
import { PriceFilter } from "./filters/PriceFilter";
import { PropertyTypeFilter } from "./filters/PropertyTypeFilter";
import styles from "./FilterBar.module.css";

type Props = FilterControlProps & {
  effects: RentEffects;
  onSaveSearch: () => void;
};

export function FilterBar({ filters, setFilters, effects, onSaveSearch }: Props) {
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
      {!effects.filtersAsForm && (
        <>
          <BedsBathsFilter filters={filters} setFilters={setFilters} weirdBeds={effects.weirdBeds} />
          <PropertyTypeFilter filters={filters} setFilters={setFilters} />
          <MoreFilters filters={filters} setFilters={setFilters} />
        </>
      )}
      <div className={styles.spacer} />
      <button type="button" className={styles.save} onClick={onSaveSearch}>
        Save search
      </button>
    </div>
  );
}
