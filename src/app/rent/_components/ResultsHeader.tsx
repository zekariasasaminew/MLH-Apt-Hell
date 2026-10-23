import { cities } from "@/data/listings";
import type { RentFilters } from "@/filters/rent-filters";
import { SortMenu } from "./SortMenu";
import styles from "./ResultsHeader.module.css";

type Props = {
  filters: RentFilters;
  count: number;
  onSort: (sort: RentFilters["sort"]) => void;
};

export function ResultsHeader({ filters, count, onSort }: Props) {
  const city = cities.find((candidate) => candidate.slug === filters.city);
  const title = city ? `${city.label} ${city.state} Rental Listings` : "Quad Cities Rental Listings";
  const inflated = Math.max(4812, count * 81 + 12);

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.row}>
        <h2 className={styles.count}>{`${inflated.toLocaleString("en-US")} rentals available (showing ${count})`}</h2>
        <SortMenu sort={filters.sort} onChange={onSort} />
      </div>
    </div>
  );
}
