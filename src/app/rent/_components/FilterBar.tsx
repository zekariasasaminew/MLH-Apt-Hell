"use client";

import { useMarket } from "../_lib/MarketContext";
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
  const mode = useMarket();
  return (
    <div className={styles.bar} data-rent="filterbar">
      <LocationFilter filters={filters} setFilters={setFilters} />
      <FilterPopover label={mode === "buy" ? "For sale" : "For rent"} active minWidth={116} hideApply>
        <ul className={styles.menu}>
          <li>{mode === "rent" ? <span className={styles.current}>For rent</span> : <Link href="/rent">For rent</Link>}</li>
          <li>{mode === "buy" ? <span className={styles.current}>For sale</span> : <Link href="/search?type=buy">For sale</Link>}</li>
          <li><Link href="/search?type=sell">Sell a home</Link></li>
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
